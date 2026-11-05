// All sound is synthesized: no files, no autoplay. Nothing starts until the
// visitor picks "com som", which satisfies both WCAG 1.4.2 and the browsers'
// user-gesture rule in one choice.

export function createAudio() {
  let ctx = null, master, bus, verb;
  let enabled = false;
  const layers = {};
  const last = { ocean: -1, engine: -1, pad: -1, crowd: -1 };

  function pinkNoise(seconds) {
    const len = ctx.sampleRate * seconds, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
      }
    }
    return buf;
  }

  function impulse(seconds, decay) {
    const len = ctx.sampleRate * seconds, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function lfo(freq, depth, target, offset) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = freq; g.gain.value = depth;
    o.connect(g).connect(target); target.value = offset; o.start();
  }

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 3;
    master.connect(comp).connect(ctx.destination);
    bus = ctx.createGain(); bus.connect(master);
    verb = ctx.createConvolver(); verb.buffer = impulse(3.2, 3.5);
    const vg = ctx.createGain(); vg.gain.value = 0.5; verb.connect(vg).connect(master);

    const noise = pinkNoise(4);
    // ocean: a low swell and a hissing wash, each breathing on its own period
    const src = ctx.createBufferSource(); src.buffer = noise; src.loop = true;
    const low = ctx.createBiquadFilter(); low.type = 'lowpass'; low.frequency.value = 420;
    const lowG = ctx.createGain(); lfo(0.085, 0.35, lowG.gain, 0.6);
    const wash = ctx.createBiquadFilter(); wash.type = 'bandpass'; wash.frequency.value = 1700; wash.Q.value = 0.4;
    const washG = ctx.createGain(); lfo(0.13, 0.12, washG.gain, 0.12);
    const oceanG = ctx.createGain(); oceanG.gain.value = 0;
    src.connect(low).connect(lowG).connect(oceanG);
    src.connect(wash).connect(washG).connect(oceanG);
    oceanG.connect(bus); src.start();
    layers.ocean = oceanG;

    // engine: two low partials felt more than heard
    const engG = ctx.createGain(); engG.gain.value = 0;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 160;
    for (const [f, a] of [[41, 0.5], [82, 0.28], [123, 0.1]]) {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f; g.gain.value = a;
      o.type = 'sine'; o.connect(g).connect(lp); o.start();
    }
    lfo(0.4, 18, lp.frequency, 160); // the engine "breathes" ±18 Hz
    lp.connect(engG).connect(bus);
    layers.engine = engG;

    // crowd/party bed for the reward: filtered noise with a slow pulse
    const crowdSrc = ctx.createBufferSource(); crowdSrc.buffer = noise; crowdSrc.loop = true; crowdSrc.playbackRate.value = 0.7;
    const cb = ctx.createBiquadFilter(); cb.type = 'bandpass'; cb.frequency.value = 900; cb.Q.value = 0.8;
    const cG = ctx.createGain(); cG.gain.value = 0;
    crowdSrc.connect(cb).connect(cG).connect(bus); crowdSrc.start();
    layers.crowd = cG;

    // pad for 2026: a slow, open chord
    const padG = ctx.createGain(); padG.gain.value = 0;
    const pf = ctx.createBiquadFilter(); pf.type = 'lowpass'; pf.frequency.value = 900;
    for (const f of [110, 164.81, 220, 277.18, 329.63]) for (const det of [-5, 5]) {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = det;
      const g = ctx.createGain(); g.gain.value = 0.018; o.connect(g).connect(pf); o.start();
    }
    pf.connect(padG); padG.connect(bus); padG.connect(verb);
    layers.pad = padG;
  }

  function env(node, t, a, peak, dec) {
    node.gain.setValueAtTime(0.0001, t);
    node.gain.exponentialRampToValueAtTime(peak, t + a);
    node.gain.exponentialRampToValueAtTime(0.0001, t + a + dec);
  }

  function tone(freq, { type = 'sine', at = 0, a = 0.005, peak = 0.3, dec = 0.4, rev = 0.3 } = {}) {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime + at, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq; env(g, t, a, peak, dec);
    o.connect(g); g.connect(bus);
    if (rev) { const r = ctx.createGain(); r.gain.value = rev; g.connect(r).connect(verb); }
    o.start(t); o.stop(t + a + dec + 0.05);
  }

  const api = {
    get enabled() { return enabled; },
    init,
    setEnabled(on) {
      if (on) init();
      enabled = on;
      if (!ctx) return;
      if (on && ctx.state === 'suspended') ctx.resume();
      master.gain.setTargetAtTime(on ? 0.9 : 0, ctx.currentTime, 0.4);
    },
    // continuous beds, called every frame; only touches the graph on change
    mix(levels) {
      if (!ctx) return;
      for (const k in levels) {
        const v = Math.round(levels[k] * 50) / 50;
        if (v !== last[k] && layers[k]) {
          layers[k].gain.setTargetAtTime(v * (k === 'ocean' ? 0.9 : k === 'crowd' ? 0.12 : k === 'pad' ? 0.6 : 0.5), ctx.currentTime, 0.5);
          last[k] = v;
        }
      }
    },
    ding() { // the PA chime from the script's first seconds
      tone(880, { peak: 0.22, dec: 1.9, rev: 0.6 });
      tone(1760, { peak: 0.04, dec: 1.2, rev: 0.6 });
      tone(698.46, { at: 0.42, peak: 0.22, dec: 2.4, rev: 0.6 });
      tone(1396.9, { at: 0.42, peak: 0.035, dec: 1.4, rev: 0.6 });
    },
    click() { tone(2400, { type: 'square', peak: 0.05, dec: 0.03, rev: 0.1 }); tone(180, { peak: 0.2, dec: 0.12, rev: 0.2 }); },
    tick() { tone(1900, { type: 'triangle', peak: 0.05, dec: 0.05, rev: 0.05 }); },
    beep(ok) {
      if (ok) { tone(1568, { peak: 0.14, dec: 0.18, rev: 0.25 }); tone(2093, { at: 0.11, peak: 0.12, dec: 0.3, rev: 0.3 }); }
      else { tone(622, { type: 'triangle', peak: 0.16, dec: 0.12 }); tone(587, { type: 'triangle', at: 0.16, peak: 0.16, dec: 0.2 }); }
    },
    lamp(i) { tone(1200 + i * 18, { type: 'sine', peak: 0.025, dec: 0.08, rev: 0.4 }); },
    print() {
      for (let i = 0; i < 9; i++) tone(90 + (i % 2) * 12, { type: 'square', at: i * 0.07, peak: 0.04, dec: 0.05, rev: 0 });
      tone(2600, { at: 0.72, type: 'triangle', peak: 0.04, dec: 0.08 });
    },
    whoosh() {
      if (!ctx || !enabled) return;
      const t = ctx.currentTime, s = ctx.createBufferSource(); s.buffer = pinkNoise(1.5);
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2;
      f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(5000, t + 1.1);
      const g = ctx.createGain(); env(g, t, 0.6, 0.5, 0.8);
      s.connect(f).connect(g).connect(bus); g.connect(verb); s.start(t);
    },
  };
  return api;
}

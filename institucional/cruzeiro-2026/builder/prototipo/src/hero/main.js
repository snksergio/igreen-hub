import Lenis from 'lenis';
import { createAudio } from '../audio.js';

// One day aboard, one continuous film, driven by scroll. p ∈ [0,1] is the scroll
// through .story; the film is scrubbed to it, and the clock, chapters and copy
// ride the film's own timeline (the rooms sit at known seconds).
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ss = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const video = document.querySelector('.plate');
const dawn = document.querySelector('.dawn');
const scrim = document.querySelector('.scrim');
const foot = document.querySelector('.foot');
const gate = document.querySelector('.gate');
const soundBtn = document.querySelector('.sound');
const clockTime = document.querySelector('.clock-time b');
const arcDone = document.querySelector('.arc--done');
const sun = document.querySelector('.clock-arc .sun');
const moon = document.querySelector('.clock-arc .moon');
const audio = createAudio();

// ——— the film's map: where each room starts (seconds), and what time it is there
// room starts on the film (s): sea, stern, pool deck, promenade, restaurant, theatre, party, high over party, night ship
// room starts on the film (s): sea, stern, pool deck, promenade, restaurant, theatre, party, high over party, night ship
const ROOMS = [0, 6, 12, 18, 30, 36, 42, 48, 54.04]; // one continuous Seedance take (30 s + 24 s extension)
const HOURS = [9.0, 10.5, 13.0, 15.7, 17.3, 19.0, 22.0, 23.2, 23.7];
const D = ROOMS[ROOMS.length - 1];
// scroll → film time: the approach gets extra scroll (the titles live there),
// the rooms run linear, and the last stretch holds on the night ship for the hero
const P_APPROACH = 0.16, P_END = 0.9;
function timeAt(p) {
  if (p <= P_APPROACH) return ss(0, 1, p / P_APPROACH) * ROOMS[1];
  if (p >= P_END) return D;
  return lerp(ROOMS[1], D, (p - P_APPROACH) / (P_END - P_APPROACH));
}
function pAt(t) { // inverse, for placing chapters
  if (t <= ROOMS[1]) { const u = t / ROOMS[1]; let lo = 0, hi = 1; for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (ss(0, 1, m) < u) lo = m; else hi = m; } return lo * P_APPROACH; }
  return P_APPROACH + (t - ROOMS[1]) / (D - ROOMS[1]) * (P_END - P_APPROACH);
}

// ——— sound: a choice at the gate, a visible toggle after ————————————————
function setSound(on) {
  audio.setEnabled(on);
  soundBtn.setAttribute('aria-pressed', String(on));
  soundBtn.setAttribute('aria-label', on ? 'Desligar som' : 'Ligar som');
}
soundBtn.addEventListener('click', () => setSound(!audio.enabled));

// ——— lenis + gate ————————————————————————————————————————————————
const lenis = new Lenis({ lerp: reduced ? 1 : 0.07, smoothWheel: true, autoRaf: false });
lenis.stop();

let shown = 0; // eased film position, so the camera keeps a cinematic weight
function enter(withSound) {
  setSound(withSound);
  gate.classList.add('is-gone');
  document.body.classList.remove('is-gate');
  window.scrollTo(0, 0);
  lenis.start();
  if (withSound) setTimeout(() => audio.ding(), 2200);
}
gate.querySelectorAll('[data-sound]').forEach((b) => b.addEventListener('click', () => enter(b.dataset.sound === 'on')));
const wave = gate.querySelector('.w');
if (wave) { const L = wave.getTotalLength(); wave.style.strokeDasharray = L; wave.style.setProperty('--len', L); }

// the film must be ready to seek before the doors open; phones get the lighter encode
video.src = innerWidth < 900 ? '/hero/film-1280.mp4' : '/hero/film-1920.mp4';
gate.classList.add('is-loading');
function ready() { gate.classList.remove('is-loading'); }
if (video.readyState >= 3) ready(); else { video.addEventListener('canplaythrough', ready, { once: true }); video.addEventListener('error', ready, { once: true }); }
setTimeout(ready, 12000); // never hold the door forever
if (typeof video.load === 'function') video.load();

// ——— reveals: data-r="in0 in1 out0 out1" against p ——————————————————————
// chapters are placed on the film's clock: each one lives in the first half of its room
const chapters = [...document.querySelectorAll('.chapter')];
chapters.forEach((el, i) => {
  const a = pAt(ROOMS[i + 1]), b = pAt(ROOMS[i + 2]), w = b - a;
  el.dataset.r = `${(a + w * 0.02).toFixed(4)} ${(a + w * 0.12).toFixed(4)} ${(a + w * 0.58).toFixed(4)} ${(a + w * 0.7).toFixed(4)}`;
});
const reveals = [...document.querySelectorAll('[data-r]')].map((el) => ({ el, r: el.dataset.r.split(/\s+/).map(Number), k: -1 }));
const chapterWins = chapters.map((el) => el.dataset.r.split(/\s+/).map(Number));
function reveal(p) {
  for (const it of reveals) {
    const [a, b, c = 2, d = 3] = it.r;
    const i = ss(a, b, p), o = ss(c, d, p), v = i * (1 - o);
    const k = Math.round(v * 400); if (k === it.k) continue; it.k = k;
    it.el.style.opacity = v.toFixed(3);
    it.el.style.visibility = v < 0.003 ? 'hidden' : 'visible';
    if (!reduced) it.el.style.transform = `translate3d(0, ${((1 - i) * 22 - o * 16).toFixed(1)}px, 0)`;
  }
}

// ——— the clock ———————————————————————————————————————————————————
let lastClock = '';
function clock(t) {
  let seg = 0; while (seg < ROOMS.length - 2 && t >= ROOMS[seg + 1]) seg++;
  const h = lerp(HOURS[seg], HOURS[seg + 1], clamp01((t - ROOMS[seg]) / (ROOMS[seg + 1] - ROOMS[seg])));
  const hh = Math.floor(h), mm = Math.floor((h - hh) * 60);
  const txt = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  if (txt !== lastClock) { lastClock = txt; clockTime.textContent = txt; }
  // sun from 06:00 to 18:30, moon from 18:30 to 24:00 — both ride the same arc
  const day = clamp01((h - 6) / 12.5), night = clamp01((h - 18.5) / 5.5);
  const ang = (v) => Math.PI * (1 - v), r = 94, cx = 100, cy = 54;
  const pt = (v) => `translate(${(cx + r * Math.cos(ang(v))).toFixed(1)}px, ${(cy - r * Math.sin(ang(v))).toFixed(1)}px)`;
  sun.style.transform = pt(day); sun.style.opacity = h < 18.8 ? (1 - ss(17.5, 18.8, h)).toFixed(2) : 0;
  moon.style.transform = pt(night); moon.style.opacity = ss(18.2, 19.2, h).toFixed(2);
  arcDone.style.setProperty('--off', (296 * (1 - (h < 18.5 ? day : night))).toFixed(1));
  return seg;
}

// ——— audio zones, per room ———————————————————————————————————————————
const ZONES = [
  { ocean: 0.9, engine: 0.2, crowd: 0, pad: 0 },      // 1 open sea
  { ocean: 1, engine: 0.6, crowd: 0.05, pad: 0 },     // 2 the stern
  { ocean: 0.7, engine: 0.3, crowd: 0.3, pad: 0.1 },  // 3 pool deck
  { ocean: 0.5, engine: 0.3, crowd: 0.2, pad: 0.15 }, // 4 promenade
  { ocean: 0.15, engine: 0.1, crowd: 0.6, pad: 0.25 },// 5 restaurant
  { ocean: 0.05, engine: 0.05, crowd: 1, pad: 0.4 },  // 6 theatre
  { ocean: 0.3, engine: 0.1, crowd: 1, pad: 0.6 },    // 7 party
  { ocean: 0.5, engine: 0.2, crowd: 0.5, pad: 0.6 },  // 7½ high over the party
  { ocean: 0.8, engine: 0.3, crowd: 0.1, pad: 0.5 },  // 8 night
];
let lastZone = -1;
function zone(seg) { if (seg !== lastZone) { if (lastZone >= 0) audio.whoosh(); lastZone = seg; audio.mix(ZONES[seg]); } }

// ——— the loop ———————————————————————————————————————————————————————
function frame(now) {
  lenis.raf(now);
  tick();
  requestAnimationFrame(frame);
}
function tick() {
  const max = document.querySelector('.story').offsetHeight - innerHeight;
  const p = clamp01(scrollY / Math.max(1, max));
  shown = reduced ? p : lerp(shown, p, 0.1);

  const t = timeAt(shown);
  if (video.duration && !video.seeking) {
    const want = Math.min(t, video.duration - 0.05);
    if (Math.abs(video.currentTime - want) > 1 / 48) video.currentTime = want;
  }
  const seg = clock(t);
  // the veil: black for the first beat, then the day does the rest
  const veil = 1 - ss(0.015, 0.09, shown);
  dawn.style.opacity = veil.toFixed(3);
  // scrim under the copy beats: the opening titles and the hero at the end
  const copyOn = ss(0.03, 0.08, p) * (1 - ss(0.15, 0.2, p)) + ss(0.88, 0.95, p);
  scrim.style.opacity = Math.min(1, copyOn).toFixed(3);
  // a soft foot under the chapter cards, only while one is on screen
  let footOn = 0; for (const [a, b, c, d] of chapterWins) footOn = Math.max(footOn, ss(a, b, p) * (1 - ss(c, d, p)));
  foot.style.opacity = footOn.toFixed(3);
  reveal(p); zone(t >= D - 0.2 ? ZONES.length - 1 : seg);
}
requestAnimationFrame(frame);
// dev hook: snap the eased position for screenshots and tests
if (import.meta.env.DEV) window.__hero = { set(p) { const s = document.querySelector('.story'); scrollTo(0, p * (s.offsetHeight - innerHeight)); shown = p; tick(); }, timeAt, pAt };

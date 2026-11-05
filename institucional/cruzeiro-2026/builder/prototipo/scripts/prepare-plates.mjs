// Prepares generated clips for scroll-scrubbing.
// Usage: node scripts/prepare-plates.mjs <name>=<url> ...
// Encode choices follow the KAI (mount inc.) case study: dense keyframes so a
// seek lands on an I-frame, faststart so the moov atom comes first, no audio.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import ffmpeg from 'ffmpeg-static';

const out = 'public/entrada';
mkdirSync(`${out}/raw`, { recursive: true });
mkdirSync(`${out}/frames`, { recursive: true });

for (const arg of process.argv.slice(2)) {
  const [name, url] = arg.split(/=(.*)/s);
  const raw = `${out}/raw/${name}.mp4`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
  execFileSync(ffmpeg, [
    '-y', '-i', raw, '-an',
    '-vf', 'scale=1920:-2:flags=lanczos,format=yuv420p',
    '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '21',
    '-g', '3', '-keyint_min', '3', '-sc_threshold', '0', '-bf', '0',
    '-movflags', '+faststart', `${out}/${name}.mp4`,
  ], { stdio: 'inherit' });
  // five evenly spaced stills, used to track overlays against the footage
  execFileSync(ffmpeg, ['-y', '-i', raw, '-vf', 'fps=1,scale=1280:-2', `${out}/frames/${name}-%d.jpg`], { stdio: 'inherit' });
  console.log(`ok ${name}`);
}

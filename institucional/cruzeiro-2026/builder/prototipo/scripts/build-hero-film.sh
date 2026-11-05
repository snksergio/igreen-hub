#!/usr/bin/env bash
# Assemble the hero film from the Kling segments in public/hero/raw into one MP4
# tuned for scroll scrubbing (dense keyframes, no B-frames). Order = ORDER below.
# Each segment starts on the exact frame the previous one ended on (shared keyframe),
# so the concat is seamless. Prints each segment's start time for ROOMS[] in main.js.
# Usage: bash scripts/build-hero-film.sh [trim_s12_seconds]
set -euo pipefail
cd "$(dirname "$0")/.."
FF="$(node -e 'process.stdout.write(require("ffmpeg-static"))')"
RAW=public/hero/raw
TRIM="${1:-3.5}"   # the first segment holds still before the approach; drop that

# v2 order: approach, descend to deck (2), pool→door→promenade, promenade→door→restaurant,
# restaurant→door→theater, theater→door→party, crane up (s7a), pull back (2)
ORDER=(s12-trim v01 v02 v03 v04 v05 v06 v07 v08 v09 v10 s7a v11 v12)

# 1) trim the hold off s12 (re-encode so the cut is frame-exact)
"$FF" -y -loglevel error -ss "$TRIM" -i "$RAW/s12.mp4" -c:v libx264 -preset fast -crf 14 -pix_fmt yuv420p -an "$RAW/s12-trim.mp4"

# 2) concat in order
: > "$RAW/list.txt"; for f in "${ORDER[@]}"; do echo "file '$f.mp4'" >> "$RAW/list.txt"; done
"$FF" -y -loglevel error -f concat -safe 0 -i "$RAW/list.txt" -c:v libx264 -preset slow -crf 15 -pix_fmt yuv420p -an "$RAW/film-master.mp4"

# 3) scrub encodes: 1080p and 720p, keyframe every 6 frames
for R in 1920:1080 1280:720; do
  W="${R%%:*}"
  "$FF" -y -loglevel error -i "$RAW/film-master.mp4" -vf "scale=$R" -c:v libx264 -preset slow -crf 29 -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart -an "public/hero/film-$W.mp4"
done

# 4) posters and a contact sheet for review
"$FF" -y -loglevel error -i "$RAW/film-master.mp4" -frames:v 1 -q:v 2 public/hero/poster-start.jpg
"$FF" -y -loglevel error -sseof -0.05 -i "$RAW/film-master.mp4" -frames:v 1 -q:v 2 public/hero/poster-end.jpg
"$FF" -y -loglevel error -i "$RAW/film-master.mp4" -vf "fps=1/2,scale=384:-2,tile=8x5" -frames:v 1 -q:v 4 public/intro/frames/film-sheet.jpg

# 5) segment start times → ROOMS[] in src/hero/main.js
echo "--- segments: duration, cumulative start ---"
node -e '
const {execSync}=require("child_process"); const ff=process.argv[1]; const order=process.argv.slice(2); let t=0; const starts=[];
for (const f of order) { let out=""; try { execSync(`"${ff}" -i public/hero/raw/${f}.mp4`, {stdio:"pipe"}); } catch (e) { out=e.stderr.toString(); }
  const m=out.match(/Duration: (\d+):(\d+):([\d.]+)/); const d=m?(+m[1]*3600+ +m[2]*60+ +m[3]):0; starts.push(t.toFixed(2)); console.log(`${f}\t${d.toFixed(2)}\tstarts ${t.toFixed(2)}`); t+=d; }
console.log("STARTS", starts.join(", "), "END", t.toFixed(2));
' "$FF" "${ORDER[@]}"
ls -la public/hero/film-*.mp4

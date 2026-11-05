#!/usr/bin/env bash
# Encode any master MP4 into the site's scrub-ready films (1080p + 720p) + posters + review sheet.
# Usage: bash scripts/encode-film.sh <master.mp4>
set -euo pipefail
cd "$(dirname "$0")/.."
FF="$(node -e 'process.stdout.write(require("ffmpeg-static"))')"
M="$1"
for R in 1920:1080 1280:720; do
  W="${R%%:*}"
  "$FF" -y -loglevel error -i "$M" -vf "scale=$R:flags=lanczos" -c:v libx264 -preset slow -crf 29 -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart -an "public/hero/film-$W.mp4"
done
"$FF" -y -loglevel error -i "$M" -frames:v 1 -q:v 2 public/hero/poster-start.jpg
"$FF" -y -loglevel error -sseof -0.05 -i "$M" -frames:v 1 -q:v 2 public/hero/poster-end.jpg
"$FF" -y -loglevel error -i "$M" -vf "fps=1,scale=384:-2,tile=8x5" -frames:v 1 -q:v 4 public/intro/frames/film-sheet.jpg
"$FF" -i "$M" 2>&1 | grep -oE 'Duration: [0-9:.]+' || true
ls -la public/hero/film-*.mp4

#!/bin/bash
# Convert all WAV files to 320kbps MP3s using ffmpeg

DIR="$(cd "$(dirname "$0")" && pwd)"

for wav in "$DIR"/*.wav; do
  [ -f "$wav" ] || continue
  mp3="${wav%.wav}.mp3"
  echo "Converting: $(basename "$wav")"
  ffmpeg -i "$wav" -codec:a libmp3lame -b:a 320k -y "$mp3"
done

echo "Done."

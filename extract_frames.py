import subprocess
import os

video = r"c:\Users\Sanju\Downloads\bdty\WhatsApp Video 2026-08-07 at 3.50.44 AM.mp4"
out_dir = r"c:\Users\Sanju\Downloads\bdty\ref_frames"
os.makedirs(out_dir, exist_ok=True)

# Extract 1 frame per second
subprocess.run([
    "ffmpeg", "-i", video,
    "-vf", "fps=1",
    "-q:v", "2",
    os.path.join(out_dir, "frame_%03d.jpg"),
    "-y"
], capture_output=True)

# List what was created
for f in sorted(os.listdir(out_dir)):
    print(f, os.path.getsize(os.path.join(out_dir, f)))

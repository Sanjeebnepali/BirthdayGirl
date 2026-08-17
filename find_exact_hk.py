import os
from PIL import Image

frames_dir = r"C:\Users\Sanju\.gemini\antigravity-ide\brain\9d024867-cea7-4ed3-998e-09d9320d3ee4\video_frames"
output_dir = r"c:\Users\Sanju\Downloads\bdty\public"

img_f13 = Image.open(os.path.join(frames_dir, "frame_013.png"))

# Save slices
for y in range(400, 900, 100):
  img_f13.crop((300, y, 420, y+100)).save(os.path.join(output_dir, f"test_hk_{y}.png"))

img_f10 = Image.open(os.path.join(frames_dir, "frame_010.png"))
for y in range(400, 900, 100):
  img_f10.crop((300, y, 420, y+100)).save(os.path.join(output_dir, f"test_plane_{y}.png"))

print("Saved slices!")

import os
import numpy as np
from PIL import Image

frames_dir = r"C:\Users\Sanju\.gemini\antigravity-ide\brain\9d024867-cea7-4ed3-998e-09d9320d3ee4\video_frames"
output_dir = r"c:\Users\Sanju\Downloads\bdty\public"

# Inspect frame_018.png from y=500 to y=750
img_f18 = Image.open(os.path.join(frames_dir, "frame_018.png"))
arr = np.array(img_f18.convert("RGB"))

# Let's crop y from 560 to 730, x from 290 to 430
bunny_crop = img_f18.crop((290, 565, 430, 725))
bunny_crop.save(os.path.join(output_dir, "bunny_cake.png"))

# Hello Kitty Airplane in frame_010.png: y from 520 to 620, x from 310 to 410
img_f10 = Image.open(os.path.join(frames_dir, "frame_010.png"))
img_f10.crop((310, 520, 410, 610)).save(os.path.join(output_dir, "kitty_airplane.png"))

# Hello Kitty Standing in frame_013.png: y from 470 to 570, x from 310 to 410
img_f13 = Image.open(os.path.join(frames_dir, "frame_013.png"))
img_f13.crop((315, 475, 405, 565)).save(os.path.join(output_dir, "kitty_standing.png"))

# Photo 1 in frame_019.png: y from 500 to 740, x from 270 to 450
img_f19 = Image.open(os.path.join(frames_dir, "frame_019.png"))
img_f19.crop((270, 500, 450, 740)).save(os.path.join(output_dir, "photo1.png"))

# Photo 2 in frame_021.png: y from 500 to 740, x from 270 to 450
img_f21 = Image.open(os.path.join(frames_dir, "frame_021.png"))
img_f21.crop((270, 500, 450, 740)).save(os.path.join(output_dir, "photo2.png"))

print("Extracted exact assets!")

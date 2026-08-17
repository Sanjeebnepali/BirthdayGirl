import os
from PIL import Image

frames_dir = r"C:\Users\Sanju\.gemini\antigravity-ide\brain\9d024867-cea7-4ed3-998e-09d9320d3ee4\video_frames"
output_dir = r"c:\Users\Sanju\Downloads\bdty\public"

# frame_010.png: Hello Kitty Airplane
img_f10 = Image.open(os.path.join(frames_dir, "frame_010.png"))
img_f10.crop((310, 500, 410, 580)).save(os.path.join(output_dir, "kitty_airplane.png"))

# frame_013.png: Hello Kitty Standing
img_f13 = Image.open(os.path.join(frames_dir, "frame_013.png"))
img_f13.crop((320, 465, 400, 555)).save(os.path.join(output_dir, "kitty_standing.png"))

# frame_018.png: Bunny with cake
img_f18 = Image.open(os.path.join(frames_dir, "frame_018.png"))
img_f18.crop((290, 565, 430, 765)).save(os.path.join(output_dir, "bunny_cake.png"))

# frame_019.png: Photo 1
img_f19 = Image.open(os.path.join(frames_dir, "frame_019.png"))
img_f19.crop((270, 535, 450, 740)).save(os.path.join(output_dir, "photo1.png"))

# frame_021.png: Photo 2
img_f21 = Image.open(os.path.join(frames_dir, "frame_021.png"))
img_f21.crop((270, 535, 450, 740)).save(os.path.join(output_dir, "photo2.png"))

print("Cropped assets with updated coordinates!")

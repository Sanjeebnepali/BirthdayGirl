import os
from PIL import Image

frames_dir = r"C:\Users\Sanju\.gemini\antigravity-ide\brain\9d024867-cea7-4ed3-998e-09d9320d3ee4\video_frames"
output_dir = r"c:\Users\Sanju\Downloads\bdty\public"

os.makedirs(output_dir, exist_ok=True)

# 1. Hello Kitty Airplane (from frame_010.png)
img_f10 = Image.open(os.path.join(frames_dir, "frame_010.png"))
kitty_plane_crop = img_f10.crop((315, 475, 405, 545))
kitty_plane_crop.save(os.path.join(output_dir, "kitty_airplane.png"))

# 2. Hello Kitty Standing (from frame_013.png)
img_f13 = Image.open(os.path.join(frames_dir, "frame_013.png"))
kitty_standing_crop = img_f13.crop((320, 445, 400, 515))
kitty_standing_crop.save(os.path.join(output_dir, "kitty_standing.png"))

# 3. Bunny holding Cake (from frame_018.png)
img_f18 = Image.open(os.path.join(frames_dir, "frame_018.png"))
bunny_crop = img_f18.crop((295, 570, 425, 765))
bunny_crop.save(os.path.join(output_dir, "bunny_cake.png"))

# 4. Anime Couple Photo 1 (from frame_019.png)
img_f19 = Image.open(os.path.join(frames_dir, "frame_019.png"))
photo1_crop = img_f19.crop((275, 435, 445, 605))
photo1_crop.save(os.path.join(output_dir, "photo1.png"))

# 5. Anime Couple Photo 2 (from frame_021.png)
img_f21 = Image.open(os.path.join(frames_dir, "frame_021.png"))
photo2_crop = img_f21.crop((270, 435, 450, 605))
photo2_crop.save(os.path.join(output_dir, "photo2.png"))

print("Refined crop assets successfully!")

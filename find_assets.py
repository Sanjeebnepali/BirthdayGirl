import os
import numpy as np
from PIL import Image

frames_dir = r"C:\Users\Sanju\.gemini\antigravity-ide\brain\9d024867-cea7-4ed3-998e-09d9320d3ee4\video_frames"
output_dir = r"c:\Users\Sanju\Downloads\bdty\public"

def auto_crop_center_asset(frame_name, out_name):
  img_path = os.path.join(frames_dir, frame_name)
  img = Image.open(img_path).convert("RGB")
  arr = np.array(img)

  # Pink background in the browser view is around R:255, G:225-240, B:235-250
  # Let's inspect the browser region (y between 430 and 850)
  browser_region = arr[430:850, :]

  # Mask out typical background pink: (R > 240 and G > 210 and B > 220)
  r, g, b = browser_region[:,:,0], browser_region[:,:,1], browser_region[:,:,2]
  bg_mask = (r > 240) & (g > 215) & (b > 225)
  asset_mask = ~bg_mask

  # Find non-bg coordinates
  ys, xs = np.where(asset_mask)
  if len(ys) > 0:
    min_y, max_y = ys.min() + 430, ys.max() + 430
    min_x, max_x = xs.min(), xs.max()
    print(f"{frame_name} asset bbox: x=[{min_x}, {max_x}], y=[{min_y}, {max_y}]")

    # Crop and save
    cropped = img.crop((min_x - 5, min_y - 5, max_x + 5, max_y + 5))
    cropped.save(os.path.join(output_dir, out_name))

auto_crop_center_asset("frame_010.png", "kitty_airplane.png")
auto_crop_center_asset("frame_013.png", "kitty_standing.png")
auto_crop_center_asset("frame_018.png", "bunny_cake.png")
auto_crop_center_asset("frame_019.png", "photo1.png")
auto_crop_center_asset("frame_021.png", "photo2.png")

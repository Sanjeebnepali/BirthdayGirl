import os
import numpy as np
from PIL import Image

frames_dir = r"C:\Users\Sanju\.gemini\antigravity-ide\brain\9d024867-cea7-4ed3-998e-09d9320d3ee4\video_frames"

def get_center_bbox(frame_name, ymin, ymax):
  img_path = os.path.join(frames_dir, frame_name)
  img = Image.open(img_path).convert("RGB")
  arr = np.array(img)
  sub_arr = arr[ymin:ymax, 200:520]

  r, g, b = sub_arr[:,:,0], sub_arr[:,:,1], sub_arr[:,:,2]
  is_bg = (r > 240) & (g > 220) & (b > 230)
  is_fg = ~is_bg

  ys, xs = np.where(is_fg)
  if len(ys) > 0:
    min_x, max_x = xs.min() + 200, xs.max() + 200
    min_y, max_y = ys.min() + ymin, ys.max() + ymin
    print(f"{frame_name}: x=[{min_x}, {max_x}], y=[{min_y}, {max_y}]")

get_center_bbox("frame_010.png", 460, 600)
get_center_bbox("frame_013.png", 440, 560)
get_center_bbox("frame_018.png", 460, 620)
get_center_bbox("frame_019.png", 460, 620)
get_center_bbox("frame_021.png", 460, 620)

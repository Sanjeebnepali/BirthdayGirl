from PIL import Image
import os

frames_dir = r"C:\Users\Sanju\.gemini\antigravity-ide\brain\9d024867-cea7-4ed3-998e-09d9320d3ee4\video_frames"
output_dir = r"c:\Users\Sanju\Downloads\bdty\public"

os.makedirs(output_dir, exist_ok=True)

# 1. Hello Kitty Airplane from frame_010
img_f10 = Image.open(os.path.join(frames_dir, "frame_010.png"))
bg_color = img_f10.getpixel((100, 400)) # Top left of browser content
print("Exact background color in video:", bg_color) # (R, G, B, A) or (R, G, B)

# Crop Hello Kitty Airplane: (x1, y1, x2, y2)
crop_hk = img_f10.crop((280, 470, 370, 550)).convert("RGBA")

# Make transparent: any pixel close to bg_color becomes transparent (A=0)
datas = crop_hk.getdata()
new_data = []
bg_r, bg_g, bg_b = bg_color[0], bg_color[1], bg_color[2]

for item in datas:
    # Check distance to bg_color
    r, g, b, a = item
    if abs(r - bg_r) < 15 and abs(g - bg_g) < 15 and abs(b - bg_b) < 15:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)

crop_hk.putdata(new_data)
crop_hk.save(os.path.join(output_dir, "kitty_airplane_transparent.png"))

print("Saved transparent kitty_airplane_transparent.png!")

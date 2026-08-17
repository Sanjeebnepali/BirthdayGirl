import cv2
import os

video_path = r"C:\Users\Sanju\.gemini\antigravity-ide\brain\9d024867-cea7-4ed3-998e-09d9320d3ee4\.tempmediaStorage\media_9d024867-cea7-4ed3-998e-09d9320d3ee4_1786200124237.mp4"
out_dir = r"c:\Users\Sanju\Downloads\bdty\scratch_frames"
os.makedirs(out_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)
print("FPS:", fps)

count = 0
saved = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    sec = count / fps
    if 11.0 <= sec <= 16.5:
        cv2.imwrite(os.path.join(out_dir, f"frame_{count:04d}_sec_{sec:.2f}.png"), frame)
        saved += 1
    count += 1

cap.release()
print(f"Done extracting {saved} video frames!")

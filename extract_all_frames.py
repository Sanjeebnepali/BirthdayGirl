import cv2
import os

video_path = r"C:\Users\Sanju\Downloads\WhatsApp Video 2026-08-07 at 3.50.44 AM.mp4"
cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)
count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
w = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
h = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
print(f"FPS: {fps}, Frames: {count}, Resolution: {w}x{h}, Duration: {count/fps:.2f}s")

out_dir = r"c:\Users\Sanju\Downloads\bdty\video_all_frames"
os.makedirs(out_dir, exist_ok=True)

idx = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    sec = idx / fps
    cv2.imwrite(os.path.join(out_dir, f"frame_{idx:04d}_sec_{sec:.2f}.png"), frame)
    idx += 1
cap.release()
print(f"Extracted {idx} frames to {out_dir}")

import cv2
import os

video_path = r"C:\Users\Sanju\Downloads\WhatsApp Video 2026-08-07 at 3.50.44 AM.mp4"
cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)

out_dir = r"c:\Users\Sanju\Downloads\bdty\loading_frames"
os.makedirs(out_dir, exist_ok=True)

# Loading screen is roughly between 1.5s and 4.0s in the video
idx = 0
saved = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    sec = idx / fps
    if 1.5 <= sec <= 4.0:
        # Crop the browser viewport center
        # Resolution is 576 x 1024 or similar, let's save full frame and crop
        h, w, _ = frame.shape
        # browser viewport is roughly y: 350 to 650, x: 20 to 550
        crop = frame[int(h*0.37):int(h*0.65), int(w*0.05):int(w*0.95)]
        cv2.imwrite(os.path.join(out_dir, f"loading_{saved:03d}_sec_{sec:.2f}.png"), crop)
        saved += 1
    idx += 1

cap.release()
print(f"Saved {saved} loading cropped frames!")

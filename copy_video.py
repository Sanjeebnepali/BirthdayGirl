import shutil
import os

src = r"c:\Users\Sanju\Downloads\bdty\videoplayback (2).mp4"
dst = r"c:\Users\Sanju\Downloads\bdty\public\message_intro.mp4"

if os.path.exists(src):
    shutil.copy(src, dst)
    print(f"Copied {src} to {dst}, size: {os.path.getsize(dst)} bytes")
else:
    print(f"Source file {src} does not exist!")

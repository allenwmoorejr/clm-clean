# rapture_frames.py
from PIL import Image, ImageDraw, ImageFilter
import math
import os

frames_dir = "rapture_frames"
os.makedirs(frames_dir, exist_ok=True)

width, height = 640, 360
num_frames = 60  # adjust for longer/shorter video

for i in range(num_frames):
    img = Image.new("RGB", (width, height), "black")
    draw = ImageDraw.Draw(img)

    # Create swirling lights and rising silhouettes
    angle = i * 6  # rotate colors
    radius = 300 + i * 2  # expanding circle
    for offset in range(0, 360, 15):
        x = int(width/2 + radius * math.cos(math.radians(angle + offset)))
        y = int(height/2 + radius * math.sin(math.radians(angle + offset)))
        color = (int((offset+i) % 255), int((2*offset) % 255), int((3*i) % 255))
        draw.ellipse((x-20, y-20, x+20, y+20), fill=color)

    # Transparent clouds rising upward
    draw.rectangle((0, height - i*5 % height, width, height), fill=(255,255,255,50))

    # Slight blur for a dreamy effect
    img = img.filter(ImageFilter.GaussianBlur(2))

    img.save(f"{frames_dir}/frame_{i:03d}.jpg")

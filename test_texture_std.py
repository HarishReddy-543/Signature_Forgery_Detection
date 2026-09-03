import cv2
import numpy as np
from PIL import Image, ImageDraw
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.model import convert_to_rgb

def create_antialiased_canvas():
    img = Image.new('RGBA', (300, 150), color=(0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    
    # Draw thick, antialiased lines like a canvas would
    d.line([(30, 30), (100, 120), (180, 40)], fill=(0, 0, 0, 255), width=4, joint='curve')
    return img

if __name__ == "__main__":
    img = create_antialiased_canvas()
    rgb_img = convert_to_rgb(img)
    
    # Simulate backend logic
    img_arr = np.array(rgb_img)
    img_gray = cv2.cvtColor(img_arr, cv2.COLOR_RGB2GRAY)
    
    _, thresh = cv2.threshold(img_gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    total_ink = np.sum(thresh > 0)
    print(f"Total Ink: {total_ink}")
    
    ink_pixels = img_gray[thresh > 0]
    texture_std = np.std(ink_pixels)
    
    print(f"Texture STD: {texture_std:.2f}")
    if texture_std > 35:
        print("FAILED: High texture detected!")
    else:
        print("PASSED: Low texture.")

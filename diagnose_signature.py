
import sys
import os
from PIL import Image
import numpy as np
import cv2

def analyze_image(img_path):
    if not os.path.exists(img_path):
        print(f"File not found: {img_path}")
        return

    print(f"\n--- Detailed Analysis for: {os.path.basename(img_path)} ---")
    image = Image.open(img_path)
    
    # Normalization as in model.py
    if image.mode in ('RGBA', 'LA', 'P'):
        try:
            if image.mode == 'P': image = image.convert('RGBA')
            background = Image.new("RGB", image.size, (255, 255, 255))
            if 'A' in image.getbands():
                background.paste(image, mask=image.split()[-1])
            else:
                background.paste(image)
            image = background
        except: image = image.convert('RGB')
    else:
        image = image.convert('RGB')

    if image.width > 800 or image.height > 800:
        image = image.copy()
        image.thumbnail((800, 800))

    img_gray = image.convert('L')
    img_arr = np.array(img_gray)
    rows, cols = img_arr.shape
    mean_val = np.mean(img_arr)
    
    print(f"Mean: {mean_val:.2f}")

    # Check 2: Density
    content_threshold = mean_val - 25
    content_mask = img_arr < content_threshold
    density = np.sum(content_mask) / content_mask.size
    print(f"Density: {density:.4f}")

    # Check 3: Laplacian Sharpness
    img_cv = np.array(img_gray)
    laplacian_var = cv2.Laplacian(img_cv, cv2.CV_64F).var()
    print(f"Laplacian Var (Sharpness): {laplacian_var:.1f}")

    # Check 4: Color Diversity
    img_small = image.resize((100, 100))
    colors = img_small.getcolors(100*100)
    num_unique_colors = len(colors) if colors else 1000
    print(f"Unique Colors: {num_unique_colors}")

    # Check 5: Saturation
    img_hsv = image.convert('HSV')
    hsv_arr = np.array(img_hsv)
    avg_sat = np.mean(hsv_arr[:,:,1])
    print(f"Avg Saturation: {avg_sat:.2f}")





# Analyze the user provided images
# Image 0: Likely the Text/Code image that was falsely accepted
img0_path = r"C:/Users/hr350/.gemini/antigravity/brain/119957a2-cc6c-4df0-b52e-c7859e60a775/uploaded_media_0_1769505515781.png"

# Image 1: Likely the Genuine Signature that was falsely rejected
img1_path = r"C:/Users/hr350/.gemini/antigravity/brain/119957a2-cc6c-4df0-b52e-c7859e60a775/uploaded_media_1769506965985.png"

import sys
import os
import numpy as np
import cv2
from PIL import Image, ImageOps

def analyze_full(img_path, label):
    if not os.path.exists(img_path):
        print(f"File not found: {img_path}")
        return

    print(f"\n--- Analysis: {os.path.basename(img_path)} ---", flush=True)
    image = Image.open(img_path)
    
    # 1. Normalization (Copy-paste from model.py)
    if image.mode in ('RGBA', 'LA', 'P'):
        try:
            if image.mode == 'P': image = image.convert('RGBA')
            background = Image.new("RGB", image.size, (255, 255, 255))
            if 'A' in image.getbands():
                background.paste(image, mask=image.split()[-1])
            else:
                background.paste(image)
            image = background
        except: image = image.convert('RGB')
    else:
        image = image.convert('RGB')
        
    if image.width > 800 or image.height > 800:
        image = image.copy()
        image.thumbnail((800, 800))

    img_gray = image.convert('L')
    img_arr = np.array(img_gray)
    rows, cols = img_arr.shape
    mean_val = np.mean(img_arr)
    print(f"M:{mean_val:.2f}")
    if mean_val < 110:
        image = ImageOps.invert(image)
        img_gray = image.convert('L')
        img_arr = np.array(img_gray)
        mean_val = np.mean(img_arr)
        print(f"InvM:{mean_val:.2f}")

    content_threshold = mean_val - 40
    content_mask = img_arr < content_threshold
    density = np.sum(content_mask) / content_mask.size
    print(f"D:{density:.4f}")

    laplacian_var = cv2.Laplacian(img_arr, cv2.CV_64F).var()
    print(f"S:{laplacian_var:.1f}")

    h_proj = np.sum(content_mask, axis=1)
    threshold = cols * 0.05
    above_threshold = h_proj > threshold
    if len(above_threshold) > 0:
        transitions = np.diff(above_threshold.astype(int))
        bands = np.sum(transitions == 1)
        if above_threshold[0]: bands += 1
    else:
        bands = 0
    print(f"B:{bands}")

    img_small = image.resize((100, 100))
    colors = img_small.getcolors(100*100)
    num_unique_colors = len(colors) if colors else 1000
    print(f"C:{num_unique_colors}")

    v_proj = np.sum(content_mask, axis=0)
    v_threshold = rows * 0.05
    v_above = v_proj > v_threshold
    v_cols = 0
    if len(v_above) > 0:
        trans = np.diff(v_above.astype(int))
        v_cols = np.sum(trans == 1)
    print(f"VC:{v_cols}")

    img_hsv = image.convert('HSV')
    hsv_arr = np.array(img_hsv)
    avg_sat = np.mean(hsv_arr[:,:,1])
    print(f"Sat:{avg_sat:.2f}")

analyze_full(img1_path, "Sig")





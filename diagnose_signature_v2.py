
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
    
    # Check 6: Peaks
    h_proj = np.sum(content_mask, axis=1)
    h_proj_smooth = np.convolve(h_proj, np.ones(5)/5, mode='same')
    peaks = 0
    for i in range(1, len(h_proj_smooth)-1):
        if h_proj_smooth[i] > h_proj_smooth[i-1] and h_proj_smooth[i] > h_proj_smooth[i+1]:
            if h_proj_smooth[i] > (cols * 0.05):
                peaks += 1
    print(f"Peaks: {peaks}")

# Analyze the latest rejected signature
signature_path = r"C:/Users/hr350/.gemini/antigravity/brain/52c43915-ec0a-49fe-8909-4f541d58778c/uploaded_media_1769502149879.png"
analyze_image(signature_path)

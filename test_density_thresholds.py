
import sys
import os
from PIL import Image
import numpy as np

def test_thresholds(img_path):
    image = Image.open(img_path).convert('L')
    img_arr = np.array(image)
    mean_val = np.mean(img_arr)
    
    thresholds = [20, 25, 30, 35, 40, 45, 50]
    print(f"Image: {os.path.basename(img_path)}")
    print(f"Mean: {mean_val:.2f}")
    
    for t in thresholds:
        mask = img_arr < (mean_val - t)
        density = np.sum(mask) / mask.size
        print(f"Threshold -{t}: Density = {density:.4f}")

# Signature
sig_path = r"C:/Users/hr350/.gemini/antigravity/brain/52c43915-ec0a-49fe-8909-4f541d58778c/uploaded_media_1769502149879.png"
test_thresholds(sig_path)

# Goldfish for counter-test (if available)
gold_path = r"C:/Users/hr350/.gemini/antigravity/brain/52c43915-ec0a-49fe-8909-4f541d58778c/uploaded_media_0_1769496902758.png"
if os.path.exists(gold_path):
    print("\n--- Counter-test: Goldfish ---")
    test_thresholds(gold_path)

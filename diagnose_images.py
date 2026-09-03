
import sys
import os
from PIL import Image
import numpy as np

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

def analyze_image(img_path):
    if not os.path.exists(img_path):
        print(f"File not found: {img_path}")
        return

    print(f"\n--- Analysis for: {os.path.basename(img_path)} ---")
    image = Image.open(img_path)
    
    # Heuristic Decomp
    if image.mode == 'RGBA':
        # Flatten on white background
        bg = Image.new('RGB', image.size, (255, 255, 255))
        bg.paste(image, mask=image.split()[3])
        image = bg
    else:
        image = image.convert('RGB')
    
    img_gray = image.convert('L')
    img_arr = np.array(img_gray)
    rows, cols = img_arr.shape
    
    mean_val = np.mean(img_arr)
    std_val = np.std(img_arr)
    
    content_threshold = mean_val - 25
    content_mask = img_arr < content_threshold
    density = np.sum(content_mask) / content_mask.size
    
    print(f"Mean: {mean_val:.2f}, Std: {std_val:.2f}, Density: {density:.4f}")
    
    # Saturation
    img_hsv = image.convert('HSV')
    hsv_arr = np.array(img_hsv)
    avg_sat = np.mean(hsv_arr[:,:,1])
    max_sat = np.max(hsv_arr[:,:,1])
    print(f"Avg Saturation: {avg_sat:.2f}, Max Saturation: {max_sat}")
    
    # Edge density
    grad_x = np.abs(np.diff(img_arr.astype(float), axis=1))
    edge_sum = np.sum(grad_x > 30)
    edge_ratio = edge_sum / (np.sum(content_mask) + 1)
    print(f"Edge Ratio: {edge_ratio:.2f}")

# Analyze the problematic images
images = [
    r"C:/Users/hr350/.gemini/antigravity/brain/52c43915-ec0a-49fe-8909-4f541d58778c/uploaded_media_1769492056417.png", # Goldfish
    r"C:/Users/hr350/.gemini/antigravity/brain/52c43915-ec0a-49fe-8909-4f541d58778c/uploaded_media_1769492839848.png"  # Goldfish again
]

for img in images:
    analyze_image(img)

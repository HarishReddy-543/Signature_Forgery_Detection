import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvisionimport transforms, models
from PIL import Image, ImageStat
import numpy as np
import os
import random
import json
from datetime import datetime

# --- Configuration ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
MODEL_PATH = os.path.join(BASE_DIR, "signature_model.pth")
HISTORY_FILE = os.path.join(BASE_DIR, "history.json")

# --- Utils ---
def is_signature(image: Image.Image) -> bool:
    """
    Permissive validation: Only blocks obvious non-signatures.
    Goal: Accept ALL valid signatures while blocking photos and screenshots.
    """
    # Basic size check
    if image.width < 30 or image.height < 15:
        print(f"[v1.1.0] Rejected: Image too small ({image.width}x{image.height})")
        return False

    # Normalize to RGB (simple conversion, no complex flattening)
    try:
        if image.mode in ('RGBA', 'LA', 'P'):
            # For transparency, just convert directly (don't force white background)
            image = image.convert('RGB')
        elif image.mode != 'RGB':
            image = image.convert('RGB')
    except:
        print(f"[v1.1.0] Rejected: Unable to convert image to RGB")
        return False

    # Resize if needed for performance
    if image.width > 1000 or image.height > 1000:
        image = image.copy()
        image.thumbnail((1000, 1000))

    # Convert to HSV for vibrant color detection
    try:
        img_hsv = image.convert('HSV')
        hsv_arr = np.array(img_hsv)
        avg_sat = np.mean(hsv_arr[:,:,1])
        max_sat = np.max(hsv_arr[:,:,1])
        
        # Block 1: Reject VERY vibrant/colorful images (clear photos)
        # Most signatures have saturation < 80, photos typically > 100
        if avg_sat > 90 or max_sat  > 200:
            print(f"[v1.1.0] Rejected: Image too vibrant (avg_sat={avg_sat:.1f}, max_sat={max_sat})")
            return False
    except:
        pass  # If HSV conversion fails, continue anyway

    # Block 2: Reject images with many parallel text lines (screenshots)
    try:
        img_gray = image.convert('L')
        img_arr = np.array(img_gray)
        rows, cols = img_arr.shape
        mean_val = np.mean(img_arr)
        
        # Simple density-based text detection
        content_mask = img_arr < (mean_val - 20)
        h_proj = np.sum(content_mask, axis=1)
        
        # Count distinct horizontal bands
        h_proj_smooth = np.convolve(h_proj, np.ones(5)/5, mode='same')
        peaks = 0
        for i in range(1, len(h_proj_smooth)-1):
            if h_proj_smooth[i] > h_proj_smooth[i-1] and h_proj_smooth[i] > h_proj_smooth[i+1]:
                if h_proj_smooth[i] > (cols * 0.07):  # Minimum band width
                    peaks += 1
        
        # Screenshots typically have 15+ parallel bands
        if peaks > 15:
            print(f"[v1.1.0] Rejected: Too many horizontal bands ({peaks}) - likely a screenshot")
            return False
    except:
        pass  # If analysis fails, accept the image

    print(f"[v1.1.0] SUCCESS: Image accepted as potential signature")
    return True

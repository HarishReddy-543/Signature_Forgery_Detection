import cv2
import numpy as np
from PIL import Image
import io

def get_opencv_img(pil_img):
    """Convert PIL image to OpenCV format (BGR)."""
    return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

def get_pil_img(cv_img):
    """Convert OpenCV image (BGR) to PIL format."""
    return Image.fromarray(cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB))

def remove_background_noise(pil_img):
    """
    Forensic Grain Removal:
    Uses Otsu thresholding and morphological operations to isolate ink from paper noise.
    """
    img = get_opencv_img(pil_img)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Use Otsu's to find the best threshold for ink
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Morphological removal of small noise (speckles)
    kernel = np.ones((2, 2), np.uint8)
    clean = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    
    # Invert back to black-on-white
    clean = cv2.bitwise_not(clean)
    
    # Back to 3-channel for UI consistency
    clean_bgr = cv2.cvtColor(clean, cv2.COLOR_GRAY2BGR)
    return get_pil_img(clean_bgr)

def skeletonize_signature(pil_img):
    """
    Structural Geometry Analysis:
    Reduces signature strokes to 1-pixel width to reveal the pure handwriting spine.
    """
    img = get_opencv_img(pil_img)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Binarize
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Thinning algorithm (Iterative)
    size = np.size(thresh)
    skel = np.zeros(thresh.shape, np.uint8)
    element = cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))
    
    done = False
    temp_img = thresh.copy()
    
    while not done:
        eroded = cv2.erode(temp_img, element)
        temp = cv2.dilate(eroded, element)
        temp = cv2.subtract(temp_img, temp)
        skel = cv2.bitwise_or(skel, temp)
        temp_img = eroded.copy()
        
        zeros = size - cv2.countNonZero(temp_img)
        if zeros == size:
            done = True
            
    # Invert back (White background, Black skeleton)
    skel = cv2.bitwise_not(skel)
    
    # Back to BGR
    skel_bgr = cv2.cvtColor(skel, cv2.COLOR_GRAY2BGR)
    return get_pil_img(skel_bgr)

def enhance_stroke_contrast(pil_img):
    """
    Forensic Stroke Sharpness:
    Enhances handwriting strokes using CLAHE and sharpening.
    Provides a high-fidelity view of the ink distribution.
    """
    img = get_opencv_img(pil_img)
    
    # Convert to LAB to enhance Contrast without affecting color too much
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # Apply CLAHE to L-channel
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    cl = clahe.apply(l)
    
    limg = cv2.merge((cl,a,b))
    final = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
    
    # Slight Sharpening to make stroke edges pop
    kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
    final = cv2.filter2D(final, -1, kernel)
    
    return get_pil_img(final)

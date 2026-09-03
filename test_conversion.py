
from PIL import Image
import numpy as np

sig_path = r"C:/Users/hr350/.gemini/antigravity/brain/52c43915-ec0a-49fe-8909-4f541d58778c/uploaded_media_1769502149879.png"
image = Image.open(sig_path)

print(f"Original Mode: {image.mode}")

# Method 1: Current (Flatten on white)
bg1 = Image.new("RGB", image.size, (255, 255, 255))
bg1.paste(image, mask=image.split()[-1] if 'A' in image.getbands() else None)
print(f"Method 1 (Flatten): Mean {np.mean(np.array(bg1.convert('L'))):.2f}")

# Method 2: Direct convert (Drops alpha)
bg2 = image.convert('RGB')
print(f"Method 2 (Direct): Mean {np.mean(np.array(bg2.convert('L'))):.2f}")

# Method 3: Simple L
bg3 = image.convert('L')
print(f"Method 3 (Convert L): Mean {np.mean(np.array(bg3)):.2f}")


from PIL import Image
import numpy as np

sig_path = r"C:/Users/hr350/.gemini/antigravity/brain/52c43915-ec0a-49fe-8909-4f541d58778c/uploaded_media_1769502149879.png"
image = Image.open(sig_path)

print(f"Mode: {image.mode}")
channels = image.split()
for i, band in enumerate(image.getbands()):
    print(f"Mean of {band} channel: {np.mean(np.array(channels[i])):.2f}")

# Try pasting without mask
bg_no_mask = Image.new("RGB", image.size, (255, 255, 255))
bg_no_mask.paste(image) # No mask argument
print(f"Mean without mask: {np.mean(np.array(bg_no_mask.convert('L'))):.2f}")

# Try pasting with mask
bg_with_mask = Image.new("RGB", image.size, (255, 255, 255))
bg_with_mask.paste(image, mask=channels[-1])
print(f"Mean with mask: {np.mean(np.array(bg_with_mask.convert('L'))):.2f}")

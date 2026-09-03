
from PIL import Image
import numpy as np

sig_path = r"C:/Users/hr350/.gemini/antigravity/brain/52c43915-ec0a-49fe-8909-4f541d58778c/uploaded_media_1769502149879.png"
image = Image.open(sig_path)

print(f"Mode: {image.mode}")
data = list(image.getdata())[:10]
print(f"First 10 RGBA pixels: {data}")

l_img = image.convert('L')
l_data = list(l_img.getdata())[:10]
print(f"First 10 L pixels: {l_data}")

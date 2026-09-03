
from PIL import Image
import numpy as np

sig_path = r"C:/Users/hr350/.gemini/antigravity/brain/52c43915-ec0a-49fe-8909-4f541d58778c/uploaded_media_1769502149879.png"
image = Image.open(sig_path)

a_channel = np.array(image.split()[-1])
print(f"Alpha Mean: {np.mean(a_channel):.2f}")
print(f"Alpha Min: {np.min(a_channel)}, Max: {np.max(a_channel)}")
print(f"First 10 Alpha values of first row: {a_channel[0][:10]}")

l_direct = image.convert('L')
print(f"Grayscale (L) Mean: {np.mean(np.array(l_direct)):.2f}")

# Check if it's white signature on transparent
r, g, b, a = image.split()
r_arr, g_arr, b_arr, a_arr = np.array(r), np.array(g), np.array(b), np.array(a)
print(f"R mean where A > 0: {np.mean(r_arr[a_arr > 0]):.2f}")
print(f"Number of transparent pixels: {np.sum(a_arr == 0)}")
print(f"Total pixels: {a_arr.size}")

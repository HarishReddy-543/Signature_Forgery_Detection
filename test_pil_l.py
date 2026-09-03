
from PIL import Image
import numpy as np

# Test 1: Black transparent
img1 = Image.new("RGBA", (10, 10), (0, 0, 0, 0))
l1 = img1.convert('L')
print(f"RGBA(0,0,0,0) -> L: {np.mean(np.array(l1))}")

# Test 2: Black opaque
img2 = Image.new("RGBA", (10, 10), (0, 0, 0, 255))
l2 = img2.convert('L')
print(f"RGBA(0,0,0,255) -> L: {np.mean(np.array(l2))}")

# Test 3: White opaque
img3 = Image.new("RGBA", (10, 10), (255, 255, 255, 255))
l3 = img3.convert('L')
print(f"RGBA(255,255,255,255) -> L: {np.mean(np.array(l3))}")

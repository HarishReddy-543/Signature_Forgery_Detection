
import requests
import io
from PIL import Image, ImageDraw, ImageOps
import numpy as np
import os

TEST_SIG_PATH = r"C:/Users/hr350/.gemini/antigravity/brain/52c43915-ec0a-49fe-8909-4f541d58778c/uploaded_media_1769502149879.png"
API_URL = "http://127.0.0.1:8090/api/verify"

def create_text_image():
    img = Image.new('RGB', (800, 600), color='white')
    d = ImageDraw.Draw(img)
    # Draw strictly horizontal lines of text (approximate)
    for i in range(40):
        y = 15 * i + 20
        d.line([(50, y), (750, y)], fill='black', width=2)
    return img

def create_noise_image():
    arr = np.random.randint(0, 255, (600, 800, 3), dtype=np.uint8)
    return Image.fromarray(arr, 'RGB')


fails = 0

def test(name, img_obj=None, path=None, expect_pass=True):
    global fails
    print(f"TEST: {name}")
    try:
        if path:
            with open(path, 'rb') as f:
                files = {'signature': ('t.png', f, 'image/png')}
                r = requests.post(API_URL, files=files)
        else:
            b = io.BytesIO()
            img_obj.save(b, 'PNG')
            b.seek(0)
            files = {'signature': ('t.png', b, 'image/png')}
            r = requests.post(API_URL, files=files)
            
        data = r.json()
        accepted = data.get('valid', True) and not 'error' in data
        
        if accepted == expect_pass:
            print(f"  -> PASS")
        else:
            print(f"  -> FAIL (Accepted={accepted}, Expected={expect_pass})")
            if not accepted: print(f"     Reason: {data.get('error')}")
            fails += 1
            
    except Exception as e:
        print(f"  -> ERROR: {e}")
        fails += 1

if os.path.exists(TEST_SIG_PATH):
    test("Genuine Sig", path=TEST_SIG_PATH, expect_pass=True)
else:
    print("SKIP Genuine (File missing)")

# 6. Specific User Reported Failure (Should PASS)
user_fail_path = r"C:/Users/hr350/.gemini/antigravity/brain/119957a2-cc6c-4df0-b52e-c7859e60a775/uploaded_media_1769506965985.png"
if os.path.exists(user_fail_path):
    test("User Reported Fail Case", path=user_fail_path, expect_pass=True)
else:
    print(f"User file not found: {user_fail_path}")

test("Text Doc", img_obj=create_text_image(), expect_pass=False)
test("Noise", img_obj=create_noise_image(), expect_pass=False)
test("Solid Black", img_obj=Image.new('RGB',(100,100),'black'), expect_pass=False)

import sys
print(f"\nTotal Failures: {fails}")
sys.exit(fails)



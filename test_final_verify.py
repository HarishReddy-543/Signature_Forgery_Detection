
import requests
import os

filePath = r"C:/Users/hr350/.gemini/antigravity/brain/52c43915-ec0a-49fe-8909-4f541d58778c/uploaded_media_1769492839848.png"
url = "http://127.0.0.1:8090/api/verify"

if os.path.exists(filePath):
    with open(filePath, 'rb') as f:
        files = {'signature': f}
        r = requests.post(url, files=files)
        print(r.status_code)
        print(r.json())
else:
    print(f"File not found: {filePath}")

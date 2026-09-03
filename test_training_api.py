import urllib.request
import urllib.parse
import json
import time

BASE_URL = "http://127.0.0.1:8090"

def make_request(endpoint, method="GET", data=None):
    url = f"{BASE_URL}{endpoint}"
    if data:
        data = urllib.parse.urlencode(data).encode("utf-8")
    
    req = urllib.request.Request(url, data=data, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as e:
        print(f"Request failed: {e}")
        return None

def test_training_flow():
    print(f"Testing Training API at {BASE_URL}...")
    
    # 1. Reset State
    print("Resetting state...")
    make_request("/api/train/reset", method="POST")

    # 2. Start Training (short run)
    print("Starting training (epochs=1, batch_size=2)...")
    # Note: Query params for POST
    url = f"{BASE_URL}/api/train?epochs=1&batch_size=2"
    req = urllib.request.Request(url, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            start_res = json.loads(response.read().decode("utf-8"))
            print(f"Start response: {start_res}")
    except urllib.error.URLError as e:
        print(f"Failed to start training: {e}")
        return

    # 3. Poll Status
    for i in range(10):
        time.sleep(1)
        data = make_request("/api/train/status")
        if not data: continue
            
        print(f"Status check {i+1}: Progress={data.get('progress')}% | Complete={data.get('complete')}")
        
        if data.get('error'):
            print(f"Training failed with error: {data.get('error')}")
            break
            
        if data.get('complete'):
            print("Training completed successfully!")
            break
    else:
        print("Timeout waiting for training completion.")

if __name__ == "__main__":
    test_training_flow()

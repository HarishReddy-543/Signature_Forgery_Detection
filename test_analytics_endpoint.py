import urllib.request
import json

try:
    with urllib.request.urlopen("http://127.0.0.1:8090/api/analytics/accuracy") as response:
        if response.status == 200:
            data = json.loads(response.read().decode())
            print("SUCCESS: Endpoint responded with 200 OK")
            print("Data sample:", json.dumps(data, indent=2))
            
            if "data" in data:
                print(f"Number of data points: {len(data['data'])}")
                if len(data['data']) > 0:
                    print("First data point:", data['data'][0])
                else:
                    print("No data points found (log file might be empty).")
            else:
                print("ERROR: Response missing 'data' key.")
        else:
            print(f"ERROR: Endpoint responded with {response.status}")
except Exception as e:
    print(f"EXCEPTION: {str(e)}")

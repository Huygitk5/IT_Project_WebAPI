import requests
import time

api_key = "019b22ef-6974-7101-a540-727488790753" # Thay Key của bạn vào
headers = {'API-Key': api_key, 'Content-Type': 'application/json'}
target_url = "https://google.com" # Web muốn quét

# 1. Gửi lệnh quét
submit_url = "https://urlscan.io/api/v1/scan/"
data = {"url": target_url, "visibility": "public"}
response = requests.post(submit_url, headers=headers, json=data)

if response.status_code == 200:
    scan_uuid = response.json()['uuid']
    print(f"Đang quét... Xem kết quả tại: https://urlscan.io/result/{scan_uuid}/")
    print("API Result URL: " + response.json()['api'])
else:
    print("Lỗi:", response.text)
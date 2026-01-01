import requests
import time
import json

# 1. Cấu hình
api_key = "019b22ef-6974-7101-a540-727488790753"
target_url = "https://google.com" 

headers = {'API-Key': api_key, 'Content-Type': 'application/json'}
data = {"url": target_url, "visibility": "public"}

print(f">>> Đang gửi yêu cầu quét: {target_url}")
response = requests.post('https://urlscan.io/api/v1/scan/', headers=headers, json=data)

if response.status_code == 200:
    res_json = response.json()
    uuid = res_json['uuid']
    print(f"Gửi thành công! UUID: {uuid}")
    print("Đang đợi server phân tích (15s)...")
    time.sleep(15) 
    
    # Lấy kết quả
    scan_res = requests.get(f"https://urlscan.io/api/v1/result/{uuid}/")
    
    if scan_res.status_code == 200:
        report = scan_res.json()
        page = report.get('page', {})
        verdicts = report.get('verdicts', {})
        stats = report.get('stats', {})
        
        print("-" * 50)
        print("KẾT QUẢ PHÂN TÍCH CHI TIẾT:")
        print(f"Tiêu đề:  {page.get('title')}")
        print(f"IP:       {page.get('ip')} ({page.get('country')})")
        print(f"Server:   {page.get('server')}")
        
        # Đánh giá an toàn
        malicious = verdicts.get('overall', {}).get('malicious', False)
        score = verdicts.get('overall', {}).get('score', 0)
        print(f"Độc hại:  {'CÓ ⚠️' if malicious else 'KHÔNG'} (Điểm rủi ro: {score})")
        
        # Thống kê tài nguyên
        print(f"Tài nguyên: {stats.get('resourceStats', {}).get('count', 0)} requests")
        print(f"Tổng dung lượng: {stats.get('resourceStats', {}).get('size', 0) / 1024:.2f} KB")
        
        print(f"Screenshot: {report.get('task', {}).get('screenshotURL')}")
        print("-" * 50)
    else:
        print("Kết quả chưa sẵn sàng.")
else:
    print(f"Lỗi: {response.status_code}")
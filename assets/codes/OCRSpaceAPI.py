import requests
import json
import os

api_key = "helloworld"
input_path = r"D:\Wallpapers\test_ocr.png" # Đổi lại đường dẫn của bạn
language = "eng"

if not os.path.exists(input_path):
    print(f"Lỗi: Không tìm thấy file {input_path}")
    exit()

print(">>> Đang upload ảnh và đọc văn bản...")

with open(input_path, 'rb') as f:
    response = requests.post(
        "https://api.ocr.space/parse/image",
        files={input_path: f},
        data={
            "apikey": api_key,
            "language": language, 
            "isOverlayRequired": True # Bật lên để lấy thêm thông tin chi tiết
        }
    )

if response.status_code == 200:
    result = response.json()
    
    if result["IsErroredOnProcessing"]:
        print("Lỗi xử lý:", result["ErrorMessage"])
    else:
        parsed_result = result["ParsedResults"][0]
        text = parsed_result["ParsedText"]
        
        print("-" * 50)
        print("ĐỌC THÀNH CÔNG!")
        print(f"⏱Thời gian xử lý: {result['ProcessingTimeInMilliseconds']} ms")
        print(f"Exit Code:       {parsed_result['FileParseExitCode']}")
        print("-" * 50)
        print("--- NỘI DUNG VĂN BẢN ---")
        print(text)
        print("-" * 50)
else:
    print("Lỗi kết nối:", response.status_code)
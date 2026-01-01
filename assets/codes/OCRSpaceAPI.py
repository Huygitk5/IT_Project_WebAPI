import requests
import json
import os

# 1. Cấu hình
api_key = "helloworld" # Bạn có thể dùng key này để test luôn, hoặc thay key riêng
#Key rieng: K85964555888957
input_path = r"D:\Wallpapers\UBH2025 - E-Certificate - Consolation Prize - Doan Quoc Huy.png" # <--- Thay đường dẫn ảnh của bạn (có chứa chữ)
language = "eng" # "eng" là tiếng Anh, "vie" là tiếng Việt (nếu dùng key riêng)

# Kiểm tra file
if not os.path.exists(input_path):
    print(f"Lỗi: Không tìm thấy file tại {input_path}")
    exit()

print("Đang đọc văn bản từ ảnh...")

# 2. Gửi yêu cầu (POST)
with open(input_path, 'rb') as f:
    response = requests.post(
        "https://api.ocr.space/parse/image",
        files={input_path: f},
        data={
            "apikey": api_key,
            "language": language, 
            "isOverlayRequired": False
        }
    )

# 3. Xử lý kết quả (JSON)
if response.status_code == 200:
    result = response.json()
    
    # Kiểm tra xem có lỗi từ API trả về không
    if result["IsErroredOnProcessing"] == True:
        print("Lỗi xử lý:", result["ErrorMessage"])
    else:
        # API trả về một mảng (vì 1 file PDF có thể có nhiều trang)
        # Ta lấy text của trang đầu tiên
        parsed_text = result["ParsedResults"][0]["ParsedText"]
        
        print("--- KẾT QUẢ ĐỌC ĐƯỢC ---")
        print(parsed_text)
        print("------------------------")
else:
    print("Lỗi kết nối:", response.status_code)

import requests

# 1. Cấu hình
api_key = "f8uU5eupXfvjoQoojq2RofN1" 
input_path = r"D:\Wallpapers\hcmute.png"        
output_path = r"D:\Wallpapers\hcmute_noBG.png" 

print(f">>> Đang gửi ảnh lên server Remove.bg...")

# 2. Gọi API
response = requests.post(
    "https://api.remove.bg/v1.0/removebg",
    files={'image_file': open(input_path, 'rb')},
    data={'size': 'auto'},
    headers={'X-Api-Key': api_key},
)

# 3. Xử lý kết quả
if response.status_code == 200:
    with open(output_path, "wb") as out:
        out.write(response.content)
    
    print("-" * 50)
    print("THÀNH CÔNG!")
    print(f"Ảnh đã lưu tại: {output_path}")
    
    # Lấy thông tin từ Header trả về (Rất hữu ích)
    credits_charged = response.headers.get('X-Remove-Bg-Charged-Credits', 'N/A')
    credits_total = response.headers.get('X-Remove-Bg-Account-Credits', 'N/A')
    width = response.headers.get('X-Remove-Bg-Width', 'N/A')
    height = response.headers.get('X-Remove-Bg-Height', 'N/A')
    
    print("-" * 50)
    print("THÔNG TIN TÀI KHOẢN & ẢNH:")
    print(f"Phí lần này:   {credits_charged} credits")
    print(f"Số dư còn lại: {credits_total} credits")
    print(f"Kích thước ảnh:{width}x{height} px")
    print("-" * 50)
else:
    print("Lỗi:", response.status_code)
    print(response.text)
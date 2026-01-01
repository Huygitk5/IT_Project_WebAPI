import requests

# 1. Cấu hình nội dung
# Bạn hãy thay dòng dưới bằng Link Facebook hoặc Portfolio của bạn
my_data = "https://www.facebook.com/profile.php?id=100000000" 

# Kích thước ảnh QR (300x300 pixel)
image_size = "300x300"

# 2. Xây dựng URL API
# Cấu trúc: https://api.qrserver.com/v1/create-qr-code/?size=...&data=...
url = "https://api.qrserver.com/v1/create-qr-code/"
params = {
    "size": image_size,
    "data": my_data
}

print(f"Đang tạo mã QR cho: {my_data}")

# 3. Gọi API (GET)
response = requests.get(url, params=params)

# 4. Lưu ảnh về máy
if response.status_code == 200:
    output_file = "my_qrcode.png"
    
    with open(output_file, "wb") as f:
        f.write(response.content)
        
    print("------------------------------------------------")
    print("✅ THÀNH CÔNG!")
    print(f"Đã tạo file '{output_file}' trong thư mục dự án.")
    print("👉 HÃY MỞ FILE ẢNH ĐÓ LÊN VÀ DÙNG ĐIỆN THOẠI QUÉT THỬ!")
    print("------------------------------------------------")
else:
    print("Lỗi:", response.status_code)

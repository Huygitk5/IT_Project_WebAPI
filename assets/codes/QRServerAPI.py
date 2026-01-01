import requests
import os

my_data = "https://www.facebook.com/profile.php?id=100000000" 
image_size = "300x300"
url = "https://api.qrserver.com/v1/create-qr-code/"
params = {"size": image_size, "data": my_data}

print(f">>> Đang tạo mã QR cho: {my_data}")
response = requests.get(url, params=params)

if response.status_code == 200:
    output_file = "my_qrcode.png"
    with open(output_file, "wb") as f:
        f.write(response.content)
    
    # Lấy kích thước file
    file_size = os.path.getsize(output_file) / 1024 # KB
        
    print("-" * 50)
    print("TẠO THÀNH CÔNG!")
    print(f"File:      {output_file}")
    print(f"Dung lượng:{file_size:.2f} KB")
    print(f"Kích thước:{image_size}")
    print(f"Loại ảnh:  {response.headers['Content-Type']}")
    print("-" * 50)
else:
    print("Lỗi:", response.status_code)
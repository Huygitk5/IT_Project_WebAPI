import requests

# 1. Cấu hình
api_key = "f8uU5eupXfvjoQoojq2RofN1" 
input_path = r"D:\Wallpapers\hcmute.png"         #đổi link
output_path = r"D:\Wallpapers\hcmute_noBG.png"  #đổi link

# 2. Gọi API (Chế độ Upload File)
# Lưu ý: Khi upload file từ máy, ta dùng tham số 'files', không dùng 'data={"image_url"}'
response = requests.post(
    "https://api.remove.bg/v1.0/removebg",
    files={'image_file': open(input_path, 'rb')}, # rb = read binary
    data={'size': 'auto'},
    headers={'X-Api-Key': api_key},
)

# 3. Xử lý kết quả
if response.status_code == 200:
    with open(output_path, "wb") as out:
        out.write(response.content)
    print("Thành công! Đã lưu ảnh tách nền tại:", output_path)
else:
    print("Lỗi:", response.status_code, response.text)

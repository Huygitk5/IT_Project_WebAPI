import requests

# 1. Cấu hình
# Lưu ý: Key này là demo, bạn nên đăng ký key riêng tại exchangerate-api.com
api_key = "1b3657202125ab2f83f0bde4" 
base_currency = "USD"   # Tiền tệ gốc
target_currency = "VND" # Tiền tệ muốn đổi

url = f"https://v6.exchangerate-api.com/v6/{api_key}/latest/{base_currency}"

print(f">> >Dang lay du lieu ty gia tu thi truong ({base_currency})...")

# 2. Gửi request
response = requests.get(url)

# 3. Xử lý kết quả
if response.status_code == 200:
    data = response.json()
    
    if data['result'] == "success":
        print("-" * 50)
        print("TRANG THAI:      Thanh cong (Success)")
        
        # Hiển thị thông tin thời gian (Quan trọng)
        print(f"Cap nhat lan cuoi: {data['time_last_update_utc']}")
        print(f"Cap nhat tiep theo: {data['time_next_update_utc']}")
        print("-" * 50)
        
        # Lấy tỷ giá cụ thể
        rates = data['conversion_rates']
        rate = rates.get(target_currency)
        
        if rate:
            print(f"TY GIA HOI DOAI:")
            print(f"1 {base_currency} = {rate:,.2f} {target_currency}")
        else:
            print(f"Loi: Khong tim thay ma tien te '{target_currency}'")
            
        print("-" * 50)
        
        # Thống kê thêm
        print(f"Tong so loai tien te ho tro: {len(rates)}")
        print("Mot so ty gia pho bien khac:")
        print(f"- EUR: {rates.get('EUR', 'N/A')}")
        print(f"- JPY: {rates.get('JPY', 'N/A')}")
        print(f"- GBP: {rates.get('GBP', 'N/A')}")
        print("-" * 50)
        
    else:
        print("Loi API: Key sai hoac het han muc su dung.")
        print(f"Loai loi: {data['error-type']}")
else:
    print(f"Loi ket noi: {response.status_code}")
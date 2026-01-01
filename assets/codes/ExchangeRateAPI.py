import requests

# 1. Cấu hình thông tin
api_key = "1b3657202125ab2f83f0bde4" # Thay mã API của bạn vào đây
base_currency = "USD" # Tiền gốc
target_currency = "VND" # Tiền muốn đổi sang
url = f"https://v6.exchangerate-api.com/v6/{api_key}/latest/{base_currency}"

# 2. Gửi yêu cầu (Request)
# API này không cần params phức tạp, mọi thứ nằm trong URL
response = requests.get(url)

# 3. Xử lý kết quả (Response)
if response.status_code == 200:
    data = response.json()
    
    # Lấy tỷ giá từ cục dữ liệu
    rate = data['conversion_rates'][target_currency]
    
    amount_usd = 100
    amount_vnd = amount_usd * rate
    
    print(f"Tỷ giá hiện tại: 1 {base_currency} = {rate:,.0f} {target_currency}")
    print(f"{amount_usd} USD tương đương với: {amount_vnd:,.0f} {target_currency}")
else:
    print("Lỗi khi gọi API:", response.status_code)

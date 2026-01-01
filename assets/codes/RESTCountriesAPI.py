import requests

# 1. Cấu hình
country_name = "vietnam" # Thay đổi tên quốc gia tại đây (tiếng Anh)
url = f"https://restcountries.com/v3.1/name/{country_name}"

print(f">>> Dang tra cuu thong tin ve: {country_name}...")

# 2. Gửi request
response = requests.get(url)

# 3. Xử lý kết quả
if response.status_code == 200:
    data = response.json()[0] # Lấy kết quả đầu tiên tìm được
    
    print("-" * 50)
    # Tên thông thường và Tên chính thức
    common_name = data['name']['common']
    official_name = data['name']['official']
    print(f"QUOC GIA:    {common_name.upper()}")
    print(f"Ten day du:  {official_name}")
    print("-" * 50)
    
    # Thủ đô (Xử lý trường hợp không có thủ đô)
    capital = data.get('capital', ['Khong co'])[0]
    print(f"Thu do:      {capital}")
    
    # Khu vực địa lý
    region = data.get('region', 'N/A')
    subregion = data.get('subregion', 'N/A')
    print(f"Khu vuc:     {region} ({subregion})")
    
    # Số liệu
    pop = data.get('population', 0)
    area = data.get('area', 0)
    print(f"Dan so:      {pop:,} nguoi")
    print(f"Dien tich:   {area:,} km2")
    
    # Tiền tệ (Duyệt qua dict)
    currencies = data.get('currencies', {})
    curr_list = [f"{v['name']} ({v.get('symbol', '?')})" for k, v in currencies.items()]
    print(f"Tien te:     {', '.join(curr_list)}")
    
    # Ngôn ngữ
    langs = data.get('languages', {})
    print(f"Ngon ngu:    {', '.join(langs.values())}")
    
    # Múi giờ (Lấy cái đầu tiên nếu nhiều quá)
    timezones = data.get('timezones', [])
    print(f"Mui gio:     {', '.join(timezones[:3])}")
    
    # Link bản đồ và cờ
    print(f"Google Maps: {data['maps']['googleMaps']}")
    print(f"Link Co:     {data['flags']['png']}")
    
    print("-" * 50)
else:
    print(f"Loi: Khong tim thay quoc gia '{country_name}'")
    print("Goi y: Hay nhap ten tieng Anh chinh xac (vd: japan, france...)")
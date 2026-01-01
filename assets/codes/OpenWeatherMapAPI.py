import requests
import datetime

api_key = "463ed506f10cd039c485cd8f2db2de19"
city = "Ho Chi Minh City,VN"
base_url = "https://api.openweathermap.org/data/2.5/weather"

params = {
    "q": city,
    "appid": api_key,
    "units": "metric",
    "lang": "vi"
}

print(f">>> Đang lấy dữ liệu thời tiết cho: {city}...")
response = requests.get(base_url, params=params)

if response.status_code == 200:
    data = response.json()
    main = data["main"]
    wind = data["wind"]
    sys = data["sys"]
    weather = data["weather"][0]

    # Chuyển đổi timestamp sang giờ thực
    sunrise = datetime.datetime.fromtimestamp(sys['sunrise']).strftime('%H:%M:%S')
    sunset = datetime.datetime.fromtimestamp(sys['sunset']).strftime('%H:%M:%S')

    print("-" * 50)
    print(f"ĐỊA ĐIỂM:   {data['name']}, {sys['country']}")
    print(f"NHIỆT ĐỘ:   {main['temp']}°C (Cảm giác như: {main['feels_like']}°C)")
    print(f"TÌNH TRẠNG: {weather['description'].upper()} (Độ phủ mây: {data['clouds']['all']}%)")
    print("-" * 50)
    print(f"Độ ẩm:      {main['humidity']}%")
    print(f"Áp suất:    {main['pressure']} hPa")
    print(f"Gió:        {wind['speed']} m/s (Hướng: {wind['deg']}°)")
    print(f"Tầm nhìn:   {data.get('visibility', 'N/A')} mét")
    print("-" * 50)
    print(f"Bình minh:  {sunrise}")
    print(f"Hoàng hôn:  {sunset}")
    print("-" * 50)
else:
    print("Lỗi khi gọi API:", response.status_code)
    print(response.text)
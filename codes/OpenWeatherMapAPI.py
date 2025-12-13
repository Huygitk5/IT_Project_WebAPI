import requests

api_key = "463ed506f10cd039c485cd8f2db2de19"
city = "Ho Chi Minh City,VN"
base_url = "https://api.openweathermap.org/data/2.5/weather"

params = {
    "q": city,
    "appid": api_key,
    "units": "metric",
    "lang": "vi"
}

response = requests.get(base_url, params=params)

if response.status_code == 200:
    data = response.json()
    temp = data["main"]["temp"]
    desc = data["weather"][0]["description"]
    print(f"Thời tiết tại {city}:")
    print(f"Nhiệt độ: {temp}°C")
    print(f"Mô tả: {desc}")
else:
    print("Lỗi khi gọi API:", response.status_code)
    print(response.text)  # in chi tiết lỗi

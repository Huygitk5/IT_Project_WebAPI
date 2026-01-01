import requests

country_name = "Cana"
url = f"https://restcountries.com/v3.1/name/{country_name}"

response = requests.get(url)
data = response.json()

country = data[0]

print("Tên quốc gia:", country["name"]["common"])
print("Thủ đô:", country["capital"][0])
print("Dân số:", country["population"])
print("Khu vực:", country["region"])
print("Quốc kỳ:", country["flags"]["png"])

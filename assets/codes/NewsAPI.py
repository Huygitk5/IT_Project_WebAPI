import requests

# 1. Cấu hình
api_key = "42a7e5122a1d475fbe81576e3b088dbc" # Thay key của bạn vào đây
country = "us" # Chọn quốc gia (us, jp, kr...) - Lưu ý: vn có thể ít nguồn hơn
url = f"https://newsapi.org/v2/top-headlines?country={country}&apiKey={api_key}"

# 2. Gửi request
response = requests.get(url)

# 3. Xử lý kết quả
if response.status_code == 200:
    data = response.json()
    articles = data['articles'] # Lấy danh sách bài báo
    
    print(f"--- TIN NÓNG TẠI {country.upper()} ---")
    
    # Lấy 3 bài đầu tiên để demo cho gọn
    for i, news in enumerate(articles[:3], 1):
        print(f"\nBài {i}: {news['title']}")
        print(f"Nguồn: {news['source']['name']}")
        print(f"Link: {news['url']}")
else:
    print("Lỗi:", response.status_code)

import requests

# 1. Cấu hình
api_key = "42a7e5122a1d475fbe81576e3b088dbc" # Key demo
country = "us" # Chọn quốc gia (us, jp, kr...)
url = f"https://newsapi.org/v2/top-headlines?country={country}&apiKey={api_key}"

# 2. Gửi request
print(f">>> Dang lay tin tuc tu server ({country.upper()})...")
response = requests.get(url)

# 3. Xử lý kết quả
if response.status_code == 200:
    data = response.json()
    articles = data.get('articles', [])
    
    # Sửa số lượng hiển thị thành 5
    print(f"Tim thay {data['totalResults']} bai viet. Hien thi 5 bai moi nhat:")
    
    # Lấy 5 bài đầu tiên
    for i, news in enumerate(articles[:5], 1):
        print("-" * 60)
        print(f"BAI VIET #{i}")
        print(f"Tieu de:   {news.get('title')}")
        
        author = news.get('author')
        print(f"Tac gia:   {author if author else 'Khong ro'}")
        
        print(f"Thoi gian: {news.get('publishedAt')}")
        print(f"Nguon:     {news['source']['name']}")
        
        desc = news.get('description')
        print(f"Tom tat:   {desc if desc else 'Khong co mo ta.'}")
        
        img = news.get('urlToImage')
        print(f"Anh bia:   {img if img else 'Khong co anh'}")
        
        print(f"Link goc:  {news['url']}")
        
    print("-" * 60)
else:
    print(f"Loi ket noi: {response.status_code}")
    print(response.text)
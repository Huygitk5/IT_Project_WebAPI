import requests

# 1. Cấu hình
access_key = "KQGzheP-PaJqEU4RGmykavjXFJh5afQZExqUl9IB2fQ" 
query = "tokyo night"
per_page = 1 # Số lượng ảnh muốn lấy

url = f"https://api.unsplash.com/search/photos?query={query}&client_id={access_key}&per_page={per_page}"

print(f">>> Dang tim kiem anh chu de: '{query}'...")

# 2. Gửi request
response = requests.get(url)

# 3. Xử lý kết quả
if response.status_code == 200:
    data = response.json()
    results = data.get('results', [])
    
    if not results:
        print("Khong tim thay anh nao.")
    else:
        print(f"Tim thay tong cong: {data['total']} anh.")
        print("-" * 50)
        
        # Lấy ảnh đầu tiên làm ví dụ
        photo = results[0]
        
        print(f"ID ANH:      {photo['id']}")
        print(f"Mo ta:       {photo['description'] or photo['alt_description']}")
        print(f"Ngay tao:    {photo['created_at']}")
        print(f"Mau sac:     {photo['color']}")
        print(f"Luot thich:  {photo['likes']}")
        
        # Thông tin tác giả
        user = photo['user']
        print(f"\n--- TAC GIA ---")
        print(f"Ten:         {user['name']}")
        print(f"Username:    @{user['username']}")
        print(f"Bio:         {user['bio']}")
        print(f"Portfolio:   {user['portfolio_url']}")
        
        # Các đường dẫn ảnh
        print(f"\n--- LINKS ANH ---")
        print(f"Raw (Goc):   {photo['urls']['raw']}")
        print(f"Full (HD):   {photo['urls']['full']}")
        print(f"Regular:     {photo['urls']['regular']}")
        print(f"Small:       {photo['urls']['small']}")
        
        print("-" * 50)
else:
    print(f"Loi ket noi: {response.status_code}")
    print(response.text)
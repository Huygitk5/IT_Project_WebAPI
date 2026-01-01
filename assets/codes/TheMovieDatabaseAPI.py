import requests

# 1. Cấu hình
api_key = "69ce4822562bacb250dea6a803cad4d6"
base_url = "https://api.themoviedb.org/3/search/movie"
query = "Mưa đỏ"

params = {
    'api_key': api_key,
    'query': query,
    'language': 'vi-VN'
}

print(f">>> Đang tìm phim: '{query}'...")
response = requests.get(base_url, params=params)

if response.status_code == 200:
    data = response.json()
    results = data['results']
    if results:
        print(f"Tìm thấy {len(results)} kết quả. Hiển thị kết quả đầu tiên:")
        m = results[0]
        
        print("-" * 50)
        print(f"TÊN PHIM:    {m['title']} (Gốc: {m['original_title']})")
        print(f"PHÁT HÀNH:   {m['release_date']}")
        print(f"ĐÁNH GIÁ:    {m['vote_average']}/10 (từ {m['vote_count']} lượt vote)")
        print(f"ĐỘ PHỔ BIẾN: {m['popularity']} điểm")
        print(f"NGÔN NGỮ:    {m['original_language']}")
        print("-" * 50)
        print(f"NỘI DUNG:\n{m['overview']}")
        print("-" * 50)
        
        if m.get('poster_path'):
            print(f"LINK POSTER: https://image.tmdb.org/t/p/original{m['poster_path']}")
    else:
        print("Không tìm thấy phim nào.")
else:
    print("Lỗi kết nối:", response.status_code)
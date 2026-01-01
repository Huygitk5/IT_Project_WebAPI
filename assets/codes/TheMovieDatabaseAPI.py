import requests
# 1. Cấu hình
api_key = "69ce4822562bacb250dea6a803cad4d6" # Thay key của bạn vào đây
base_url = "https://api.themoviedb.org/3/search/movie"
# 2. Xây dựng tham số: Tìm phim tên là "Mưa đỏ"
params = {
    'api_key': api_key,
    'query': 'Mưa đỏ',
    'language': 'vi-VN' # Lấy dữ liệu tiếng Việt (nếu có)
}
# 3. Gửi request
response = requests.get(base_url, params=params)
# 4. Xử lý kết quả
if response.status_code == 200:
    data = response.json()
    results = data['results']
    if results:
        first_movie = results[0]
        print(f"Tên phim: {first_movie['title']}")
        print(f"Ngày phát hành: {first_movie['release_date']}")
        print(f"Điểm đánh giá: {first_movie['vote_average']}/10")
        print(f"Nội dung: {first_movie['overview']}")
    else:
        print("Không tìm thấy phim nào.")
else:
    print("Lỗi kết nối:", response.status_code)
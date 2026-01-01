import requests

access_key = "KQGzheP-PaJqEU4RGmykavjXFJh5afQZExqUl9IB2fQ"
query = "bat"

url = "https://api.unsplash.com/search/photos"
headers = {
    "Authorization": f"Client-ID {access_key}"
}
params = {
    "query": query,
    "per_page": 1
}

response = requests.get(url, headers=headers, params=params)
data = response.json()

image_url = data["results"][0]["urls"]["regular"]
print("Image URL:", image_url)

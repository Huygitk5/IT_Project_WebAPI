from googletrans import Translator

def translate_text():
    # Khởi tạo thư viện
    translator = Translator()
    
    # Dữ liệu đầu vào
    text = "Hôm nay trời đẹp"
    src = "vi"   # Ngôn ngữ nguồn (Vietnamese)
    dest = "en"  # Ngôn ngữ đích (English)
    
    print(f">>> Translating: '{text}' ({src} -> {dest})...")
    
    # Gọi API   
    try:
        translation = translator.translate(text, src=src, dest=dest)
        
        # Hiển thị kết quả
        print(f"Original: {translation.origin}")
        print(f"Translated: {translation.text}")
        
    except Exception as e:
        print("Lỗi kết nối API:", e)

if __name__ == "__main__":
    translate_text()
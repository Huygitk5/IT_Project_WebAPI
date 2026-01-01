import asyncio
from googletrans import Translator

async def translate_text():
    translator = Translator()

    text = "Hôm nay trời đẹp quá"
    # Không chỉ định src để API tự phát hiện
    dest = "en"

    print(f">>> Đang dịch: '{text}' (Auto -> {dest})...")

    try:
        # Dịch
        translation = await translator.translate(text, dest=dest)

        print("-" * 50)
        print(f"KẾT QUẢ:")
        print(f"Gốc:          {translation.origin}")
        print(f"Dịch sang:    {translation.text}")
        print("-" * 50)
        
        # Thông tin phát hiện ngôn ngữ
        print(f"Phát hiện ngôn ngữ gốc: {translation.src}")
        # (Lưu ý: Googletrans bản free đôi khi không trả về confidence, nhưng ta cứ in cấu trúc ra)
        if hasattr(translation, 'extra_data'):
             print(f"ℹDữ liệu bổ sung: {translation.extra_data.get('confidence', 'N/A')}")
        print("-" * 50)

    except Exception as e:
        print("Lỗi kết nối API:", e)

if __name__ == "__main__":
    asyncio.run(translate_text())
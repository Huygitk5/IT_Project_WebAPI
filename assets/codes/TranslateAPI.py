import asyncio
from googletrans import Translator

async def translate_text():
    translator = Translator()

    text = "Hôm nay trời đẹp"
    src = "vi"
    dest = "en"

    print(f">>> Translating: '{text}' ({src} -> {dest})...")

    try:
        translation = await translator.translate(text, src=src, dest=dest)

        print(f"Original: {translation.origin}")
        print(f"Translated: {translation.text}")

    except Exception as e:
        print("Lỗi kết nối API:", e)

if __name__ == "__main__":
    asyncio.run(translate_text())

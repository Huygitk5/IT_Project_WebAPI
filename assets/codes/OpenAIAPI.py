from openai import OpenAI
import os

# 1. Cấu hình Client
# Lưu ý: Trong thực tế, nên để KEY trong biến môi trường (Environment Variable)
client = OpenAI(
    api_key="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"
)

user_input = "Giải thích ngắn gọn về Lượng tử giới (Quantum Realm) trong 2 câu."

print(f">>> Dang gui yeu cau toi ChatGPT (gpt-3.5-turbo)...")
print(f"Cau hoi: {user_input}")
print("-" * 50)

try:
    # 2. Gọi API (Chat Completion)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Bạn là trợ lý ảo hữu ích, trả lời ngắn gọn bằng tiếng Việt."},
            {"role": "user", "content": user_input}
        ],
        temperature=0.7, # Độ sáng tạo (0.0 - 1.0)
        max_tokens=150   # Giới hạn độ dài trả lời
    )

    # 3. Xử lý kết quả trả về
    # Lấy nội dung trả lời chính
    content = response.choices[0].message.content
    
    print("PHAN HOI TU AI:")
    print(content)
    print("-" * 50)
    
    # In ra các thông số kỹ thuật (Metadata)
    usage = response.usage
    print("THONG KE SU DUNG (Billable):")
    print(f"- Prompt Tokens (Dau vao): {usage.prompt_tokens}")
    print(f"- Completion Tokens (Dau ra): {usage.completion_tokens}")
    print(f"- Tong Tokens (Tinh tien):    {usage.total_tokens}")
    
    print("\nTHONG TIN KHAC:")
    print(f"- Model ID:      {response.model}")
    print(f"- Request ID:    {response.id}")
    print(f"- Finish Reason: {response.choices[0].finish_reason}") # stop, length, content_filter...

except Exception as e:
    print(f"Loi API: {e}")
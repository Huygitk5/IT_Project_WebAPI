from openai import OpenAI


client = OpenAI(
    api_key="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"
)


response = client.responses.create(
    model="gpt-5-nano",
    input="what is the block cipher mode of operation?"
)


print(response.output_text)

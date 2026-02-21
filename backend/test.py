from risk_engine.engine import analyze_text

text = "URGENT! Your bank account is blocked. Click here https://fakebank.xyz/login to verify now."

result = analyze_text(text)

print(result)

from utils.qr_decoder import decode_qr

result = decode_qr("sample_qr.png")

print("Decoded QR Content:", result)

from utils.url_checker import analyze_urls

text = "Click here https://fakebank.xyz/login to verify account"

result = analyze_urls(text)

print(result)
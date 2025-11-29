# debug_download.py
import requests
from io import BytesIO
from PIL import Image

# 1. A guaranteed simple URL (Google Logo)
url = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"

print(f"Testing download from: {url}")

try:
    # Mimic a browser
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }
    
    response = requests.get(url, headers=headers, timeout=10)
    print(f"✅ Status Code: {response.status_code}")
    print(f"📄 Content Type: {response.headers.get('Content-Type')}")
    print(f"📦 File Size: {len(response.content)} bytes")

    # Try to open it as an image
    img = Image.open(BytesIO(response.content))
    print(f"🖼️ Image Opened Successfully! Size: {img.size}")

except Exception as e:
    print(f"❌ CRITICAL FAILURE: {e}")
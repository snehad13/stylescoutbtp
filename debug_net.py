# debug_net.py
import requests
import traceback

# The link that failed for you
url = "https://raw.githubusercontent.com/salesforce/BLIP/main/demo.jpg"

print(f"🕵️ Testing connection to: {url}")

try:
    # We purposefully DON'T use headers here to test raw connectivity
    resp = requests.get(url, timeout=10)
    
    print("\n✅ SUCCESS!")
    print(f"Status Code: {resp.status_code}")
    print(f"Image Size: {len(resp.content)} bytes")
    
    if resp.status_code == 200:
        print("🎉 Your internet and Python are working perfectly.")
    else:
        print("⚠️ The site is reachable, but gave an error code.")

except Exception:
    print("\n❌ CONNECTION FAILED")
    print("Here is the exact error (Paste this to Gemini):")
    print("-" * 30)
    traceback.print_exc()
    print("-" * 30)
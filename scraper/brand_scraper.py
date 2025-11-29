# scraper/brand_scraper.py
import requests
import psycopg2
import os
from urllib.parse import urlparse
from cleaner import clean_html_text, normalize_sizes

def get_store_name(url):
    """Turns 'https://shopmulmul.com/collections...' into 'Shopmulmul'"""
    domain = urlparse(url).netloc
    name = domain.replace("www.", "").split(".")[0]
    return name.capitalize()

def scrape_store(url):
    # 1. Setup Name & URL
    store_name = get_store_name(url)
    base_url = url.rstrip("/")
    api_url = f"{base_url}/products.json?limit=250"
    
    print(f"🛍️  Scraping {store_name} ({base_url})...")
    
    try:
        # 2. Fetch Data
        r = requests.get(api_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
        if r.status_code != 200:
            print(f"   ❌ Failed (Status {r.status_code})")
            return

        products = r.json().get("products", [])
        print(f"   Found {len(products)} products.")

        # 3. Connect DB
        conn = psycopg2.connect("dbname=styledb user=postgres password=postgres")
        cur = conn.cursor()

        saved_count = 0
        for p in products:
            # Basic info
            title = p.get("title")
            handle = p.get("handle")
            product_url = f"{base_url}/products/{handle}"
            
            # Images
            if not p.get("images"): continue
            image_url = p["images"][0]["src"]
            
            # Cleaning
            clean_desc = clean_html_text(p.get("body_html", ""))
            
            # Sizes & Price
            raw_sizes = [v["title"] for v in p.get("variants", [])]
            clean_sizes = normalize_sizes(raw_sizes)
            price = p["variants"][0]["price"]

            try:
                cur.execute("""
                    INSERT INTO products 
                    (title, vendor, price, image_url, product_url, sizes, description)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (product_url) DO UPDATE SET price = EXCLUDED.price
                """, (title, store_name, price, image_url, product_url, ",".join(clean_sizes), clean_desc))
                saved_count += 1
            except Exception as e:
                conn.rollback() 

        conn.commit()
        conn.close()
        print(f"   ✅ Saved {saved_count} items!")

    except Exception as e:
        print(f"   ❌ Error: {e}")

# --- MAIN RUNNER ---
if __name__ == "__main__":
    # 1. Check if file exists
    if not os.path.exists("stores.txt"):
        print("❌ Error: stores.txt not found! Please create it and add links.")
        exit()

    # 2. Read links from file
    with open("stores.txt", "r") as f:
        urls = [line.strip() for line in f if line.strip()]

    print(f"🚀 Loaded {len(urls)} stores from file.\n")

    # 3. Run Scraper
    for url in urls:
        scrape_store(url)
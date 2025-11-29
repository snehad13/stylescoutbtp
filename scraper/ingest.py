# scraper/ingest.py
import psycopg2
from pinterest import scrape_pinterest_board # Your previous script

def save_to_db(image_urls, board_url):
    conn = psycopg2.connect("dbname=styledb user=postgres password=postgres")
    cur = conn.cursor()
    
    count = 0
    for url in image_urls:
        try:
            # We use the URL as a temp title for now
            cur.execute("""
                INSERT INTO products (title, image_url, product_url) 
                VALUES (%s, %s, %s)
                ON CONFLICT (product_url) DO NOTHING
            """, ("Scraped Item", url, url))
            count += 1
        except Exception as e:
            print(f"Error: {e}")
            
    conn.commit()
    print(f"✅ Saved {count} new items to Database.")

if __name__ == "__main__":
    # 1. Scrape
    url = "https://www.pinterest.com/ideas/summer-outfits/935541699564/" # Example
    images = scrape_pinterest_board(url, max_images=10)
    
    # 2. Save
    save_to_db(images, url)
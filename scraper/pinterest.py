# scraper/pinterest.py
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

def scrape_pinterest_board(board_url, max_images=20):
    print(f"📌 Scraping Board: {board_url}")
    
    # 1. Setup Headless Chrome (No visible window)
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    # Pretend to be a real Mac user
    options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36")
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    valid_urls = set()
    
    try:
        driver.get(board_url)
        time.sleep(3) # Wait for initial load
        
        # 2. Scroll and Collect
        attempts = 0
        while len(valid_urls) < max_images and attempts < 5:
            # Get all images currently visible
            images = driver.find_elements(By.TAG_NAME, "img")
            
            for img in images:
                src = img.get_attribute("src")
                if src and "pinimg.com" in src:
                    # Filter out tiny user avatars (usually 75x75)
                    # We want '236x', '564x', or 'originals'
                    if "236x" in src or "564x" in src or "originals" in src:
                        valid_urls.add(src)
            
            # Scroll down to trigger lazy loading
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            attempts += 1
            print(f"   Found {len(valid_urls)} images...")

    except Exception as e:
        print(f"❌ Pinterest Scrape Error: {e}")
        
    finally:
        driver.quit()
        
    return list(valid_urls)[:max_images]

# Test it independently if you want:
if __name__ == "__main__":
    test_url = "https://www.pinterest.com/ideas/summer-outfits/935541699564/"
    print(scrape_pinterest_board(test_url))
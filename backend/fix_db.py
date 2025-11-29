# backend/fix_db.py
import psycopg2

try:
    print("🔧 Connecting to Database...")
    conn = psycopg2.connect("dbname=styledb user=postgres password=postgres")
    conn.autocommit = True
    cur = conn.cursor()

    # 1. Add 'sizes' column if missing
    print("Checking 'sizes' column...")
    cur.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes TEXT;")
    
    # 2. Add 'description' column if missing
    print("Checking 'description' column...")
    cur.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;")

    # 3. Add 'vendor' column if missing
    print("Checking 'vendor' column...")
    cur.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS vendor TEXT;")

    # 4. Ensure product_url is UNIQUE (Crucial for the scraper to not duplicate items)
    print("Ensuring unique constraints...")
    try:
        cur.execute("ALTER TABLE products ADD CONSTRAINT unique_url UNIQUE (product_url);")
    except psycopg2.errors.DuplicateTable:
        pass # Already exists, ignore
    except Exception as e:
        print(f"Note on constraint: {e}")

    print("✅ Database patched successfully!")
    conn.close()

except Exception as e:
    print(f"❌ Error patching DB: {e}")
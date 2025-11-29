# backend/check_data.py
import psycopg2

try:
    # Connect to the DB
    conn = psycopg2.connect("dbname=styledb user=postgres password=postgres")
    cur = conn.cursor()

    # 1. Count total items
    cur.execute("SELECT COUNT(*) FROM products;")
    count = cur.fetchone()[0]
    print(f"📊 Total Products in DB: {count}")

    # 2. Show first 5 REAL items (ignoring the scraped test ones)
    print("\n-------- FIRST 5 REAL ITEMS --------")
    cur.execute("SELECT id, vendor, title, price, sizes FROM products WHERE vendor IS NOT NULL LIMIT 5;")
    rows = cur.fetchall()

    for row in rows:
        print(f"ID: {row[0]}")
        print(f"Brand: {row[1]}")
        print(f"Item: {row[2]}")
        print(f"Price: {row[3]}")
        print(f"Sizes: {row[4]}")
        print("-" * 30)

    conn.close()

except Exception as e:
    print(f"❌ Error: {e}")
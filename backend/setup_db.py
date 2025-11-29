# backend/setup_db.py
import psycopg2

# Connect to your database
# CHANGE 'user' and 'password' to your local postgres credentials!
conn = psycopg2.connect("dbname=styledb user=postgres password=")
cur = conn.cursor()

# Create Products Table
cur.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        vendor TEXT,
        price NUMERIC,
        image_url TEXT,
        product_url TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
""")

conn.commit()
cur.close()
conn.close()
print("✅ Database tables created successfully.")
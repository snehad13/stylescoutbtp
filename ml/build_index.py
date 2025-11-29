# ml/build_index.py
from vibe import get_average_embedding 

import psycopg2
import faiss
import pickle
import numpy as np # Re-use your embedding logic

# 1. Fetch Data
conn = psycopg2.connect("dbname=styledb user=postgres password=postgres")
cur = conn.cursor()
cur.execute("SELECT id, image_url FROM products")
rows = cur.fetchall()

ids = []
vectors = []

print(f"Processing {len(rows)} items...")

for row in rows:
    pid, url = row
    # We cheat and reuse the 'get_average' function for single images
    # In reality, you'd make a 'get_single_embedding' function
    vec = get_average_embedding([url]) 
    
    if vec is not None:
        vectors.append(vec)
        ids.append(pid)

# 2. Build FAISS Index
dimension = 512
index = faiss.IndexFlatIP(dimension)
vector_matrix = np.array(vectors).astype('float32')
index.add(vector_matrix)

# 3. Save to Disk
faiss.write_index(index, "style.index")
with open("ids.pkl", "wb") as f:
    pickle.dump(ids, f)

print("✅ Index built and saved as 'style.index'")
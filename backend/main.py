# backend/main.py
import os
import sys
import psycopg2
from psycopg2.extras import RealDictCursor
from scraper.pinterest import scrape_pinterest_board
# Add get_text_embedding to the import line
from ml.vibe import get_average_embedding, get_text_embedding

# --- 1. THE PEACE TREATY (MUST BE FIRST) ---
# This tells your Mac: "It is okay if multiple libraries use OpenMP."
# Without this, PyTorch and FAISS will crash the app instantly.
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- 2. LOAD AI ENGINE (TORCH) BEFORE FAISS ---
# We import 'vibe' first because it contains PyTorch. 
# Loading PyTorch before FAISS prevents memory conflicts.
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml.vibe import get_average_embedding

# Now it is safe to load FAISS
import faiss
import pickle
import numpy as np

app = FastAPI()

# --- CORS: ALLOW EVERYONE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load AI Memory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_PATH = os.path.join(BASE_DIR, "style.index")
IDS_PATH = os.path.join(BASE_DIR, "ids.pkl")

index = None
ids_map = {}

if os.path.exists(INDEX_PATH):
    print("⏳ Loading AI Memory...")
    index = faiss.read_index(INDEX_PATH)
    with open(IDS_PATH, "rb") as f:
        ids_map = pickle.load(f)
    print("✅ Ready.")
else:
    print("❌ ERROR: style.index not found. Please run 'python ml/build_index.py'")

class SearchRequest(BaseModel):
    image_url: str

@app.post("/search")
def search_similar(req: SearchRequest):
    if index is None: return {"error": "AI Index not loaded"}
    
    print(f"🔍 Visual Search for: {req.image_url}")
    
    # 1. Embed query image
    query_vec = get_average_embedding([req.image_url])
    
    if query_vec is None:
        return {"error": "Could not download image."}
    
    # 2. Search FAISS
    try:
        D, I = index.search(np.array([query_vec]).astype('float32'), k=10)
        
        # 3. Resolve IDs
        found_db_ids = []
        scores = {}
        
        for i, idx in enumerate(I[0]):
            if idx in ids_map:
                db_id = ids_map[idx]
                found_db_ids.append(db_id)
                scores[db_id] = float(D[0][i])
        
        if not found_db_ids:
            return []

        # 4. Fetch FULL Details from Database
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # We select everything (*) so you get Title, Price, Image, Vendor, Description...
        placeholders = ",".join(["%s"] * len(found_db_ids))
        query = f"SELECT * FROM products WHERE id IN ({placeholders})"
        
        cur.execute(query, tuple(found_db_ids))
        products = cur.fetchall()
        conn.close()
        
        # 5. Attach Scores & Sort
        final_results = []
        for p in products:
            p['score'] = scores.get(p['id'], 0)
            final_results.append(p)
            
        # Sort by best match
        final_results.sort(key=lambda x: x['score'], reverse=True)
        
        return final_results

    except Exception as e:
        return {"error": str(e)}

# backend/main.py (Add to bottom)

class TextSearchRequest(BaseModel):
    query: str

@app.post("/search/text")
def search_by_text(req: TextSearchRequest):
    if index is None: return {"error": "AI Index not loaded"}

    print(f"📝 Searching for text: '{req.query}'")

    # 1. Convert Text to Vector
    query_vec = get_text_embedding(req.query)

    if query_vec is None: 
        return {"error": "Could not understand text."}

    # 2. Search FAISS (Compare Text Vector vs Image Database)
    # This works because CLIP maps "Red Dress" text to the same math spot as a Red Dress photo!
    try:
        D, I = index.search(np.array([query_vec]).astype('float32'), k=10)

        # 3. Fetch Results from DB (Reusing the same logic)
        found_db_ids = []
        scores = {}
        for i, idx in enumerate(I[0]):
            if idx in ids_map:
                db_id = ids_map[idx]
                found_db_ids.append(db_id)
                scores[db_id] = float(D[0][i])

        if not found_db_ids: return []

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        placeholders = ",".join(["%s"] * len(found_db_ids))
        query = f"SELECT id, title, price, image_url, product_url, vendor FROM products WHERE id IN ({placeholders})"
        cur.execute(query, tuple(found_db_ids))
        products = cur.fetchall()
        conn.close()

        for p in products:
            p['score'] = scores.get(p['id'], 0)

        final_results = sorted(products, key=lambda x: x['score'], reverse=True)
        return final_results

    except Exception as e:
        return {"error": str(e)}

class PinterestRequest(BaseModel):
    board_url: str

@app.post("/recommend/pinterest")
def recommend_from_pinterest(req: PinterestRequest):
    print(f"📌 Received Pinterest Request: {req.board_url}")

    # 1. Scrape Images
    image_urls = scrape_pinterest_board(req.board_url, max_images=15)

    if not image_urls:
        return {"error": "Could not access board. Is it public?"}

    print(f"   Analysing {len(image_urls)} images for Vibe...")

    # 2. Compute "Vibe Vector" (Average of all board images)
    vibe_vector = get_average_embedding(image_urls)

    if vibe_vector is None:
        return {"error": "Could not analyze images."}

    # 3. Search FAISS
    try:
        D, I = index.search(np.array([vibe_vector]).astype('float32'), k=20)

        # 4. Fetch Results from DB
        found_db_ids = []
        scores = {}
        for i, idx in enumerate(I[0]):
            if idx in ids_map:
                db_id = ids_map[idx]
                found_db_ids.append(db_id)
                scores[db_id] = float(D[0][i])

        if not found_db_ids: return []

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        placeholders = ",".join(["%s"] * len(found_db_ids))
        query = f"SELECT * FROM products WHERE id IN ({placeholders})"
        cur.execute(query, tuple(found_db_ids))
        products = cur.fetchall()
        conn.close()

        # Attach scores & Sort
        for p in products:
            p['score'] = scores.get(p['id'], 0)

        final_results = sorted(products, key=lambda x: x['score'], reverse=True)

        return {
            "message": "Success",
            "scraped_count": len(image_urls),
            "results": final_results
        }

    except Exception as e:
        return {"error": str(e)}


# backend/main.py (Add to bottom)

@app.get("/brands")
def get_all_brands():
    """
    Returns a list of all niche brands in the database, 
    plus a 'hero image' for each (taken from their products).
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # SMART QUERY:
        # 1. Group by Vendor
        # 2. Count how many items they have
        # 3. Pick the FIRST image found to be the "Brand Card" image
        query = """
            SELECT 
                vendor, 
                COUNT(*) as item_count,
                (ARRAY_AGG(image_url))[1] as brand_image
            FROM products 
            WHERE vendor IS NOT NULL 
            GROUP BY vendor 
            ORDER BY item_count DESC;
        """
        
        cur.execute(query)
        brands = cur.fetchall()
        conn.close()
        
        return brands
    except Exception as e:
        return {"error": str(e)}

@app.get("/brands/{brand_name}")
def get_brand_products(brand_name: str):
    """
    Returns all products for a specific brand (e.g., 'Okhai').
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # We use ILIKE for case-insensitive matching (okhai == Okhai)
        query = "SELECT * FROM products WHERE vendor ILIKE %s ORDER BY id DESC"
        cur.execute(query, (brand_name,))
        products = cur.fetchall()
        conn.close()
        
        return {
            "brand": brand_name,
            "count": len(products),
            "products": products
        }
    except Exception as e:
        return {"error": str(e)}


# backend/main.py

# --- PASTE THIS HELPER FUNCTION ---
def get_db_connection():
    return psycopg2.connect("dbname=styledb user=postgres password=postgres")
# ----------------------------------
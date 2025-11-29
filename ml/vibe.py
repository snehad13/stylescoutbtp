import requests
import torch
import numpy as np
from PIL import Image
from io import BytesIO
from transformers import CLIPProcessor, CLIPModel
import certifi
import os
os.environ['SSL_CERT_FILE'] = certifi.where()

# Load model ONCE when this module is imported
print("⏳ Loading CLIP Model for Vibe Engine...")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
print("✅ CLIP Loaded.")

# ml/vibe.py (Update just this function)

def get_average_embedding(image_urls):
    valid_vectors = []
    
    # FAKE HEADERS: Makes Pinterest think we are a Mac Laptop using Chrome
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
    }

    for url in image_urls:
        try:
            # Added 'headers=headers' here!
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code != 200:
                print(f"⚠️ Failed to download {url} (Status: {response.status_code})")
                continue
                
            image = Image.open(BytesIO(response.content)).convert("RGB")

            inputs = processor(images=image, return_tensors="pt")
            with torch.no_grad():
                emb = model.get_image_features(**inputs)
            
            vec = emb.cpu().numpy().flatten()
            vec = vec / np.linalg.norm(vec)
            valid_vectors.append(vec)

        except Exception as e:
            print(f"❌ Error processing image {url}: {e}")

    if not valid_vectors:
        print("⚠️ No valid images found to embed.")
        return None

    avg_vector = np.mean(valid_vectors, axis=0)
    avg_vector = avg_vector / np.linalg.norm(avg_vector)
    
    return avg_vector

    # ml/vibe.py (Add this to the bottom)

def get_text_embedding(text_query):
    """
    Converts a text string (e.g., 'Red floral dress') into a vector.
    """
    try:
        # 1. Tokenize the text
        inputs = processor(text=[text_query], return_tensors="pt", padding=True)
        
        # 2. Get Vector from CLIP Text Encoder
        with torch.no_grad():
            text_features = model.get_text_features(**inputs)
            
        # 3. Normalize (Crucial for FAISS matching)
        vec = text_features.cpu().numpy().flatten()
        vec = vec / np.linalg.norm(vec)
        
        return vec
    except Exception as e:
        print(f"❌ Error embedding text: {e}")
        return None# remove the embedded repo from the index (so we can re-add its files normally)
git rm --cached style-scout-aesthetics

# remove the nested .git folder so the inner repo becomes a normal folder (loses inner history locally)
rm -rf style-scout-aesthetics/.git

# now add everything normally
git add style-scout-aesthetics
git commit -m "feat(frontend): add style-scout-aesthetics as normal folder (no submodule)"

# add remote for outer repo (replace with your GitHub repo URL)
git remote add origin <your-outer-repo-url>

# set main branch and push
git branch -M main
git push -u origin main
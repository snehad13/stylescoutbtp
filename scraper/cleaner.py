# scraper/cleaner.py
from bs4 import BeautifulSoup
import re

# Standard mapping to fix weird sizes
SIZE_MAP = {
    "small": "S", "s": "S", "sm": "S", "uk 8": "S",
    "medium": "M", "m": "M", "uk 10": "M",
    "large": "L", "l": "L", "lg": "L", "uk 12": "L",
    "extra large": "XL", "xl": "XL",
    "free": "Free Size", "one size": "Free Size"
}

def clean_html_text(raw_html):
    """Turns '<div><b>Cool Dress</b></div>' into 'Cool Dress'"""
    if not raw_html:
        return ""
    soup = BeautifulSoup(raw_html, "html.parser")
    text = soup.get_text(separator=" ")
    # Remove extra spaces/newlines
    return " ".join(text.split())

def normalize_sizes(raw_sizes):
    """Turns ['Small', 'M', 'UK 8'] into ['S', 'M']"""
    clean_set = set()
    
    for size in raw_sizes:
        # 1. Clean the string
        s = str(size).strip().lower()
        
        # 2. Map to standard keys
        if s in SIZE_MAP:
            clean_set.add(SIZE_MAP[s])
        else:
            # If standard key not found, try to grab the first letter (S, M, L)
            # This handles "Small (UK 8)" -> "S"
            match = re.search(r'\b(xs|s|m|l|xl|xxl)\b', s)
            if match:
                clean_set.add(match.group(1).upper())
            else:
                clean_set.add(s.upper()) # Fallback
                
    return list(clean_set)
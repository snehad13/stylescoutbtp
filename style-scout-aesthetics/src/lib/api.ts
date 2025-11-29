/**
 * API Client for StyleScout Backend
 * All backend communication functions are centralized here.
 */

// Base URL from environment variable, fallback to localhost for development
// Supports both VITE_API_URL and VITE_API_BASE_URL for flexibility
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? 
  import.meta.env.VITE_API_BASE_URL ?? 
  "http://localhost:8000"
).replace(/\/$/, "");

/**
 * Helper to build full API URL
 */
const buildUrl = (path: string): string => `${API_BASE_URL}${path}`;

/**
 * Product type returned from the backend
 */
export type Product = {
  id: number;
  title: string;
  price: string | number;
  image_url: string;
  product_url: string;
  vendor: string;
  description?: string;
  score?: number;
};

/**
 * Brand type returned from /brands endpoint
 */
export type Brand = {
  vendor: string;
  item_count: number;
  brand_image: string;
};

/**
 * Quiz payload structure
 */
export type QuizPayload = {
  styles: string[];
  occasions: string[];
};

/**
 * Response type for quiz recommendations
 */
export type QuizRecommendationResponse = {
  query: string;
  products: Product[];
};

/**
 * Response type for Pinterest board recommendations
 */
export type PinterestRecommendationResponse = {
  message?: string;
  scraped_count?: number;
  results: Product[];
  error?: string;
};

/**
 * Response type for brand products
 */
export type BrandProductsResponse = {
  brand: string;
  count: number;
  products: Product[];
};

/**
 * Generate a search query from quiz answers
 */
const generateQueryFromQuiz = (payload: QuizPayload): string => {
  const styleDescriptions: Record<string, string> = {
    minimal: "minimalist clean neutral elegant timeless",
    boho: "bohemian free-spirited earthy flowy vintage patterns",
    street: "streetwear urban edgy bold graphic casual",
    chic: "sophisticated elegant polished refined classic",
    ethnic: "traditional cultural vibrant patterns artisan handmade",
    vintage: "retro nostalgic classic timeless antique",
  };

  const occasionDescriptions: Record<string, string> = {
    casual: "everyday comfortable relaxed",
    work: "professional office formal business",
    evening: "party night out glamorous dressy",
    special: "wedding event celebration formal occasion",
  };

  const styleTerms = payload.styles
    .map((s) => styleDescriptions[s] || s)
    .join(" ");
  const occasionTerms = payload.occasions
    .map((o) => occasionDescriptions[o] || o)
    .join(" ");

  return `${styleTerms} ${occasionTerms} fashion clothing`.trim();
};

/**
 * Get recommended products based on quiz answers
 * Uses the /search/text endpoint with a generated query
 */
export const getRecommendedProductsFromQuiz = async (
  payload: QuizPayload
): Promise<QuizRecommendationResponse> => {
  const query = generateQueryFromQuiz(payload);

  const response = await fetch(buildUrl("/search/text"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("Failed to get recommendations");
  }

  const products = await response.json();

  if (products.error) {
    throw new Error(products.error);
  }

  return {
    query,
    products: Array.isArray(products) ? products : [],
  };
};

/**
 * Get product recommendations from a Pinterest board URL
 * Uses the POST /recommend/pinterest endpoint
 * @param boardUrl - Public Pinterest board URL
 */
export const getRecommendationsFromPinterestBoard = async (
  boardUrl: string
): Promise<PinterestRecommendationResponse> => {
  const response = await fetch(buildUrl("/recommend/pinterest"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ board_url: boardUrl }),
  });

  if (!response.ok) {
    // Try to get error text for better debugging
    let errorMessage = `Backend error ${response.status}`;
    try {
      const text = await response.text();
      if (text) {
        errorMessage = `${errorMessage}: ${text}`;
      }
    } catch {
      // Ignore text parsing errors
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

/**
 * Get all brands from the database
 * Uses the /brands endpoint
 */
export const getBrands = async (): Promise<Brand[]> => {
  const response = await fetch(buildUrl("/brands"));

  if (!response.ok) {
    throw new Error("Failed to load brands");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return Array.isArray(data) ? data : [];
};

/**
 * Get all products for a specific brand
 * Uses the /brands/{brand_name} endpoint
 */
export const getBrandProducts = async (
  brandName: string
): Promise<BrandProductsResponse> => {
  const response = await fetch(buildUrl(`/brands/${encodeURIComponent(brandName)}`));

  if (!response.ok) {
    throw new Error("Failed to load brand products");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

/**
 * Visual search by image URL
 * Uses the /search endpoint
 */
export const searchByImage = async (imageUrl: string): Promise<Product[]> => {
  const response = await fetch(buildUrl("/search"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image_url: imageUrl }),
  });

  if (!response.ok) {
    throw new Error("Failed to search by image");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return Array.isArray(data) ? data : [];
};

/**
 * Text-based search
 * Uses the /search/text endpoint
 */
export const searchByText = async (query: string): Promise<Product[]> => {
  const response = await fetch(buildUrl("/search/text"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("Failed to search");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return Array.isArray(data) ? data : [];
};


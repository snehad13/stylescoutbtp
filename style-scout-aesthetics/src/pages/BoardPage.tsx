/**
 * BoardPage - Displays all products for a specific brand/board
 * Shows products in a Pinterest-style masonry layout
 */

import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  Loader2,
  RefreshCw,
  ShoppingBag,
  Store,
  Grid3X3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PinModal from "@/components/PinModal";
import { getBrandProducts, type Product } from "@/lib/api";

const BoardPage = () => {
  const { id: brandName } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);

  // Fetch brand products
  const {
    data: brandData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["brand-products", brandName],
    queryFn: () => getBrandProducts(brandName!),
    enabled: !!brandName,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const toggleLike = (productId: number) => {
    setLikedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const formatPrice = (price: string | number): string => {
    if (typeof price === "number") {
      return `₹${price.toLocaleString()}`;
    }
    if (price.includes("₹") || price.includes("$")) {
      return price;
    }
    return `₹${price}`;
  };

  // Get a hero image from the products
  const heroImage = brandData?.products?.[0]?.image_url;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Banner */}
      <div className="relative pt-20">
        <div className="h-64 md:h-80 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 overflow-hidden">
          {heroImage && (
            <img
              src={heroImage}
              alt={brandName || "Brand"}
              className="w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Brand Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-end gap-6">
              {/* Brand Icon */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white shadow-xl flex items-center justify-center border-4 border-background">
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt={brandName || "Brand"}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Store className="h-12 w-12 text-primary" />
                )}
              </div>

              <div className="flex-1 pb-2">
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {brandName || "Brand Collection"}
                </h1>
                {brandData && (
                  <p className="text-muted-foreground">
                    {brandData.count} products available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          {/* Navigation */}
          <div className="flex items-center justify-between py-6 border-b border-border mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Grid3X3 className="h-4 w-4" />
              <span className="text-sm">Board View</span>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground text-lg">
                Loading collection...
              </p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <Card className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Unable to Load Collection
              </h3>
              <p className="text-muted-foreground mb-6">
                {error instanceof Error
                  ? error.message
                  : "Please check your connection and try again."}
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => refetch()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Link to="/discover">
                  <Button variant="outline" className="rounded-full px-8">
                    Browse Brands
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && !isError && brandData?.products?.length === 0 && (
            <Card className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                No Products Found
              </h3>
              <p className="text-muted-foreground mb-6">
                This collection doesn't have any products yet.
              </p>
              <Link to="/discover">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
                  Explore Other Brands
                </Button>
              </Link>
            </Card>
          )}

          {/* Products Grid - Masonry Layout */}
          {!isLoading && brandData?.products && brandData.products.length > 0 && (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {brandData.products.map((product) => (
                <article key={product.id} className="break-inside-avoid">
                  <Card
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.title || "Product"}
                          className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center">
                          <ShoppingBag className="h-12 w-12 text-primary/40" />
                        </div>
                      )}

                      {/* Like Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(product.id);
                        }}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-md opacity-0 group-hover:opacity-100"
                      >
                        <Heart
                          className={`h-5 w-5 transition-colors ${
                            likedProducts.includes(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-foreground hover:text-red-500"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                        {product.title || "Untitled Product"}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              product.product_url,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Product Detail Modal */}
      <PinModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onLike={(product) => toggleLike(product.id)}
        isLiked={selectedProduct ? likedProducts.includes(selectedProduct.id) : false}
      />
    </div>
  );
};

export default BoardPage;


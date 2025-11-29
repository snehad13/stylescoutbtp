/**
 * QuizResultBoardPage - Displays recommended products after quiz completion
 * Shows products in a Pinterest-style masonry layout
 */

import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  Heart,
  ExternalLink,
  ArrowLeft,
  Loader2,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PinModal from "@/components/PinModal";
import { getRecommendedProductsFromQuiz, type Product, type QuizPayload } from "@/lib/api";

const QuizResultBoardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);

  // Get quiz data from navigation state
  const quizData = location.state as QuizPayload | null;

  // Redirect to quiz if no data
  useEffect(() => {
    if (!quizData || !quizData.styles?.length || !quizData.occasions?.length) {
      navigate("/quiz");
    }
  }, [quizData, navigate]);

  // Fetch recommendations based on quiz answers
  const {
    data: recommendations,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["quiz-recommendations", quizData],
    queryFn: () => getRecommendedProductsFromQuiz(quizData!),
    enabled: !!quizData?.styles?.length && !!quizData?.occasions?.length,
    retry: 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
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

  // Get style labels for display
  const getStyleLabels = () => {
    const styleMap: Record<string, string> = {
      minimal: "Minimal",
      boho: "Boho",
      street: "Street",
      chic: "Chic",
      ethnic: "Ethnic",
      vintage: "Vintage",
    };
    return quizData?.styles.map((s) => styleMap[s] || s).join(", ") || "";
  };

  if (!quizData) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">
                Your Style Board
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Curated Just For You
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              Based on your {getStyleLabels()} style preferences, here are products
              that match your unique aesthetic.
            </p>

            <div className="flex justify-center gap-3 flex-wrap">
              {quizData.styles.map((style) => (
                <span
                  key={style}
                  className="px-4 py-1.5 bg-primary/10 text-primary text-sm rounded-full font-medium capitalize"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/quiz")}
              className="rounded-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retake Quiz
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground text-lg">
                Finding your perfect matches...
              </p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Unable to Load Recommendations
              </h3>
              <p className="text-muted-foreground mb-6">
                {error instanceof Error
                  ? error.message
                  : "Please check your connection and try again."}
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && !isError && recommendations?.products?.length === 0 && (
            <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                No Products Found
              </h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find products matching your preferences. Try different
                style combinations!
              </p>
              <Link to="/quiz">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retake Quiz
                </Button>
              </Link>
            </Card>
          )}

          {/* Products Grid - Masonry Layout */}
          {!isLoading &&
            recommendations?.products &&
            recommendations.products.length > 0 && (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  Showing {recommendations.products.length} products curated for you
                </p>

                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                  {recommendations.products.map((product) => (
                    <article key={product.id} className="break-inside-avoid">
                      <Card
                        className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white/90 backdrop-blur-sm"
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

                          {/* Match Score Badge */}
                          {product.score !== undefined && product.score > 0 && (
                            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                              <span className="text-xs font-semibold text-primary">
                                {Math.round(product.score * 100)}% match
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          {product.vendor && (
                            <p className="text-xs uppercase text-muted-foreground tracking-wide mb-1">
                              {product.vendor}
                            </p>
                          )}
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

                {/* Browse More CTA */}
                <div className="text-center mt-16">
                  <Card className="inline-block p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10">
                    <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                      Want to explore more?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Browse our curated collection of niche brands
                    </p>
                    <Link to="/discover">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
                        Discover All Brands
                        <Sparkles className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </Card>
                </div>
              </>
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

export default QuizResultBoardPage;


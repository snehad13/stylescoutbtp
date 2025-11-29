/**
 * Pinterest Page - Get product recommendations from a Pinterest board
 * Uses POST /recommend/pinterest endpoint
 */

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ExternalLink,
  Heart,
  Link2,
  Loader2,
  Pin as PinIcon,
  ShoppingBag,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import PinModal from "@/components/PinModal";
import {
  getRecommendationsFromPinterestBoard,
  type Product,
  type PinterestRecommendationResponse,
} from "@/lib/api";

const Pinterest = () => {
  const { toast } = useToast();
  const [boardUrl, setBoardUrl] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [recommendations, setRecommendations] = useState<PinterestRecommendationResponse | null>(null);

  // Mutation for getting recommendations from Pinterest board
  const recommendMutation = useMutation({
    mutationFn: (url: string) => getRecommendationsFromPinterestBoard(url),
    onSuccess: (data) => {
      setRecommendations(data);
      toast({
        title: "Recommendations Ready!",
        description: `Found ${data.results?.length || 0} products matching your Pinterest board style.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Unable to analyze board",
        description: error.message || "Please check the URL and try again. Make sure the board is public.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!boardUrl.trim()) {
      toast({
        title: "Pinterest Board URL Required",
        description: "Paste a public Pinterest board URL to get style recommendations.",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    if (!boardUrl.includes("pinterest.com")) {
      toast({
        title: "Invalid Pinterest URL",
        description: "Please enter a valid Pinterest board URL (e.g., https://www.pinterest.com/username/board-name/)",
        variant: "destructive",
      });
      return;
    }

    recommendMutation.mutate(boardUrl);
  };

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

  const handleClear = () => {
    setBoardUrl("");
    setRecommendations(null);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/20">
              <PinIcon className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">Pinterest Style Match</span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Shop Your Pinterest Vibe
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Paste any public Pinterest board URL and we'll find products that match your aesthetic.
              Our AI analyzes the images to understand your style.
            </p>
          </div>

          {/* Input Form */}
          <Card className="p-8 mb-12 bg-white/80 backdrop-blur-sm border border-primary/10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="board-url"
                  className="text-sm font-medium text-foreground mb-2 flex items-center gap-2"
                >
                  <Link2 className="h-4 w-4 text-primary" />
                  Pinterest Board URL
                </Label>
                <Input
                  id="board-url"
                  type="url"
                  placeholder="https://www.pinterest.com/username/board-name/"
                  required
                  value={boardUrl}
                  onChange={(e) => setBoardUrl(e.target.value)}
                  className="h-12 text-base rounded-2xl"
                  disabled={recommendMutation.isPending}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Example: https://www.pinterest.com/pinterestuser/summer-outfits/
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={recommendMutation.isPending}
                  className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12"
                >
                  {recommendMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Board...
                    </>
                  ) : (
                    <>
                      Find Matching Products
                      <Sparkles className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full h-12"
                  onClick={handleClear}
                  disabled={recommendMutation.isPending}
                >
                  Clear
                </Button>
              </div>
            </form>
          </Card>

          {/* Loading State */}
          {recommendMutation.isPending && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <PinIcon className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-muted-foreground mt-6 text-center max-w-md">
                Analyzing your Pinterest board... This may take a moment as we examine each image to understand your style.
              </p>
            </div>
          )}

          {/* Error State with Retry */}
          {recommendMutation.isError && !recommendMutation.isPending && (
            <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
              <PinIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Couldn't Analyze Board
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {recommendMutation.error?.message || "Please make sure the Pinterest board URL is correct and the board is public."}
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => recommendMutation.mutate(boardUrl)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                  disabled={!boardUrl.trim()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </Card>
          )}

          {/* Empty Initial State */}
          {!recommendMutation.isPending && !recommendations && !recommendMutation.isError && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
                <PinIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Ready to Match Your Style
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter a Pinterest board URL above to discover products that match your aesthetic preferences.
              </p>
            </div>
          )}

          {/* Results */}
          {recommendations && recommendations.results && recommendations.results.length > 0 && (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-foreground">
                    Products For Your Vibe
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {recommendations.scraped_count
                      ? `Analyzed ${recommendations.scraped_count} images • `
                      : ""}
                    Found {recommendations.results.length} matching products
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={handleClear}
                >
                  New Search
                </Button>
              </div>

              {/* Products Grid - Masonry Layout */}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {recommendations.results.map((product) => (
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
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
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
                              window.open(product.product_url, "_blank", "noopener,noreferrer");
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
            </>
          )}

          {/* No Results */}
          {recommendations && (!recommendations.results || recommendations.results.length === 0) && (
            <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                No Matching Products Found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find products matching this board's style. Try a different board with more diverse images.
              </p>
              <Button
                onClick={handleClear}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
              >
                Try Another Board
              </Button>
            </Card>
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

export default Pinterest;

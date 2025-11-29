/**
 * Discover Page - Browse all brands with real API data
 * Displays brands in a grid layout with text search
 */

import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Heart,
  ExternalLink,
  Sparkles,
  Loader2,
  RefreshCw,
  Store,
  ShoppingBag,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getBrands, type Brand } from "@/lib/api";

const Discover = () => {
  const [likedBrands, setLikedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch brands from API
  const {
    data: brands,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  // Debounce search query (300ms)
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const toggleLike = (vendorName: string) => {
    setLikedBrands((prev) =>
      prev.includes(vendorName)
        ? prev.filter((b) => b !== vendorName)
        : [...prev, vendorName]
    );
  };

  // Filter brands based on search query (client-side)
  const filteredBrands = useMemo(() => {
    if (!brands) return [];
    if (!debouncedQuery.trim()) return brands;

    const query = debouncedQuery.toLowerCase().trim();
    return brands.filter((brand) =>
      brand.vendor.toLowerCase().includes(query)
    );
  }, [brands, debouncedQuery]);

  const hasSearchQuery = debouncedQuery.trim().length > 0;
  const noResults = hasSearchQuery && filteredBrands.length === 0 && !isLoading;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">
                Curated For You
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Discover Hidden Gems
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Authentic indie brands that match your unique aesthetic
            </p>
          </div>

          {/* Search Input */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 pr-4 text-base rounded-full border-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading brands..."
                : hasSearchQuery
                  ? `Found ${filteredBrands.length} brand${filteredBrands.length !== 1 ? "s" : ""} matching "${debouncedQuery}"`
                  : `Showing ${filteredBrands.length} brands`}
            </p>
            {hasSearchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear search
              </Button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">
                Discovering amazing brands...
              </p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <Card className="p-12 text-center">
              <Store className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Unable to Load Brands
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

          {/* No Search Results */}
          {noResults && (
            <Card className="p-12 text-center">
              <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                No Brands Found
              </h3>
              <p className="text-muted-foreground mb-6">
                No brands match "{debouncedQuery}". Try a different search term.
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="rounded-full px-8"
              >
                Clear Search
              </Button>
            </Card>
          )}

          {/* Empty State (no brands at all) */}
          {!isLoading && !isError && !hasSearchQuery && filteredBrands.length === 0 && (
            <Card className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                No Brands Found
              </h3>
              <p className="text-muted-foreground mb-6">
                We're still adding new brands. Check back soon!
              </p>
              <Link to="/quiz">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
                  Take Style Quiz
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          )}

          {/* Brands Grid */}
          {!isLoading && !noResults && filteredBrands.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBrands.map((brand: Brand) => (
                <Link
                  key={brand.vendor}
                  to={`/board/${encodeURIComponent(brand.vendor)}`}
                >
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                    {/* Brand Image */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
                      {brand.brand_image ? (
                        <img
                          src={brand.brand_image}
                          alt={brand.vendor}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center p-4">
                            <Store className="h-12 w-12 text-primary mx-auto mb-2 opacity-40" />
                            <p className="text-xs text-muted-foreground">
                              {brand.vendor}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Like Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleLike(brand.vendor);
                        }}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-md"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            likedBrands.includes(brand.vendor)
                              ? "fill-red-500 text-red-500"
                              : "text-foreground"
                          }`}
                        />
                      </button>

                      {/* Item Count Badge */}
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                        <span className="text-xs font-medium text-foreground">
                          {brand.item_count} items
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {brand.vendor}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {brand.item_count} products
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all rounded-full"
                      >
                        View Collection
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Discover;

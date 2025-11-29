/**
 * PinModal - Product detail modal component
 * Displays product information in a Pinterest-style modal
 */

import { ExternalLink, Heart, ShoppingBag, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/lib/api";

type PinModalProps = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onLike?: (product: Product) => void;
  isLiked?: boolean;
};

const PinModal = ({
  product,
  isOpen,
  onClose,
  onLike,
  isLiked = false,
}: PinModalProps) => {
  if (!product) return null;

  const formatPrice = (price: string | number): string => {
    if (typeof price === "number") {
      return `₹${price.toLocaleString()}`;
    }
    // If price already has currency symbol, return as is
    if (price.includes("₹") || price.includes("$")) {
      return price;
    }
    return `₹${price}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.title || "Product Details"}</DialogTitle>
          <DialogDescription>View product details and shop</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title || "Product"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-primary/30" />
              </div>
            )}

            {/* Like Button */}
            {onLike && (
              <button
                onClick={() => onLike(product)}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-lg"
              >
                <Heart
                  className={`h-6 w-6 transition-colors ${
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-foreground hover:text-red-500"
                  }`}
                />
              </button>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Vendor/Brand */}
            {product.vendor && (
              <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full mb-4 w-fit">
                <Tag className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-foreground uppercase tracking-wide">
                  {product.vendor}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight">
              {product.title || "Untitled Product"}
            </h2>

            {/* Price */}
            <p className="text-2xl font-semibold text-primary mb-4">
              {formatPrice(product.price)}
            </p>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Match Score */}
            {product.score !== undefined && product.score > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                <p className="text-sm text-muted-foreground mb-1">Style Match</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${Math.min(product.score * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {Math.round(product.score * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-14 text-base"
                onClick={() =>
                  window.open(product.product_url, "_blank", "noopener,noreferrer")
                }
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full h-12"
                onClick={() =>
                  window.open(product.product_url, "_blank", "noopener,noreferrer")
                }
              >
                View on Store
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinModal;


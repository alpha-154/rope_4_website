"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
  Heart,
  Share2,
} from "lucide-react";
import { publicApiClient } from "@/lib/axios";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { addItem, setIsDrawerOpen } = useCart();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    publicApiClient
      .get(`/public/products/${slug}`)
      .then((res) => {
        if (isMounted && res.data?.data) {
          setProduct(res.data.data);
          setSelectedImage(res.data.data.images?.[0] || "");
        }
      })
      .catch(() => {
        // Fallback demo product
        const demo = {
          _id: "demo-prod",
          title: "Rope4 Expedition Technical Backpack 55L",
          slug,
          sku: "R4-BPK-55L",
          category: "Camping & Backpacking",
          brand: "Rope4",
          price: 6800,
          compareAtPrice: 7500,
          stockQuantity: 30,
          lowStockThreshold: 5,
          images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
          ],
          shortDescription:
            "Heavy-duty alpine mountaineering pack with ergonomic suspension and dual ice axe loops.",
          description:
            "Engineered for high-altitude trekking and multi-day wilderness expeditions. Crafted from 420D ripstop nylon with polyurethane water-resistant coating. Features an ergonomic padded lumbar belt, integrated waterproof rain fly in base compartment, and internal hydration reservoir sleeve.",
          specifications: [
            { key: "Volume Capacity", value: "55 Liters + 5L expansion collar" },
            { key: "Material", value: "420D High-Tenacity Ripstop Nylon" },
            { key: "Weight", value: "1,650 grams" },
            { key: "Suspension", value: "Custom-fit aluminum stay frame" },
            { key: "Rain Cover", value: "Integrated hi-vis orange waterproof fly" },
          ],
        };
        setProduct(demo);
        setSelectedImage(demo.images[0]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <Package className="h-10 w-10 text-primary animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground font-medium">
          Loading gear product details...
        </p>
      </div>
    );
  }

  const isOutOfStock = (product.stockQuantity || 0) <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(
      {
        productId: product._id,
        title: product.title,
        sku: product.sku,
        price: product.price,
        image: selectedImage || product.images?.[0],
        maxStock: product.stockQuantity,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(
      {
        productId: product._id,
        title: product.title,
        sku: product.sku,
        price: product.price,
        image: selectedImage || product.images?.[0],
        maxStock: product.stockQuantity,
      },
      quantity
    );
    setIsDrawerOpen(false);
    router.push("/checkout");
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images || [],
    description: product.shortDescription || product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand || "Rope4",
    },
    offers: {
      "@type": "Offer",
      url: `https://rope4.com/store/${product.slug}`,
      priceCurrency: "BDT",
      price: product.price,
      availability:
        product.stockQuantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Rope4 Outdoor Education",
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* JSON-LD Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/store" className="hover:underline">
          Gear Store
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground truncate font-medium">
          {product.title}
        </span>
      </div>

      {/* Main 2-Column Product Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="rounded-2xl border bg-muted overflow-hidden h-[380px] sm:h-[460px] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-md">
                Special Offer
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`h-20 w-20 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                    selectedImage === img
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Thumb ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info, Price, Actions */}
        <div className="space-y-6">
          <div className="space-y-2 border-b pb-6">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-mono text-xs uppercase">
                {product.brand || "Rope4"} • {product.sku}
              </Badge>
              {isOutOfStock ? (
                <Badge variant="destructive">Out of Stock</Badge>
              ) : (
                <Badge variant="nature">
                  In Stock ({product.stockQuantity} units)
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-snug">
              {product.title}
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="pt-3 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-foreground">
                {product.price?.toLocaleString()} BDT
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-base text-muted-foreground line-through">
                  {product.compareAtPrice.toLocaleString()} BDT
                </span>
              )}
            </div>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase text-muted-foreground">
                Quantity:
              </span>
              <div className="flex items-center border rounded-xl overflow-hidden bg-muted/40">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-bold text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(product.stockQuantity || 99, quantity + 1)
                    )
                  }
                  disabled={
                    quantity >= (product.stockQuantity || 99) || isOutOfStock
                  }
                  className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                size="lg"
                variant="outline"
                className="gap-2 font-bold"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Cart</span>
              </Button>

              <Button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                size="lg"
                className="gap-2 font-bold shadow-lg"
              >
                <span>Buy Now</span>
              </Button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-muted/30 rounded-2xl border text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary shrink-0" />
              <span>Fast nationwide courier delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>100% genuine outdoor gear</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-primary shrink-0" />
              <span>7-day return policy for unused items</span>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                Technical Specifications
              </h3>
              <div className="border rounded-xl overflow-hidden divide-y text-xs">
                {product.specifications.map((spec: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between py-2.5 px-4 bg-card hover:bg-muted/30"
                  >
                    <span className="text-muted-foreground font-medium">
                      {spec.key}
                    </span>
                    <span className="font-semibold text-foreground">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Description */}
          {product.description && (
            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                Product Details
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


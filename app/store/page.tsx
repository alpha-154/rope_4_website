"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Filter,
  Check,
  Plus,
  ArrowRight,
  Package,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { publicApiClient } from "@/lib/axios";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const CATEGORIES = [
  "All",
  "Apparel",
  "Footwear",
  "Climbing Gear",
  "Camping & Backpacking",
  "Accessories",
  "Navigation & Safety",
];

const DEFAULT_PRODUCTS = [
  {
    _id: "prod-1",
    title: "Rope4 Expedition Technical Backpack 55L",
    slug: "rope4-expedition-technical-backpack-55l",
    sku: "R4-BPK-55L",
    category: "Camping & Backpacking",
    brand: "Rope4",
    price: 6800,
    compareAtPrice: 7500,
    stockQuantity: 30,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    ],
    shortDescription: "Heavy-duty alpine mountaineering pack with ergonomic suspension and ice axe loops.",
  },
  {
    _id: "prod-2",
    title: "Rope4 Dynamic Alpine Climbing Rope 9.8mm x 60m",
    slug: "rope4-dynamic-alpine-climbing-rope-98mm-60m",
    sku: "R4-ROP-98-60M",
    category: "Climbing Gear",
    brand: "Rope4",
    price: 9200,
    compareAtPrice: 10500,
    stockQuantity: 18,
    images: [
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80",
    ],
    shortDescription: "UIAA certified dry-treated dynamic single rope for alpine rock climbing.",
  },
  {
    _id: "prod-3",
    title: "Rope4 StormShield Gore-Tex Alpine Shell Jacket",
    slug: "rope4-stormshield-gore-tex-alpine-jacket",
    sku: "R4-APP-JKT-01",
    category: "Apparel",
    brand: "Rope4",
    price: 8400,
    compareAtPrice: 9900,
    stockQuantity: 25,
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    ],
    shortDescription: "3-layer weatherproof breathable shell engineered for extreme mountain conditions.",
  },
  {
    _id: "prod-4",
    title: "Rope4 TrailMaster Carbon Trekking Poles (Pair)",
    slug: "rope4-trailmaster-carbon-trekking-poles",
    sku: "R4-POLE-CRB-01",
    category: "Camping & Backpacking",
    brand: "Rope4",
    price: 3200,
    compareAtPrice: 3800,
    stockQuantity: 40,
    images: [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80",
    ],
    shortDescription: "Ultralight carbon fiber poles with quick-lock flick mechanism and cork grips.",
  },
  {
    _id: "prod-5",
    title: "Rope4 Technical Screwgate Locking Carabiner (4-Pack)",
    slug: "rope4-technical-screwgate-locking-carabiner-4pack",
    sku: "R4-CRB-SCR-4PK",
    category: "Climbing Gear",
    brand: "Rope4",
    price: 2400,
    compareAtPrice: 2800,
    stockQuantity: 50,
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    ],
    shortDescription: "Keylock nose preventing snagging, 25kN major axis strength for anchor building.",
  },
];

export default function GearStorePage() {
  const [products, setProducts] = useState<any[]>(DEFAULT_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("featured");

  const { addItem } = useCart();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    publicApiClient
      .get("/public/products")
      .then((res) => {
        if (isMounted && res.data?.data?.items && res.data.data.items.length > 0) {
          setProducts(res.data.data.items);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== "All") {
          if (p.category?.toLowerCase() !== selectedCategory.toLowerCase())
            return false;
        }

        if (search.trim()) {
          const q = search.toLowerCase();
          const matchesTitle = p.title?.toLowerCase().includes(q);
          const matchesSku = p.sku?.toLowerCase().includes(q);
          const matchesBrand = p.brand?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesSku && !matchesBrand) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "price_asc") return (a.price || 0) - (b.price || 0);
        if (sortOption === "price_desc") return (b.price || 0) - (a.price || 0);
        return 0;
      });
  }, [products, selectedCategory, search, sortOption]);

  const handleAddToCart = (product: any) => {
    if (product.stockQuantity <= 0) {
      toast.error("This product is currently out of stock");
      return;
    }

    addItem({
      productId: product._id,
      title: product.title,
      sku: product.sku,
      price: product.price,
      image: product.images?.[0],
      maxStock: product.stockQuantity,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white border border-emerald-800 shadow-xl space-y-3">
        <Badge variant="nature" className="bg-emerald-800 text-white font-bold">
          Official Rope4 Gear Store
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Field-Tested Mountain Equipment
        </h1>
        <p className="text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
          High-performance backpacks, UIAA certified climbing ropes, technical waterproof apparel, and expedition accessories.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search gear..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 pr-3 rounded-xl border border-input bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary w-44 sm:w-56"
            />
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="h-9 px-3 rounded-xl border border-input bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const isOutOfStock = prod.stockQuantity <= 0;
            const thumb =
              prod.images?.[0] ||
              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={prod._id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail */}
                  <Link
                    href={`/store/${prod.slug || prod._id}`}
                    className="block relative h-56 bg-muted overflow-hidden"
                  >
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${thumb})` }}
                    />

                    {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
                        Sale
                      </span>
                    )}

                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <Badge variant="destructive" className="font-bold">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </Link>

                  {/* Body Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                      <span>{prod.brand || "Rope4"}</span>
                      <span>{prod.sku}</span>
                    </div>

                    <Link
                      href={`/store/${prod.slug || prod._id}`}
                      className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 block leading-snug"
                    >
                      {prod.title}
                    </Link>

                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-foreground">
                        {prod.price?.toLocaleString()} BDT
                      </span>
                      {prod.compareAtPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {prod.compareAtPrice.toLocaleString()} BDT
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 pt-0">
                  <Button
                    onClick={() => handleAddToCart(prod)}
                    disabled={isOutOfStock}
                    size="sm"
                    className="w-full gap-1.5 font-bold"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isOutOfStock ? "Sold Out" : "Add to Cart"}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3 bg-muted/20 border rounded-2xl p-8">
          <Package className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="font-bold text-lg">No gear items found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Try choosing a different category or clearing your search keywords.
          </p>
          <Button
            onClick={() => {
              setSelectedCategory("All");
              setSearch("");
            }}
            variant="outline"
            size="sm"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

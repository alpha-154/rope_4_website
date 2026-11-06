"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeItem,
    subtotal,
    totalUnits,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background border-l border-border shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-foreground">
                  Your Gear Cart
                </h2>
                <p className="text-xs text-muted-foreground">
                  {totalUnits} {totalUnits === 1 ? "item" : "items"} selected
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                    Browse our official alpine packs, climbing ropes, jackets, and outdoor accessories.
                  </p>
                </div>
                <Button
                  onClick={() => setIsDrawerOpen(false)}
                  asChild
                  variant="outline"
                  size="sm"
                >
                  <Link href="/store">Explore Gear Store</Link>
                </Button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-3.5 p-3.5 rounded-xl border border-border bg-card shadow-sm hover:border-primary/30 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="h-20 w-20 rounded-lg bg-muted border overflow-hidden shrink-0">
                    {item.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground truncate">
                        {item.title}
                      </h4>
                      <div className="text-xs text-muted-foreground font-mono">
                        {item.sku}
                        {item.variant?.size ? ` • Size: ${item.variant.size}` : ""}
                        {item.variant?.color ? ` • Color: ${item.variant.color}` : ""}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border rounded-lg overflow-hidden bg-muted/40">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              `${item.productId}_${item.variant?.size || ""}_${item.variant?.color || ""}`
                            )
                          }
                          className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:bg-muted"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              `${item.productId}_${item.variant?.size || ""}_${item.variant?.color || ""}`
                            )
                          }
                          className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:bg-muted"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-sm text-foreground">
                          {((item.price || 0) * item.quantity).toLocaleString()}{" "}
                          BDT
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={() =>
                      removeItem(
                        item.productId,
                        `${item.productId}_${item.variant?.size || ""}_${item.variant?.color || ""}`
                      )
                    }
                    className="text-muted-foreground hover:text-destructive p-1 self-start"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-card space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-foreground text-sm">
                    {subtotal.toLocaleString()} BDT
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping:</span>
                  <span>{subtotal >= 5000 ? "Free Shipping" : "120 BDT"}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold text-base text-foreground">
                  <span>Total Due:</span>
                  <span className="text-primary font-mono">
                    {(subtotal + (subtotal >= 5000 ? 0 : 120)).toLocaleString()}{" "}
                    BDT
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  asChild
                  size="lg"
                  className="w-full gap-2 text-sm font-bold shadow-lg"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <Link href="/checkout">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground py-1"
                >
                  Continue Shopping
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Cash on delivery & verified payment protection</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

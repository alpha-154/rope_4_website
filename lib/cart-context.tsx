"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface CartItem {
  productId: string;
  title: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: { size?: string; color?: string };
  maxStock?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantKey?: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalUnits: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "rope4_cart_items";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Ignore storage errors
      }
    }
  }, [items, isLoaded]);

  const getItemKey = (productId: string, variant?: { size?: string; color?: string }) => {
    return `${productId}_${variant?.size || ""}_${variant?.color || ""}`;
  };

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const key = getItemKey(item.productId, item.variant);
      const existingIndex = prev.findIndex(
        (it) => getItemKey(it.productId, it.variant) === key
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        const max = item.maxStock || 999;
        updated[existingIndex].quantity = Math.min(newQty, max);
        return updated;
      } else {
        return [...prev, { ...item, quantity: Math.max(1, quantity) }];
      }
    });

    toast.success(`Added ${item.title} to cart`);
    setIsDrawerOpen(true);
  };

  const removeItem = (productId: string, variantKey?: string) => {
    setItems((prev) =>
      prev.filter((it) => {
        const key = getItemKey(it.productId, it.variant);
        return variantKey ? key !== variantKey : it.productId !== productId;
      })
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    variantKey?: string
  ) => {
    if (quantity <= 0) {
      removeItem(productId, variantKey);
      return;
    }

    setItems((prev) =>
      prev.map((it) => {
        const key = getItemKey(it.productId, it.variant);
        const matches = variantKey ? key === variantKey : it.productId === productId;
        if (matches) {
          const max = it.maxStock || 999;
          return { ...it, quantity: Math.min(quantity, max) };
        }
        return it;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce(
    (acc, it) => acc + (it.price || 0) * (it.quantity || 1),
    0
  );

  const totalUnits = items.reduce((acc, it) => acc + (it.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        totalUnits,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}


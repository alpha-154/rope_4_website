"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { publicApiClient } from "./axios";
import { toast } from "sonner";

export interface CustomerProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  shippingAddresses: Array<{
    id: string;
    label: string;
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
  wishlist: string[];
  totalOrders: number;
  totalSpent: number;
}

interface CustomerAuthContextType {
  customer: CustomerProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<CustomerProfile>) => Promise<boolean>;
  toggleWishlist: (itemId: string) => Promise<boolean>;
  isWishlisted: (itemId: string) => boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(
  undefined
);

const TOKEN_KEY = "customerToken";
const CUSTOMER_KEY = "customerProfile";

export function CustomerAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedProfile = localStorage.getItem(CUSTOMER_KEY);
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedProfile) {
        setCustomer(JSON.parse(storedProfile));
      }

      // Fetch fresh profile if token exists
      if (storedToken) {
        publicApiClient
          .get("/public/customer/me")
          .then((res) => {
            if (res.data?.data) {
              setCustomer(res.data.data);
              localStorage.setItem(CUSTOMER_KEY, JSON.stringify(res.data.data));
            }
          })
          .catch(() => {
            // Token expired or invalid
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(CUSTOMER_KEY);
            setToken(null);
            setCustomer(null);
          });
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await publicApiClient.post("/public/customer/login", {
        email,
        password,
      });

      const { token: receivedToken, customer: profile } = res.data?.data || {};
      if (receivedToken) {
        localStorage.setItem(TOKEN_KEY, receivedToken);
        localStorage.setItem(CUSTOMER_KEY, JSON.stringify(profile));
        setToken(receivedToken);
        setCustomer(profile);
        toast.success(`Welcome back, ${profile.firstName || "Traveler"}!`);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
      return false;
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      const res = await publicApiClient.post("/public/customer/register", data);
      const { token: receivedToken, customer: profile } = res.data?.data || {};
      if (receivedToken) {
        localStorage.setItem(TOKEN_KEY, receivedToken);
        localStorage.setItem(CUSTOMER_KEY, JSON.stringify(profile));
        setToken(receivedToken);
        setCustomer(profile);
        toast.success(
          `Account created! Welcome to Rope4, ${profile.firstName}!`
        );
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Registration failed. Email might already be registered."
      );
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_KEY);
    setToken(null);
    setCustomer(null);
    toast.info("Logged out successfully");
  };

  const updateProfile = async (
    data: Partial<CustomerProfile>
  ): Promise<boolean> => {
    try {
      const res = await publicApiClient.patch("/public/customer/profile", data);
      if (res.data?.data) {
        setCustomer(res.data.data);
        localStorage.setItem(CUSTOMER_KEY, JSON.stringify(res.data.data));
        toast.success("Profile updated successfully");
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
      return false;
    }
  };

  const toggleWishlist = async (itemId: string): Promise<boolean> => {
    if (!token) {
      toast.info("Please sign in to save items to your traveler account");
      return false;
    }

    try {
      const res = await publicApiClient.post(
        "/public/customer/wishlist/toggle",
        { itemId }
      );
      const updatedWishlist = res.data?.data?.wishlist || [];
      if (customer) {
        const updated = { ...customer, wishlist: updatedWishlist };
        setCustomer(updated);
        localStorage.setItem(CUSTOMER_KEY, JSON.stringify(updated));
      }
      return true;
    } catch {
      return false;
    }
  };

  const isWishlisted = (itemId: string): boolean => {
    return Boolean(
      customer?.wishlist?.some(
        (id: any) => id === itemId || id?._id === itemId || id?.toString?.() === itemId
      )
    );
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error(
      "useCustomerAuth must be used within a CustomerAuthProvider"
    );
  }
  return context;
}

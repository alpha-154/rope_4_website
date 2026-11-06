"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package,
  ArrowLeft,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCustomerAuth } from "@/lib/customer-auth-context";
import { publicApiClient } from "@/lib/axios";
import { toast } from "sonner";

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: { size?: string; color?: string };
}

interface Order {
  _id: string;
  orderNumber: string;
  orderStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "REFUNDED" | "FAILED";
  paymentMethod: string;
  totalAmount: number;
  shippingFee: number;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  createdAt: string;
}

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useCustomerAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/customer/login?redirect=/customer/orders");
      return;
    }

    if (isAuthenticated) {
      publicApiClient
        .get("/public/customer/orders")
        .then((res) => {
          setOrders(res.data?.data || []);
        })
        .catch((err) => {
          console.error("Failed to load customer orders:", err);
          // Fallback demo order if backend offline or freshly registered
          setOrders([]);
        })
        .finally(() => setLoading(false));
    }
  }, [authLoading, isAuthenticated, router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "SHIPPED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CONFIRMED":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/customer/profile" className="hover:text-forest-800 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Account Profile
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Orders</span>
          </div>

          <Link
            href="/store"
            className="text-xs font-semibold text-forest-800 hover:underline flex items-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Back to Store
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Gear Orders & Tracking
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Monitor inventory dispatch, tracking numbers, and delivery status.
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-bold uppercase tracking-wider bg-forest-800 text-white px-3 py-1 rounded-full">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-sm text-gray-600 mb-6">
              When you purchase expedition equipment or apparel from our store, your order tracking history will be recorded here.
            </p>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest-800 text-white text-sm font-semibold rounded-xl hover:bg-forest-900 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Gear Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order._id;
              const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition-all"
                >
                  {/* Order Card Header */}
                  <div
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-base font-mono font-bold text-gray-900">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Placed on {dateStr} • {order.items?.length || 0} item
                          {(order.items?.length || 0) > 1 ? "s" : ""} • Payment: {order.paymentMethod}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total</p>
                        <p className="text-lg font-bold text-forest-800">
                          ৳{(order.totalAmount || 0).toLocaleString()}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Order Accordion Details */}
                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-stone-100 bg-stone-50/30">
                      {order.trackingNumber && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-xs text-blue-800">
                          <Truck className="w-4 h-4 text-blue-600" />
                          <span>
                            Courier Tracking Number: <strong className="font-mono">{order.trackingNumber}</strong>
                          </span>
                        </div>
                      )}

                      <div className="divide-y divide-stone-100">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="py-3 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-stone-100 relative overflow-hidden flex-shrink-0 border border-stone-200">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                                    <ShoppingBag className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                                <p className="text-xs text-gray-500">
                                  {item.variant?.size ? `Size: ${item.variant.size} • ` : ""}
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              ৳{(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address snippet */}
                      {order.shippingAddress && (
                        <div className="mt-4 pt-4 border-t border-stone-100 text-xs text-gray-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-medium text-gray-900">Delivery Destination: </span>
                            {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                            {order.shippingAddress.postalCode}
                          </div>
                          <span className="text-[11px] text-gray-400">
                            Payment Status: <strong className="text-gray-700">{order.paymentStatus}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

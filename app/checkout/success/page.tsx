"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Copy,
  Check,
  PackageCheck,
  ArrowRight,
  Compass,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "R4-" + Math.floor(100000 + Math.random() * 900000);
  const [copied, setCopied] = useState(false);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    toast.success("Order number copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-6 shadow-inner animate-in zoom-in-50 duration-300">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
        Order Confirmed
      </span>

      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-4 mb-3">
        Thank You for Your Order!
      </h1>
      <p className="text-gray-600 max-w-lg mx-auto text-base">
        Your gear has been reserved from our inventory. We have sent an order summary and dispatch schedule to your email.
      </p>

      {/* Order Reference Box */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 my-8 max-w-md mx-auto shadow-sm flex items-center justify-between">
        <div className="text-left">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Order Reference</p>
          <p className="text-xl font-mono font-bold text-gray-900 mt-0.5">{orderNumber}</p>
        </div>
        <button
          onClick={copyOrderNumber}
          className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-gray-600 transition-colors flex items-center gap-1.5 text-xs font-medium"
          title="Copy Order Number"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Fulfillment Pipeline Steps */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 my-8 text-left max-w-xl mx-auto">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Clock className="w-4 h-4 text-forest-700" />
          Fulfillment Timeline
        </h3>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200 before:z-0">
          <div className="relative flex items-start gap-4 z-10">
            <div className="w-7 h-7 rounded-full bg-forest-800 text-white flex items-center justify-center font-bold text-xs ring-4 ring-stone-50">
              ✓
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Order Received & Stock Reserved</p>
              <p className="text-xs text-gray-500">Atomic inventory decrement completed in warehouse database.</p>
            </div>
          </div>

          <div className="relative flex items-start gap-4 z-10">
            <div className="w-7 h-7 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-xs ring-4 ring-stone-50">
              2
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Quality Inspection & Packaging</p>
              <p className="text-xs text-gray-500">Gear is inspected for defects and packed in weather-resistant seals.</p>
            </div>
          </div>

          <div className="relative flex items-start gap-4 z-10">
            <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs ring-4 ring-stone-50">
              3
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Courier Handover & Tracking</p>
              <p className="text-xs text-stone-400">Handed to courier with live SMS tracking updates to your phone.</p>
            </div>
          </div>

          <div className="relative flex items-start gap-4 z-10">
            <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs ring-4 ring-stone-50">
              4
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Doorstep Arrival</p>
              <p className="text-xs text-stone-400">Delivered within 24-72 hours. Inspect before final handover.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/customer/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-forest-800 text-white font-medium rounded-xl hover:bg-forest-900 transition-colors shadow-sm"
        >
          <PackageCheck className="w-4 h-4" />
          Track Order History
        </Link>
        <Link
          href="/store"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-stone-300 text-gray-700 font-medium rounded-xl hover:bg-stone-50 transition-colors shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </Link>
        <Link
          href="/programs"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-forest-50 text-forest-900 border border-forest-200 font-medium rounded-xl hover:bg-forest-100 transition-colors"
        >
          <Compass className="w-4 h-4" />
          Explore Treks
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-stone-50/50 min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}


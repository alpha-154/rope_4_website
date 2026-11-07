"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useCustomerAuth } from "@/lib/customer-auth-context";
import { publicApiClient } from "@/lib/axios";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { customer, isAuthenticated } = useCustomerAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const shippingFee = shippingMethod === "express" ? 200 : 120;
  const grandTotal = subtotal + (items.length > 0 ? shippingFee : 0);

  // Form states
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    street: "",
    city: "Dhaka",
    state: "Dhaka Division",
    postalCode: "1205",
    country: "Bangladesh",
    paymentMethod: "COD",
    customerNotes: "",
  });

  // Prefill when customer is logged in
  useEffect(() => {
    if (customer) {
      const defaultAddr = customer.shippingAddresses?.find((a) => a.isDefault) || customer.shippingAddresses?.[0];
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || `${customer.firstName} ${customer.lastName}`.trim(),
        customerEmail: prev.customerEmail || customer.email || "",
        customerPhone: prev.customerPhone || customer.phone || "",
        street: prev.street || defaultAddr?.street || "",
        city: prev.city || defaultAddr?.city || "Dhaka",
        state: prev.state || defaultAddr?.state || "Dhaka Division",
        postalCode: prev.postalCode || defaultAddr?.postalCode || "1205",
        country: prev.country || defaultAddr?.country || "Bangladesh",
      }));
    }
  }, [customer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.");
      return;
    }

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      toast.error("Please fill in your contact information.");
      return;
    }

    if (!formData.street || !formData.city || !formData.postalCode) {
      toast.error("Please provide a valid shipping address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
        shippingAddress: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim() || undefined,
          postalCode: formData.postalCode.trim(),
          country: formData.country.trim() || "Bangladesh",
        },
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          variant: it.variant,
        })),
        paymentMethod: formData.paymentMethod,
        customerNotes: formData.customerNotes.trim() || undefined,
      };

      const res = await publicApiClient.post("/public/checkout", payload);
      const order = res.data?.data;
      const orderNumber = order?.orderNumber || `R4-${Date.now().toString().slice(-6)}`;

      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/checkout/success?orderNumber=${encodeURIComponent(orderNumber)}`);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to place order. Some items may be out of stock. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-forest-900/10 flex items-center justify-center text-forest-800 mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-gray-600 max-w-md mb-8">
          Looks like you haven&apos;t added any mountain-grade equipment or apparel yet.
          Explore our certified gear catalog to prepare for your next adventure.
        </p>
        <Link
          href="/store"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-forest-800 text-white font-medium rounded-xl hover:bg-forest-900 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Gear Store
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/store" className="hover:text-forest-800 transition-colors">
            Gear Store
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Checkout</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
          Checkout & Dispatch
        </h1>
        <p className="text-gray-600 mb-8">
          Complete your order with verified stock reservation and tracked nationwide delivery.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Information & Address & Payment */}
            <div className="lg:col-span-7 space-y-8">
              {/* Customer Contact */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-forest-800 text-white text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    Contact Information
                  </h2>
                  {!isAuthenticated && (
                    <Link
                      href="/customer/login?redirect=/checkout"
                      className="text-xs font-semibold text-forest-700 hover:text-forest-800 hover:underline"
                    >
                      Already have an account? Sign in
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="e.g. Shakib Al Hasan"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      required
                      value={formData.customerEmail}
                      onChange={handleChange}
                      placeholder="adventurer@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Order confirmation & tracking sent here</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-1">
                      Mobile Phone *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      required
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="+880 1711 000000"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">For delivery updates & courier call</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-forest-800 text-white text-xs flex items-center justify-center font-bold">
                      2
                    </span>
                    Shipping Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-1">
                      Street Address / House / Flat *
                    </label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="e.g. Flat 4B, House 24, Road 11, Banani"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Dhaka, Chittagong, Sylhet"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-1">
                      Division / State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Dhaka Division"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-1">
                      Postal / ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="e.g. 1213"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      readOnly
                      value={formData.country}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-gray-600 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Delivery Speed Options */}
                <div className="mt-6 pt-6 border-t border-stone-100">
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-3">
                    Shipping Option
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition-all ${
                        shippingMethod === "standard"
                          ? "border-forest-800 bg-forest-50/50"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingOption"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="mt-1 text-forest-800 focus:ring-forest-800"
                      />
                      <div className="ml-3">
                        <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                          <span>Standard Courier</span>
                          <span className="text-forest-800">৳120</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">2-4 business days nationwide</p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition-all ${
                        shippingMethod === "express"
                          ? "border-forest-800 bg-forest-50/50"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingOption"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="mt-1 text-forest-800 focus:ring-forest-800"
                      />
                      <div className="ml-3">
                        <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                          <span>Express / Dhaka Same-Day</span>
                          <span className="text-forest-800">৳200</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">24 hours within Dhaka metro</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-forest-800 text-white text-xs flex items-center justify-center font-bold">
                      3
                    </span>
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "COD",
                      title: "Cash on Delivery (COD)",
                      desc: "Pay in cash to courier agent when your package arrives at your doorstep.",
                      icon: Banknote,
                    },
                    {
                      id: "BKASH",
                      title: "bKash / Nagad Mobile Wallet",
                      desc: "Instant mobile payment via merchant number after placing the order.",
                      icon: Smartphone,
                    },
                    {
                      id: "CARD",
                      title: "Credit or Debit Card",
                      desc: "Visa, Mastercard, or AMEX processed through secured payment gateway.",
                      icon: CreditCard,
                    },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = formData.paymentMethod === method.id;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-start p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-forest-800 bg-forest-50/40"
                            : "border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={isSelected}
                          onChange={handleChange}
                          className="mt-1 text-forest-800 focus:ring-forest-800"
                        />
                        <div className="ml-3.5 flex-1">
                          <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
                            <Icon className="w-4 h-4 text-forest-800" />
                            {method.title}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-1">
                    Special Delivery Notes / Instructions (Optional)
                  </label>
                  <textarea
                    name="customerNotes"
                    rows={2}
                    value={formData.customerNotes}
                    onChange={handleChange}
                    placeholder="e.g. Leave with building security if unavailable, please call beforehand."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Confirmation CTA */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200 sticky top-24">
                <h3 className="text-xl font-semibold text-gray-900 pb-4 border-b border-stone-100 mb-6">
                  Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
                </h3>

                {/* Items preview list */}
                <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1 mb-6">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variant?.size || ""}`} className="py-3.5 flex gap-3">
                      <div className="relative w-14 h-14 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                        <span className="absolute -top-1 -right-1 bg-forest-800 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {item.title}
                        </h4>
                        {item.variant && (item.variant.size || item.variant.color) && (
                          <p className="text-xs text-gray-500">
                            {[item.variant.size, item.variant.color].filter(Boolean).join(" • ")}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-0.5">
                          ৳{item.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-bold text-gray-900 text-right">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Calculation */}
                <div className="space-y-2.5 pt-4 border-t border-stone-100 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Fee</span>
                    <span className="font-medium text-gray-900">৳{shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-stone-100">
                    <span>Total Amount</span>
                    <span className="text-forest-800 text-lg">৳{grandTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Includes all local taxes and packaging fees.</p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 py-4 px-6 bg-forest-800 text-white rounded-xl font-semibold hover:bg-forest-900 focus:outline-none focus:ring-4 focus:ring-forest-800/20 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Reserving Stock & Placing Order...
                    </>
                  ) : (
                    <>
                      <PackageCheck className="w-5 h-5" />
                      Place Order (৳{grandTotal.toLocaleString()})
                    </>
                  )}
                </button>

                {/* Trust Guarantees */}
                <div className="mt-6 pt-6 border-t border-stone-100 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-forest-700 flex-shrink-0" />
                    <span>100% Genuine, expedition-tested outdoor gear</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-600">
                    <Truck className="w-4 h-4 text-forest-700 flex-shrink-0" />
                    <span>Real-time courier dispatch with SMS updates</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-forest-700 flex-shrink-0" />
                    <span>7-day easy size exchange guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


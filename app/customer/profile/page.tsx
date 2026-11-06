"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  ShoppingBag,
  Package,
  LogOut,
  Edit2,
  Plus,
  Trash2,
  CheckCircle,
  Compass,
} from "lucide-react";
import { useCustomerAuth, CustomerProfile } from "@/lib/customer-auth-context";
import { toast } from "sonner";

export default function CustomerProfilePage() {
  const router = useRouter();
  const { customer, isAuthenticated, isLoading, logout, updateProfile } = useCustomerAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "wishlist">("profile");

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  // Address Add State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    street: "",
    city: "Dhaka",
    state: "Dhaka Division",
    postalCode: "1205",
    country: "Bangladesh",
    isDefault: false,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/customer/login?redirect=/customer/profile");
    }
    if (customer) {
      setProfileForm({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        phone: customer.phone || "",
      });
    }
  }, [customer, isAuthenticated, isLoading, router]);

  if (isLoading || !customer) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.firstName || !profileForm.lastName) {
      toast.error("First and last name cannot be empty.");
      return;
    }

    const ok = await updateProfile({
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim(),
      phone: profileForm.phone.trim(),
    });

    if (ok) {
      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.street || !addressForm.city || !addressForm.postalCode) {
      toast.error("Please fill in street, city, and postal code.");
      return;
    }

    const newAddr = {
      id: "addr-" + Date.now(),
      label: addressForm.label,
      street: addressForm.street.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim() || undefined,
      postalCode: addressForm.postalCode.trim(),
      country: addressForm.country.trim() || "Bangladesh",
      isDefault: addressForm.isDefault || (customer.shippingAddresses?.length === 0),
    };

    const existingAddresses = customer.shippingAddresses || [];
    const updated = addressForm.isDefault
      ? existingAddresses.map((a) => ({ ...a, isDefault: false })).concat(newAddr)
      : [...existingAddresses, newAddr];

    const ok = await updateProfile({ shippingAddresses: updated });
    if (ok) {
      toast.success("Shipping address added!");
      setIsAddingAddress(false);
      setAddressForm({
        label: "Home",
        street: "",
        city: "Dhaka",
        state: "Dhaka Division",
        postalCode: "1205",
        country: "Bangladesh",
        isDefault: false,
      });
    }
  };

  const handleDeleteAddress = async (addrId: string) => {
    const updated = (customer.shippingAddresses || []).filter((a) => a.id !== addrId);
    const ok = await updateProfile({ shippingAddresses: updated });
    if (ok) {
      toast.success("Address removed.");
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-forest-800 text-white flex items-center justify-center font-bold font-serif text-2xl shadow-sm">
              {customer.firstName?.[0]}
              {customer.lastName?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                  {customer.firstName} {customer.lastName}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-forest-50 text-forest-800 px-2.5 py-0.5 rounded-full border border-forest-200">
                  Verified Member
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {customer.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/customer/orders"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-50 text-forest-900 border border-forest-200 rounded-xl text-sm font-medium hover:bg-forest-100 transition-colors"
            >
              <Package className="w-4 h-4 text-forest-700" />
              Order History ({customer.totalOrders || 0})
            </Link>

            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 text-stone-700 rounded-xl text-sm font-medium hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-stone-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3.5 px-3 font-medium text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "profile"
                ? "border-forest-800 text-forest-800 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <User className="w-4 h-4" />
            Profile Details
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`pb-3.5 px-3 font-medium text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "addresses"
                ? "border-forest-800 text-forest-800 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <MapPin className="w-4 h-4" />
            Shipping Addresses ({customer.shippingAddresses?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`pb-3.5 px-3 font-medium text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "wishlist"
                ? "border-forest-800 text-forest-800 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Heart className="w-4 h-4" />
            Saved Wishlist ({customer.wishlist?.length || 0})
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <p className="text-xs text-gray-500">Your registered identity details for expedition logistics.</p>
              </div>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-forest-800 bg-forest-50 border border-forest-200 rounded-lg hover:bg-forest-100 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+880 1711 000000"
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-forest-800 text-white rounded-xl text-sm font-semibold hover:bg-forest-900 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-5 py-2 bg-stone-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-stone-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Full Name</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    {customer.firstName} {customer.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Email Address</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">{customer.email}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Phone</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    {customer.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Total Gear Spend</p>
                  <p className="text-base font-semibold text-forest-800 mt-1">
                    ৳{(customer.totalSpent || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Shipping Addresses */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Registered Addresses</h3>
                <p className="text-xs text-gray-500">Fast checkout addresses used for courier gear delivery.</p>
              </div>
              {!isAddingAddress && (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-forest-800 text-white text-xs font-semibold rounded-xl hover:bg-forest-900 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Address
                </button>
              )}
            </div>

            {isAddingAddress && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                  New Shipping Destination
                </h4>
                <form onSubmit={handleAddAddress} className="space-y-4 max-w-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                        Address Label
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.label}
                        onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                        placeholder="Home / Office / Basecamp"
                        className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                        City / District
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                      Street / Flat / House *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      placeholder="e.g. House 14, Road 5, Block C, Bashundhara"
                      className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.postalCode}
                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={addressForm.country}
                        className="w-full px-4 py-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-600 text-sm"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      className="rounded border-stone-300 text-forest-800 focus:ring-forest-800"
                    />
                    <span className="text-xs text-gray-700 font-medium">
                      Set as default checkout address
                    </span>
                  </label>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-forest-800 text-white rounded-xl text-sm font-semibold hover:bg-forest-900 transition-colors"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-5 py-2 bg-stone-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-stone-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.shippingAddresses?.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                        {addr.label || "Home"}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-2">{addr.street}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {addr.city}, {addr.state ? `${addr.state}, ` : ""}{addr.postalCode}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{addr.country}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-xs text-stone-400 hover:text-red-600 transition-colors inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}

              {(!customer.shippingAddresses || customer.shippingAddresses.length === 0) && (
                <div className="col-span-2 bg-white rounded-2xl p-8 border border-stone-200 text-center">
                  <MapPin className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">No shipping addresses saved yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Add your home or office address for 1-click checkout.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === "wishlist" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Saved Wishlist</h3>
            <p className="text-xs text-gray-500 mb-6">
              Keep track of expeditions and equipment you want to explore later.
            </p>

            {customer.wishlist?.length > 0 ? (
              <div>
                <p className="text-sm text-gray-700 mb-4">
                  You have <span className="font-bold text-forest-800">{customer.wishlist.length}</span> saved items in your wishlist.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/programs"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-800 text-white rounded-xl text-sm font-medium hover:bg-forest-900 transition-colors shadow-sm"
                  >
                    <Compass className="w-4 h-4" /> Browse Treks
                  </Link>
                  <Link
                    href="/store"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 text-stone-800 rounded-xl text-sm font-medium hover:bg-stone-200 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" /> Visit Gear Store
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">Your wishlist is currently empty</p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Click the heart icon on any program or gear item to save it here for later.
                </p>
                <Link
                  href="/programs"
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-forest-800 text-white rounded-xl text-sm font-medium hover:bg-forest-900 transition-colors shadow-sm"
                >
                  <Compass className="w-4 h-4" /> Explore Programs
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Compass, ArrowRight, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useCustomerAuth } from "@/lib/customer-auth-context";
import { toast } from "sonner";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/customer/profile";

  const { login, isAuthenticated, isLoading } = useCustomerAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isLoading, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        toast.success("Welcome back to Rope4!");
        router.push(redirectUrl);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-forest-800 text-white mx-auto flex items-center justify-center mb-4 shadow-md">
          <Compass className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Sign In to Rope4
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Manage your expedition bookings, track gear orders, and access saved wishlists.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adventurer@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Password
              </label>
              <Link
                href="/contact"
                className="text-xs text-forest-700 hover:text-forest-900 hover:underline"
              >
                Need help?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-forest-800 text-white rounded-xl font-semibold hover:bg-forest-900 focus:outline-none focus:ring-4 focus:ring-forest-800/20 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 mt-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account yet?{" "}
            <Link
              href={`/customer/register?redirect=${encodeURIComponent(redirectUrl)}`}
              className="font-semibold text-forest-800 hover:underline inline-flex items-center gap-1"
            >
              Create Account <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <div className="bg-stone-50 min-h-[85vh] flex items-center justify-center">
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}

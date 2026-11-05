"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Mountain, Search, Menu, X, ChevronDown, User, Heart, ShoppingBag } from "lucide-react";
import { publicApiClient } from "@/lib/axios";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adventuresOpen, setAdventuresOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    publicApiClient
      .get("/public/settings/navigation")
      .then((res) => {
        if (isMounted && res.data?.data) {
          setSettings(res.data.data);
        }
      })
      .catch(() => {
        // Graceful fallback to static defaults if backend offline
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const header = settings?.header;
  const showAnnouncement = header?.announcementBar?.enabled ?? true;
  const announcementText =
    header?.announcementBar?.text || "🌲 Outdoor Education & Wilderness Safety Certified";
  const hotlinePhone = header?.quickContact?.phone || "+880 1700-000000";
  const hotlineEmail = header?.quickContact?.email || "contact@rope4.org";
  const brandName = header?.brandName || "Rope4";
  const ctaLabel = header?.ctaButton?.label || "Customer Login";
  const ctaLink = header?.ctaButton?.link || "/customer/login";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border transition-all">
      {/* Top micro bar for announcements & contact */}
      {showAnnouncement && (
        <div className="bg-primary text-primary-foreground text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>{announcementText}</span>
            {header?.announcementBar?.linkUrl && (
              <>
                <span className="hidden md:inline">|</span>
                <Link
                  href={header.announcementBar.linkUrl}
                  className="hidden md:inline underline hover:text-white/80"
                >
                  {header.announcementBar.linkText || "Learn More"}
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${hotlinePhone.replace(/\s+/g, "")}`} className="hover:underline">
              {hotlinePhone}
            </a>
            <span className="hidden sm:inline">{hotlineEmail}</span>
          </div>
        </div>
      )}

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-11 w-11 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md group-hover:scale-105 transition-transform overflow-hidden">
            {header?.logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={header.logoUrl}
                alt={brandName}
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <Mountain className="h-6 w-6" />
            )}
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight text-primary flex items-center gap-1">
              {brandName}
            </div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Outdoor Education
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links & Mega-menu trigger */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {/* Mega Menu Dropdown */}
          <div className="relative group">
            <button
              onClick={() => setAdventuresOpen(!adventuresOpen)}
              className="flex items-center gap-1.5 py-2 text-foreground hover:text-primary transition-colors font-semibold"
            >
              <span>Choose Trek / Adventure</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block w-72 p-3 bg-white rounded-xl shadow-xl border border-border">
              <Link
                href="/programs?category=Premium+Trip"
                className="block p-2.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                <div className="font-semibold text-foreground">Premium Treks</div>
                <div className="text-xs text-muted-foreground">High-altitude iconic expeditions</div>
              </Link>
              <Link
                href="/programs?category=Summer+Camp"
                className="block p-2.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                <div className="font-semibold text-foreground">Youth Summer Camps</div>
                <div className="text-xs text-muted-foreground">Wilderness survival & scout skills</div>
              </Link>
              <Link
                href="/programs?category=Family+Treks"
                className="block p-2.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                <div className="font-semibold text-foreground">Family With Kids</div>
                <div className="text-xs text-muted-foreground">Scenic, safe & guided trails</div>
              </Link>
              <Link
                href="/programs?category=Learning+Program"
                className="block p-2.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                <div className="font-semibold text-foreground">Outdoor Education Courses</div>
                <div className="text-xs text-muted-foreground">Certified mountaineering instruction</div>
              </Link>
            </div>
          </div>

          {header?.navItems && header.navItems.length > 0 ? (
            header.navItems.map((item: any, idx: number) => (
              <Link
                key={idx}
                href={item.href || "#"}
                className="hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-primary/10 text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))
          ) : (
            <>
              <Link href="/programs" className="hover:text-primary transition-colors">
                All Programs
              </Link>
              <Link href="/store" className="hover:text-primary transition-colors">
                Gear Store
              </Link>
              <Link href="/news" className="hover:text-primary transition-colors">
                Stay Informed
              </Link>
              <Link href="/faqs" className="hover:text-primary transition-colors">
                FAQs
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact Us
              </Link>
            </>
          )}
        </nav>

        {/* Right Action Icons & CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/programs"
            className="p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Search adventures"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/customer/profile"
            className="p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className="p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
            title="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
          </Link>
          <Link
            href={ctaLink}
            className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <User className="h-4 w-4" />
            <span>{ctaLabel}</span>
          </Link>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-muted text-foreground"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border px-4 pt-3 pb-6 space-y-3">
          {header?.navItems && header.navItems.length > 0 ? (
            header.navItems.map((item: any, idx: number) => (
              <Link
                key={idx}
                href={item.href || "#"}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              >
                {item.label}
              </Link>
            ))
          ) : (
            <>
              <Link
                href="/programs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              >
                All Programs
              </Link>
              <Link
                href="/store"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              >
                Gear Store
              </Link>
              <Link
                href="/news"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              >
                Stay Informed
              </Link>
              <Link
                href="/faqs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              >
                FAQs
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              >
                Contact
              </Link>
            </>
          )}
          <div className="pt-2">
            <Link
              href={ctaLink}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm"
            >
              <User className="h-4 w-4" />
              <span>{ctaLabel}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

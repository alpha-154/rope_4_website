"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Mountain,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Heart,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useCustomerAuth } from "@/lib/customer-auth-context";
import {
  useSiteSettings,
  type NavItem,
  type NavSubItem,
} from "@/lib/site-data";

const DEFAULT_NAV: NavItem[] = [
  { label: "All Programs", href: "/programs" },
  { label: "Gear Store", href: "/store" },
  { label: "Stay Informed", href: "/news" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact Us", href: "/contact" },
];

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

function SmartLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  if (isExternal(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href || "#"} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

function SubItemLink({
  item,
  onClick,
}: {
  item: NavSubItem;
  onClick?: () => void;
}) {
  return (
    <SmartLink
      href={item.href}
      onClick={onClick}
      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors"
    >
      {item.image && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={item.image}
          alt=""
          className="h-10 w-10 rounded-md object-cover shrink-0"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      )}
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
          {item.label}
          {item.badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-primary/10 text-primary">
              {item.badge}
            </span>
          )}
        </span>
        {item.description && (
          <span className="block text-xs text-muted-foreground mt-0.5">
            {item.description}
          </span>
        )}
      </span>
    </SmartLink>
  );
}

// Render whichever sub-menu has data; the isMegaMenu flag decides when both exist.
function hasMega(item: NavItem) {
  const cats = (item.megaMenuCategories?.length ?? 0) > 0;
  const kids = (item.children?.length ?? 0) > 0;
  return cats && (!!item.isMegaMenu || !kids);
}

function hasDropdown(item: NavItem) {
  return !hasMega(item) && (item.children?.length ?? 0) > 0;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenIdx, setMobileOpenIdx] = useState<number | null>(null);
  const { data: settings } = useSiteSettings();
  const { totalUnits, setIsDrawerOpen } = useCart();
  const { customer, isAuthenticated } = useCustomerAuth();

  const header = settings?.header;
  const announcement = header?.announcement;
  const showAnnouncement = settings
    ? !!announcement?.enabled && !!announcement?.text
    : true;
  const announcementText =
    announcement?.text || "🌲 Outdoor Education & Wilderness Safety Certified";
  const hotlinePhone = header?.quickContact?.phone || "+880 1700-000000";
  const hotlineEmail = header?.quickContact?.email || "contact@rope4.org";
  const brandName = header?.logoText || "Rope4";
  const tagline = header?.tagline || "Outdoor Education";
  const navItems =
    header?.navItems && header.navItems.length > 0
      ? header.navItems
      : DEFAULT_NAV;

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setMobileOpenIdx(null);
  };

  const announcementInner = (
    <span className="flex items-center gap-2">
      {announcement?.badge && (
        <span className="shrink-0 whitespace-nowrap px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
          {announcement.badge}
        </span>
      )}
      <span>{announcementText}</span>
    </span>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border transition-all">
      {/* Top micro bar for announcements & contact */}
      {showAnnouncement && (
        <div className="bg-primary text-primary-foreground text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {announcement?.linkUrl ? (
              <SmartLink
                href={announcement.linkUrl}
                className="hover:underline underline-offset-2"
              >
                {announcementInner}
              </SmartLink>
            ) : (
              announcementInner
            )}
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <a
              href={`tel:${hotlinePhone.replace(/\s+/g, "")}`}
              className="hover:underline"
            >
              {hotlinePhone}
            </a>
            <span className="hidden md:inline">{hotlineEmail}</span>
          </div>
        </div>
      )}

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group min-w-0">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md group-hover:scale-105 transition-transform overflow-hidden">
            {header?.logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={header.logoUrl}
                alt={brandName}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <Mountain className="h-6 w-6" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-lg sm:text-xl tracking-tight text-primary truncate">
              {brandName}
            </div>
            {tagline && (
              <p className="hidden sm:block text-[10px] uppercase tracking-wider text-muted-foreground font-semibold truncate max-w-[220px]">
                {tagline}
              </p>
            )}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium whitespace-nowrap">
          {navItems.map((item, idx) => {
            const mega = hasMega(item);
            const dropdown = hasDropdown(item);
            const label = (
              <>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-primary/10 text-primary">
                    {item.badge}
                  </span>
                )}
              </>
            );

            if (!mega && !dropdown) {
              return (
                <SmartLink
                  key={idx}
                  href={item.href || "#"}
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  {label}
                </SmartLink>
              );
            }

            return (
              <div key={idx} className={`group h-20 flex items-center ${mega ? "" : "relative"}`}>
                <SmartLink
                  href={item.href || "#"}
                  className="flex items-center gap-1.5 py-2 hover:text-primary transition-colors"
                >
                  {label}
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:rotate-180 transition-all" />
                </SmartLink>

                {dropdown && (
                  <div className="absolute left-0 top-full pt-2 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 z-50">
                    <div className="w-72 p-2 bg-white rounded-xl shadow-xl border border-border">
                      {item.children!.map((child, cIdx) => (
                        <SubItemLink key={cIdx} item={child} />
                      ))}
                    </div>
                  </div>
                )}

                {mega && (
                  <div className="absolute left-0 right-0 top-full pt-0 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div
                        className="grid gap-6 p-6 bg-white rounded-b-2xl shadow-2xl border border-border"
                        style={{
                          gridTemplateColumns: `repeat(${Math.min(item.megaMenuCategories!.length, 4)}, minmax(0, 1fr))`,
                        }}
                      >
                        {item.megaMenuCategories!.map((cat, cIdx) => (
                          <div key={cIdx}>
                            <p className="px-2.5 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              {cat.title}
                            </p>
                            <div className="space-y-0.5">
                              {cat.items?.map((sub, sIdx) => (
                                <SubItemLink key={sIdx} item={sub} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
            title="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalUnits > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center shadow">
                {totalUnits}
              </span>
            )}
          </button>
          <Link
            href={isAuthenticated ? "/customer/profile" : "/customer/login"}
            className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <User className="h-4 w-4" />
            <span>
              {isAuthenticated ? customer?.firstName || "Account" : "Sign In"}
            </span>
          </Link>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-muted text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border px-4 pt-3 pb-6 space-y-1 max-h-[calc(100vh-7rem)] overflow-y-auto">
          {navItems.map((item, idx) => {
            const mega = hasMega(item);
            const dropdown = hasDropdown(item);
            if (!mega && !dropdown) {
              return (
                <SmartLink
                  key={idx}
                  href={item.href || "#"}
                  onClick={closeMobile}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                >
                  {item.label}
                </SmartLink>
              );
            }
            const open = mobileOpenIdx === idx;
            return (
              <div key={idx}>
                <button
                  onClick={() => setMobileOpenIdx(open ? null : idx)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
                  aria-expanded={open}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <div className="pl-3 pb-2">
                    {dropdown &&
                      item.children!.map((child, cIdx) => (
                        <SubItemLink
                          key={cIdx}
                          item={child}
                          onClick={closeMobile}
                        />
                      ))}
                    {mega &&
                      item.megaMenuCategories!.map((cat, cIdx) => (
                        <div key={cIdx} className="pt-2">
                          <p className="px-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            {cat.title}
                          </p>
                          {cat.items?.map((sub, sIdx) => (
                            <SubItemLink
                              key={sIdx}
                              item={sub}
                              onClick={closeMobile}
                            />
                          ))}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="pt-3">
            <Link
              href={isAuthenticated ? "/customer/profile" : "/customer/login"}
              onClick={closeMobile}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm"
            >
              <User className="h-4 w-4" />
              <span>
                {isAuthenticated
                  ? `${customer?.firstName || "Traveler"}'s Profile`
                  : "Customer Sign In"}
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

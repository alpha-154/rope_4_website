"use client";

import { useQuery } from "@tanstack/react-query";
import { publicApiClient } from "@/lib/axios";

/* ---------- Site settings (public/settings/site) ---------- */

export interface NavSubItem {
  label: string;
  href: string;
  description?: string;
  badge?: string;
  image?: string;
}

export interface NavCategory {
  title: string;
  items: NavSubItem[];
}

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  isMegaMenu?: boolean;
  children?: NavSubItem[];
  megaMenuCategories?: NavCategory[];
}

export interface HeaderSettings {
  logoUrl?: string;
  logoText?: string;
  tagline?: string;
  announcement?: {
    enabled: boolean;
    text: string;
    linkUrl?: string;
    badge?: string;
  };
  quickContact?: { phone?: string; email?: string; address?: string };
  ctaButton?: { label: string; url: string; isVisible: boolean };
  navItems?: NavItem[];
}

export interface FooterBadge {
  label: string;
  imageUrl: string;
  linkUrl?: string;
}

export interface FooterSettings {
  aboutText?: string;
  copyright?: string;
  emergencyHotline?: string;
  columns?: {
    title: string;
    links: { label: string; url: string; openInNewTab?: boolean }[];
  }[];
  socialLinks?: { platform: string; url: string; icon?: string }[];
  bottomLinks?: { label: string; url: string; openInNewTab?: boolean }[];
  badges?: FooterBadge[];
}

export interface SiteSettings {
  header?: HeaderSettings;
  footer?: FooterSettings;
}

export function useSiteSettings() {
  return useQuery<SiteSettings | null>({
    queryKey: ["public", "site-settings"],
    queryFn: async () => {
      const res = await publicApiClient.get("/public/settings/site");
      return res.data?.data ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/* ---------- Organization profile (public/org/profile) ---------- */

export interface OrgProfile {
  name?: string;
  logo?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: {
    facebook?: string | null;
    instagram?: string | null;
    youtube?: string | null;
    linkedin?: string | null;
  };
}

export function useOrgProfile() {
  return useQuery<OrgProfile | null>({
    queryKey: ["public", "org-profile"],
    queryFn: async () => {
      const res = await publicApiClient.get("/public/org/profile");
      return res.data?.data ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/* ---------- Program categories (public/categories) ---------- */

export interface PublicCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  programCount: number;
  /** Category image, or the first hero image of the category's first program */
  coverImage: string;
}

export function usePublicCategories() {
  return useQuery<PublicCategory[]>({
    queryKey: ["public", "categories"],
    queryFn: async () => {
      const res = await publicApiClient.get("/public/categories");
      return res.data?.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicCategory(slug: string) {
  return useQuery<PublicCategory | null>({
    queryKey: ["public", "category", slug],
    queryFn: async () => {
      const res = await publicApiClient.get(`/public/categories/${encodeURIComponent(slug)}`);
      return res.data?.data ?? null;
    },
    enabled: !!slug,
    retry: (count, err: any) => err?.response?.status !== 404 && count < 1,
  });
}

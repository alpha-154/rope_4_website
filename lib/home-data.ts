"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { publicApiClient } from "@/lib/axios";

/* Website-side types for the admin-driven homepage sections. */

export interface HighlightItem {
  label: string;
  description?: string;
  value?: number | null;
  valueSign?: string;
  icon?: string;
}

export interface HighlightSection {
  _id: string;
  badge?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  items: HighlightItem[];
}

export interface Testimonial {
  _id: string;
  author: string;
  designation?: string;
  avatar?: string;
  rating: number;
  text: string;
  programTitle?: string;
  date?: string;
}

export interface FaqGroup {
  _id: string;
  category: string;
  faqs: { question: string; answer: string }[];
}

export interface NewsArticle {
  _id: string;
  slug: string;
  title: string;
  type?: "article" | "update" | "video";
  cover?: string;
  excerpt: string;
  content?: string;
  videoUrl?: string;
  tags?: string[];
  publishedAt?: string;
  createdAt?: string;
  seo?: { title?: string; description?: string; ogImage?: string };
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export function useHighlights() {
  return useQuery<HighlightSection[]>({
    queryKey: ["public", "highlights"],
    queryFn: async () => {
      const res = await publicApiClient.get("/public/highlights");
      return res.data?.data ?? [];
    },
  });
}

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ["public", "testimonials"],
    queryFn: async () => {
      const res = await publicApiClient.get("/public/reviews", { params: { limit: 30 } });
      return res.data?.data ?? [];
    },
  });
}

export function useFaqGroups() {
  return useQuery<FaqGroup[]>({
    queryKey: ["public", "faqs"],
    queryFn: async () => {
      const res = await publicApiClient.get("/public/faqs");
      return res.data?.data ?? [];
    },
  });
}

export function useNewsPage(page: number, limit: number) {
  return useQuery<Paged<NewsArticle>>({
    queryKey: ["public", "news", page, limit],
    queryFn: async () => {
      const res = await publicApiClient.get("/public/news", { params: { page, limit } });
      return {
        items: res.data?.data ?? [],
        total: Number(res.data?.meta?.total ?? 0),
        page,
        limit,
      };
    },
    placeholderData: keepPreviousData,
  });
}

export function useNewsArticle(slug: string) {
  return useQuery<NewsArticle | null>({
    queryKey: ["public", "news-article", slug],
    queryFn: async () => {
      const res = await publicApiClient.get(`/public/news/${encodeURIComponent(slug)}`);
      return res.data?.data ?? null;
    },
    enabled: !!slug,
    retry: (count, err: any) => err?.response?.status !== 404 && count < 1,
  });
}

/** ~200 words per minute from HTML or plain text. */
export function readingTime(text?: string) {
  const words = (text || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export const NEWS_TYPE_LABEL: Record<string, string> = {
  article: "Article",
  update: "Update",
  video: "Video Story",
};

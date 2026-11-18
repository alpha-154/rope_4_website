"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  PlayCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  NEWS_TYPE_LABEL,
  formatDate,
  readingTime,
  type NewsArticle,
} from "@/lib/home-data";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop";

export function NewsCard({ item }: { item: NewsArticle }) {
  const [src, setSrc] = useState(item.cover || FALLBACK_COVER);
  const minutes = readingTime(item.content || item.excerpt);
  return (
    <Link
      href={`/news/${item.slug}`}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
    >
      <div className="relative h-48 bg-muted overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setSrc(FALLBACK_COVER)}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.type && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur text-white text-[10px] font-semibold">
            {item.type === "video" && <PlayCircle className="h-3 w-3" />}
            {NEWS_TYPE_LABEL[item.type] ?? item.type}
          </span>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatDate(item.publishedAt || item.createdAt)}</span>
            <span aria-hidden="true">•</span>
            <span>{minutes} min read</span>
          </div>
          <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
            {item.excerpt}
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-primary pt-2">
          Read Full Article
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

/** Ellipsis page list, e.g. 1 … 4 5 6 … 12 */
function pageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

export function Pagination({
  page,
  totalPages,
  onChange,
  disabled,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
  disabled?: boolean;
}) {
  if (totalPages <= 1) return null;
  const btn =
    "inline-flex h-10 min-w-[2.5rem] items-center justify-center gap-1 rounded-xl px-3 text-sm font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none";
  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-1.5"
    >
      <button
        type="button"
        className={`${btn} border border-border hover:bg-muted`}
        onClick={() => onChange(page - 1)}
        disabled={disabled || page <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>
      {pageWindow(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onChange(p)}
            disabled={disabled}
            className={`${btn} ${
              p === page
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border hover:bg-muted"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        className={`${btn} border border-border hover:bg-muted`}
        onClick={() => onChange(page + 1)}
        disabled={disabled || page >= totalPages}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

export function NewsEmpty() {
  return (
    <div className="py-14 text-center space-y-2 bg-muted/20 border rounded-2xl">
      <Newspaper className="h-10 w-10 text-muted-foreground mx-auto" />
      <p className="font-semibold">No stories published yet</p>
      <p className="text-sm text-muted-foreground">
        Check back soon for field dispatches and guides.
      </p>
    </div>
  );
}

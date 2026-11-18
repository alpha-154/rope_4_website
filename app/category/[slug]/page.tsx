"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Compass, Home } from "lucide-react";
import { publicApiClient } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicCategory } from "@/lib/site-data";
import {
  ProgramCard,
  ProgramCardSkeleton,
  type ProgramSummary,
} from "@/components/shared/program-card";

const PAGE_SIZE = 9;

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest first" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "duration", label: "Duration: Shortest" },
] as const;

/** Page numbers with ellipses, e.g. 1 … 4 5 6 … 12 */
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

function CategoryContent() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const sortParam = searchParams.get("sort");
  const sort = SORT_OPTIONS.some((o) => o.value === sortParam)
    ? sortParam!
    : "-createdAt";

  const {
    data: category,
    isLoading: categoryLoading,
    isError: categoryError,
  } = usePublicCategory(slug);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["public", "programs", "category", slug, page, sort],
    queryFn: async () => {
      const res = await publicApiClient.get("/public/programs", {
        params: { categorySlug: slug, page, limit: PAGE_SIZE, sort },
      });
      return {
        items: (res.data?.data ?? []) as ProgramSummary[],
        total: Number(res.data?.meta?.total ?? 0),
      };
    },
    enabled: !!slug,
    placeholderData: keepPreviousData,
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const items = data?.items ?? [];
  const pages = useMemo(() => pageWindow(page, totalPages), [page, totalPages]);

  const setQuery = (next: { page?: number; sort?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.sort !== undefined) {
      params.set("sort", next.sort);
      params.delete("page");
    }
    if (next.page !== undefined) {
      if (next.page <= 1) params.delete("page");
      else params.set("page", String(next.page));
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Out-of-range ?page= (e.g. stale link): jump to the last page that exists
  useEffect(() => {
    if (!data || isFetching) return;
    const last = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
    if (page > last) {
      const params = new URLSearchParams(searchParams.toString());
      if (last <= 1) params.delete("page");
      else params.set("page", String(last));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, [data, isFetching, page, pathname, router, searchParams]);

  const notFound = !categoryLoading && (categoryError || !category);
  const title = category?.name ?? (categoryLoading ? "" : "Category");
  const rangeStart = total === 0 || items.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <Compass className="h-12 w-12 text-muted-foreground mx-auto" />
        <h1 className="text-2xl font-extrabold">Category not found</h1>
        <p className="text-sm text-muted-foreground">
          This category doesn&apos;t exist or has no published programs yet.
        </p>
        <Link
          href="/programs"
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Browse all programs <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-emerald-950 text-white">
        {category?.coverImage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={category.coverImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-emerald-950/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-emerald-100/80 mb-4"
          >
            <Link href="/" className="flex items-center gap-1 hover:text-white">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/programs" className="hover:text-white">
              Programs
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-medium">{title}</span>
          </nav>
          {categoryLoading ? (
            <Skeleton className="h-10 w-64 bg-white/10" />
          ) : (
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              {title}
            </h1>
          )}
          {category?.description && (
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-emerald-50/85">
              {category.description}
            </p>
          )}
          {category && (
            <p className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-white/15">
              {category.programCount} published program
              {category.programCount === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading programs…"
              : total === 0
                ? "No programs yet"
                : `Showing ${rangeStart}–${rangeEnd} of ${total}`}
          </p>
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            Sort by
            <select
              value={sort}
              onChange={(e) => setQuery({ sort: e.target.value })}
              className="h-10 px-3 rounded-xl border border-input bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProgramCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${isFetching ? "opacity-60" : ""}`}
          >
            {items.map((p) => (
              <ProgramCard key={p._id} program={p} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 bg-muted/20 border rounded-2xl p-8">
            <Compass className="h-12 w-12 text-muted-foreground mx-auto" />
            <h2 className="font-bold text-lg">
              No programs in this category yet
            </h2>
            <Link
              href="/programs"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Browse all programs
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-10 flex items-center justify-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => setQuery({ page: page - 1 })}
              disabled={page <= 1}
              className="inline-flex h-10 items-center gap-1 rounded-xl border border-border px-3 text-sm font-semibold hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            {pages.map((p, i) =>
              p === "…" ? (
                <span key={`gap-${i}`} className="px-2 text-muted-foreground">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setQuery({ page: p })}
                  aria-current={p === page ? "page" : undefined}
                  className={`h-10 min-w-[2.5rem] rounded-xl px-3 text-sm font-semibold transition-colors ${
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
              onClick={() => setQuery({ page: page + 1 })}
              disabled={page >= totalPages}
              className="inline-flex h-10 items-center gap-1 rounded-xl border border-border px-3 text-sm font-semibold hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <CategoryContent />
    </Suspense>
  );
}

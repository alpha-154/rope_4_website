"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useNewsPage } from "@/lib/home-data";
import { NewsCard, NewsCardSkeleton, NewsEmpty, Pagination } from "@/components/home/news-grid";
import { SectionError } from "@/components/home/section-error";

const PAGE_SIZE = 9;

function NewsListing() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const { data, isLoading, isError, refetch, isFetching, isPlaceholderData } = useNewsPage(page, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  const goTo = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    router.push(next > 1 ? `${pathname}?page=${next}` : pathname, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <Link href="/" className="flex items-center gap-1 hover:text-foreground">
          <Home className="h-3.5 w-3.5" /> Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Stories & News</span>
      </nav>
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Stay Informed</h1>
      <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
        Field dispatches, alpine medical safety advice, and gear checklists from our guides.
      </p>

      <div className="mt-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : isError && !data ? (
          <SectionError title="Stories couldn't be loaded" onRetry={() => refetch()} retrying={isFetching} />
        ) : !data || data.items.length === 0 ? (
          <NewsEmpty />
        ) : (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${
                isFetching && isPlaceholderData ? "opacity-60" : ""
              }`}
            >
              {data.items.map((item) => (
                <NewsCard key={item._id} item={item} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={goTo} disabled={isFetching} />
          </>
        )}
      </div>
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <NewsListing />
    </Suspense>
  );
}

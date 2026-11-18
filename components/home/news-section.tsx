"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNewsPage } from "@/lib/home-data";
import { NewsCard, NewsCardSkeleton, Pagination } from "./news-grid";
import { SectionError } from "./section-error";

const PAGE_SIZE = 6;

export function NewsSection() {
  const [page, setPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const { data, isLoading, isError, refetch, isFetching, isPlaceholderData } = useNewsPage(page, PAGE_SIZE);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const goTo = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages));
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Hide the section entirely when nothing is published (after a successful load)
  if (!isLoading && !isError && total === 0) return null;

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <Badge variant="nature" className="px-3 py-1 font-semibold uppercase mb-2">
            Outdoor Knowledge Base
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Stay Informed</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Field dispatches, alpine medical safety advice, and gear checklists from our guides.
          </p>
        </div>
        <Link
          href="/news"
          className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Read all articles</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : isError && !data ? (
        <SectionError title="Stories couldn't be loaded" onRetry={() => refetch()} retrying={isFetching} />
      ) : (
        <>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${
              isFetching && isPlaceholderData ? "opacity-60" : ""
            }`}
          >
            {data?.items.map((item) => (
              <NewsCard key={item._id} item={item} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={goTo} disabled={isFetching} />
        </>
      )}
    </section>
  );
}

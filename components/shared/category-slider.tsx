"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  Footprints,
  Home,
  Mountain,
  Tent,
  Trees,
  type LucideIcon,
} from "lucide-react";
import type { PublicCategory } from "@/lib/site-data";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=900&auto=format&fit=crop";

/** Pick a fitting icon from the category name; categories are admin-defined. */
function iconFor(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (/camp/.test(n)) return Tent;
  if (/family|kid/.test(n)) return Home;
  if (/learn|course|school|academy|training/.test(n)) return BookOpen;
  if (/expedition|summit|premium|alpine|climb/.test(n)) return Mountain;
  if (/trek|hike|walk|trail/.test(n)) return Footprints;
  if (/survival|wild|forest|jungle/.test(n)) return Trees;
  return Compass;
}

function CategoryCard({ category }: { category: PublicCategory }) {
  const Icon = iconFor(category.name);
  const [src, setSrc] = useState(category.coverImage || FALLBACK_IMAGE);

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group/card relative block shrink-0 snap-start w-[78%] sm:w-[300px] lg:w-[calc((100%-4rem)/5)] min-w-[220px] aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-sm ring-1 ring-black/5 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-950/25 hover:ring-emerald-500/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50"
      aria-label={`${category.name}: ${category.programCount} program${category.programCount === 1 ? "" : "s"}`}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={() => setSrc(FALLBACK_IMAGE)}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
      />

      {/* Readability gradient, deepens on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500 group-hover/card:from-emerald-950/85 group-hover/card:via-black/25" />

      {/* Program count chip */}
      <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-emerald-900 shadow-sm backdrop-blur transition-all duration-300 opacity-0 -translate-y-1 group-hover/card:opacity-100 group-hover/card:translate-y-0">
        {category.programCount} program{category.programCount === 1 ? "" : "s"}
      </span>

      {/* Title band */}
      <div className="absolute inset-x-0 bottom-0 bg-black/45 backdrop-blur-[2px] px-4 py-3 transition-colors duration-500 group-hover/card:bg-emerald-900/70">
        <div className="flex items-center justify-center gap-2.5 text-white">
          <Icon className="h-5 w-5 shrink-0 transition-transform duration-500 group-hover/card:-rotate-6 group-hover/card:scale-110" />
          <h3 className="text-base sm:text-lg font-bold tracking-tight truncate">
            {category.name}
          </h3>
        </div>
        <div className="grid grid-rows-[0fr] transition-all duration-500 group-hover/card:grid-rows-[1fr]">
          <span className="overflow-hidden flex items-center justify-center gap-1 text-xs font-semibold text-emerald-200">
            <span className="pt-1.5">Explore programs</span>
            <ArrowRight className="mt-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover/card:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CategorySliderSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          key={i}
          className="shrink-0 w-[78%] sm:w-[300px] lg:w-[calc((100%-4rem)/5)] min-w-[220px] aspect-[4/3] rounded-2xl"
        />
      ))}
    </div>
  );
}

/** Horizontal, snap-scrolling category slider with arrow controls. */
export function CategorySlider({
  categories,
}: {
  categories: PublicCategory[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, categories.length]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-foreground shadow-lg ring-1 ring-black/5 transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 disabled:pointer-events-none disabled:opacity-0";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        disabled={!canPrev}
        className={`${arrowClass} -left-3 lg:-left-5`}
        aria-label="Previous categories"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={trackRef}
        className={`flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-2 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          !canPrev && !canNext ? "justify-center" : ""
        }`}
        role="list"
      >
        {categories.map((cat) => (
          <div key={cat._id} role="listitem" className="contents">
            <CategoryCard category={cat} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByPage(1)}
        disabled={!canNext}
        className={`${arrowClass} -right-3 lg:-right-5`}
        aria-label="Next categories"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

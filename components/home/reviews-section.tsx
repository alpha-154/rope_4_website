"use client";

import { useState } from "react";
import { Quote, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTestimonials, type Testimonial } from "@/lib/home-data";
import { cn } from "@/lib/utils";
import { SectionError } from "./section-error";

/** Below this many testimonials a moving marquee looks odd: show a static row. */
const MIN_FOR_MARQUEE = 4;
/** Seconds per card for one full loop; keeps speed constant regardless of count. */
const SECONDS_PER_CARD = 7;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function Avatar({ t }: { t: Testimonial }) {
  const [broken, setBroken] = useState(false);
  if (t.avatar && !broken) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={t.avatar}
        alt=""
        className="h-10 w-10 rounded-full object-cover shrink-0 ring-2 ring-primary/10"
        onError={() => setBroken(true)}
      />
    );
  }
  return (
    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
      {initials(t.author) || "R4"}
    </div>
  );
}

function TestimonialCard({
  t,
  ariaHidden,
}: {
  t: Testimonial;
  ariaHidden?: boolean;
}) {
  const rating = Math.max(0, Math.min(5, Math.round(t.rating || 0)));
  return (
    <figure
      aria-hidden={ariaHidden}
      className="relative w-[300px] sm:w-[360px] shrink-0 p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-lg hover:border-primary/30"
    >
      <Quote
        className="absolute top-5 right-5 h-8 w-8 text-primary/10"
        aria-hidden="true"
      />
      <div className="space-y-3">
        <div
          className="flex items-center gap-0.5"
          aria-label={`${rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < rating
                  ? "fill-amber-500 text-amber-500"
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>
        <blockquote className="text-sm text-foreground/85 leading-relaxed italic line-clamp-6">
          &ldquo;{t.text}&rdquo;
        </blockquote>
      </div>
      <figcaption className="pt-4 border-t border-border flex items-center gap-3 min-w-0">
        <Avatar t={t} />
        <div className="min-w-0">
          <div className="font-bold text-sm text-foreground truncate">
            {t.author}
          </div>
          {(t.designation || t.programTitle) && (
            <div className="text-xs text-muted-foreground truncate">
              {t.designation || t.programTitle}
            </div>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

function Header() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 space-y-2">
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
        What Adventurers Say
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground">
        Authentic stories and feedback from participants across our summits and
        youth camps.
      </p>
    </div>
  );
}

export function ReviewsSection() {
  const { data, isLoading, isError, refetch, isFetching } = useTestimonials();

  if (isLoading) {
    return (
      <section aria-busy="true">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 space-y-3">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex gap-6 overflow-hidden px-4 sm:px-6 lg:px-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-[300px] sm:w-[360px] shrink-0 rounded-2xl border border-border p-6 space-y-4"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionError
            title="Testimonials couldn't be loaded"
            onRetry={() => refetch()}
            retrying={isFetching}
          />
        </div>
      </section>
    );
  }

  const items = data ?? [];
  if (items.length === 0) return null;

  if (items.length < MIN_FOR_MARQUEE) {
    return (
      <section>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-6">
          {items.map((t) => (
            <TestimonialCard key={t._id} t={t} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <Header />
      {/* Infinite marquee: the list is rendered twice and the track slides by -50%.
          Pauses on hover/focus; static horizontal scroll for reduced-motion users. */}
      <div
        className="testimonial-marquee group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
        tabIndex={0}
        aria-label="Testimonials"
      >
        <div
          className="testimonial-marquee__track flex w-max gap-6 py-2"
          style={{ animationDuration: `${items.length * SECONDS_PER_CARD}s` }}
        >
          {items.map((t) => (
            <TestimonialCard key={t._id} t={t} />
          ))}
          {items.map((t) => (
            <TestimonialCard key={`dup-${t._id}`} t={t} ariaHidden />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Clock, MapPin, Mountain } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop";

/** Shape returned by GET /public/programs (only the fields the card needs). */
export interface ProgramSummary {
  _id: string;
  slug: string;
  title: string;
  category?: string;
  badge?: string;
  country?: string;
  region?: string;
  duration?: number | string;
  difficulty?: string;
  maxAltitude?: string;
  heroImages?: string[];
  images?: string[];
  price?: { amount?: number; currency?: string } | number;
  currency?: string;
}

function priceLabel(p: ProgramSummary) {
  const amount = typeof p.price === "number" ? p.price : p.price?.amount;
  const currency =
    (typeof p.price === "object" ? p.price?.currency : undefined) ||
    p.currency ||
    "BDT";
  return amount ? `${amount.toLocaleString("en-US")} ${currency}` : "Inquire";
}

function durationLabel(d: ProgramSummary["duration"]) {
  if (d === undefined || d === null || d === "") return null;
  return typeof d === "number" ? `${d} Day${d === 1 ? "" : "s"}` : d;
}

export function ProgramCard({ program }: { program: ProgramSummary }) {
  const [src, setSrc] = useState(
    program.heroImages?.[0] || program.images?.[0] || FALLBACK_IMAGE
  );
  const href = `/programs/${program.slug || program._id}`;
  const duration = durationLabel(program.duration);

  return (
    <Link
      href={href}
      className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
    >
      <div className="relative h-56 bg-muted overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={program.title}
          loading="lazy"
          onError={() => setSrc(FALLBACK_IMAGE)}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {(program.badge || program.category) && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
            {program.badge || program.category}
          </span>
        )}
        {(program.region || program.country) && (
          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur text-primary text-xs font-semibold flex items-center gap-1 shadow-sm max-w-[calc(100%-1.5rem)]">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {[program.region, program.country].filter(Boolean).join(", ")}
            </span>
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            {duration && (
              <span className="flex items-center gap-1 font-medium">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {duration}
              </span>
            )}
            {program.difficulty && (
              <span className="ml-auto font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                {program.difficulty}
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {program.title}
          </h3>
          {program.maxAltitude && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mountain className="h-3.5 w-3.5 text-emerald-600" />
              <span>Max Altitude: {program.maxAltitude}</span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-muted-foreground font-semibold block">
              Starting From
            </span>
            <span className="text-lg font-extrabold text-foreground">
              {priceLabel(program)}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-colors group-hover:bg-primary/90">
            View Itinerary
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProgramCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-9 w-full mt-4" />
      </div>
    </div>
  );
}

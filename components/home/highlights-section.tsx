"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useHighlights, type HighlightSection } from "@/lib/home-data";
import { HIGHLIGHT_ICONS, formatHighlightValue } from "@/lib/highlight-icons";
import { cn } from "@/lib/utils";
import { SectionError } from "./section-error";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

/** Column count follows the number of cards so 2-3 cards don't leave gaps. */
function gridCols(n: number) {
  if (n <= 1) return "grid-cols-1 max-w-sm mx-auto";
  if (n === 2) return "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto";
  if (n === 3) return "grid-cols-1 sm:grid-cols-3";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
}

function HighlightBlock({ section }: { section: HighlightSection }) {
  const items = section.items ?? [];
  const hasHeader =
    section.badge || section.sectionTitle || section.sectionDescription;
  return (
    <Shell>
      {hasHeader && (
        <div className="text-center space-y-2 mb-14">
          {section.badge && (
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-300">
              {section.badge}
            </span>
          )}
          {section.sectionTitle && (
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {section.sectionTitle}
            </h2>
          )}
          {section.sectionDescription && (
            <p className="text-sm text-emerald-100/80 max-w-xl mx-auto leading-relaxed whitespace-pre-line">
              {section.sectionDescription}
            </p>
          )}
        </div>
      )}

      <div className={cn("grid gap-6", gridCols(items.length))}>
        {items.map((stat, idx) => {
          const Icon = stat.icon ? HIGHLIGHT_ICONS[stat.icon] : undefined;
          const value = formatHighlightValue(stat.value, stat.valueSign);
          return (
            <div
              key={idx}
              className="group bg-emerald-900/60 border border-emerald-700/50 rounded-2xl p-6 text-center space-y-3 backdrop-blur-sm transition-all duration-300 hover:bg-emerald-900/80 hover:-translate-y-1 hover:border-emerald-500/60"
            >
              {Icon && (
                <div className="h-12 w-12 rounded-xl bg-accent text-accent-foreground mx-auto flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
              )}
              {value && (
                <div className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
                  {value}
                </div>
              )}
              <div className="font-semibold text-sm text-emerald-200">
                {stat.label}
              </div>
              {stat.description && (
                <p className="text-xs text-emerald-100/70 leading-relaxed whitespace-pre-line">
                  {stat.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

export function HighlightsSection() {
  const { data, isLoading, isError, refetch, isFetching } = useHighlights();

  if (isLoading) {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-3 mb-14">
          <Skeleton className="h-3 w-48 bg-white/15" />
          <Skeleton className="h-9 w-80 max-w-full bg-white/15" />
          <Skeleton className="h-4 w-[28rem] max-w-full bg-white/10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-emerald-700/50 bg-emerald-900/40 p-6 space-y-3"
            >
              <Skeleton className="h-12 w-12 rounded-xl mx-auto bg-white/15" />
              <Skeleton className="h-8 w-24 mx-auto bg-white/15" />
              <Skeleton className="h-4 w-32 mx-auto bg-white/10" />
              <Skeleton className="h-3 w-full bg-white/10" />
              <Skeleton className="h-3 w-4/5 mx-auto bg-white/10" />
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  if (isError) {
    return (
      <Shell>
        <SectionError
          tone="dark"
          title="Highlights couldn't be loaded"
          onRetry={() => refetch()}
          retrying={isFetching}
        />
      </Shell>
    );
  }

  // Only sections that are Active + Public and have cards reach the website
  const sections = (data ?? []).filter((s) => s.items?.length > 0);
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((s) => (
        <HighlightBlock key={s._id} section={s} />
      ))}
    </>
  );
}

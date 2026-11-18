"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useFaqGroups } from "@/lib/home-data";
import { SectionError } from "./section-error";

const ALL = "All";

function Header() {
  return (
    <div className="text-center space-y-2 mb-10">
      <Badge variant="nature" className="px-3 py-1 font-semibold uppercase">
        Got Questions?
      </Badge>
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
        Frequently Asked Questions
      </h2>
      <p className="text-sm text-muted-foreground">
        Everything you need to know about preparation, medical safety, fitness
        prerequisites, and booking.
      </p>
    </div>
  );
}

export function FaqSection() {
  const { data, isLoading, isError, refetch, isFetching } = useFaqGroups();
  const [active, setActive] = useState(ALL);

  // Flatten active groups (backend already filters isActive) into Q&A rows
  const { categories, questions } = useMemo(() => {
    const cats: string[] = [];
    const qs: {
      category: string;
      question: string;
      answer: string;
      key: string;
    }[] = [];
    for (const g of data ?? []) {
      if (!g.faqs?.length) continue;
      if (!cats.includes(g.category)) cats.push(g.category);
      g.faqs.forEach((f, i) =>
        qs.push({ category: g.category, ...f, key: `${g._id}-${i}` })
      );
    }
    return { categories: cats, questions: qs };
  }, [data]);

  // If the selected chip disappears after a refetch, fall back to "All"
  const current = active !== ALL && !categories.includes(active) ? ALL : active;
  const visible =
    current === ALL
      ? questions
      : questions.filter((q) => q.category === current);

  if (isLoading) {
    return (
      <section
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-busy="true"
      >
        <div className="flex flex-col items-center gap-3 mb-10">
          <Skeleton className="h-6 w-36 rounded-full" />
          <Skeleton className="h-9 w-96 max-w-full" />
          <Skeleton className="h-4 w-[30rem] max-w-full" />
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-full" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <SectionError
          title="FAQs couldn't be loaded"
          onRetry={() => refetch()}
          retrying={isFetching}
        />
      </section>
    );
  }

  if (questions.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Header />

      {categories.length > 1 && (
        <div
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
          role="tablist"
          aria-label="FAQ categories"
        >
          {[ALL, ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={current === cat}
              onClick={() => setActive(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                current === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <Accordion type="single" collapsible className="w-full space-y-3">
        {visible.map((faq) => (
          <AccordionItem
            key={faq.key}
            value={faq.key}
            className="border border-border rounded-xl px-5 bg-card shadow-sm"
          >
            <AccordionTrigger className="text-sm sm:text-base font-semibold hover:text-primary text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-1 whitespace-pre-line">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

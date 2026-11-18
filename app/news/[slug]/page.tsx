"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, Check, ChevronRight, Clock, Home, Link2, Newspaper, Tag } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { NEWS_TYPE_LABEL, formatDate, readingTime, useNewsArticle, useNewsPage } from "@/lib/home-data";
import { NewsCard, NewsCardSkeleton } from "@/components/home/news-grid";
import { SectionError } from "@/components/home/section-error";

/** YouTube / Vimeo watch URL -> embeddable URL (null when not recognised). */
function toEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = u.searchParams.get("v") || u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed${u.pathname}`;
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    /* not a URL */
  }
  return null;
}

function ArticleSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6" aria-busy="true">
      <Skeleton className="h-3 w-56" />
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          toast.success("Link copied");
          setTimeout(() => setCopied(false), 2000);
        } catch {
          toast.error("Couldn't copy the link");
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Link2 className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError, error, refetch, isFetching } = useNewsArticle(slug);
  const { data: more, isLoading: moreLoading } = useNewsPage(1, 4);
  const related = useMemo(() => (more?.items ?? []).filter((n) => n.slug !== slug).slice(0, 3), [more, slug]);
  const embed = toEmbedUrl(article?.videoUrl);

  if (isLoading) return <ArticleSkeleton />;

  const notFound = (isError && (error as any)?.response?.status === 404) || (!isError && !article);
  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <Newspaper className="h-12 w-12 text-muted-foreground mx-auto" />
        <h1 className="text-2xl font-extrabold">Article not found</h1>
        <p className="text-sm text-muted-foreground">It may have been unpublished or the link is incorrect.</p>
        <Link
          href="/news"
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Browse all stories <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24">
        <SectionError title="This article couldn't be loaded" onRetry={() => refetch()} retrying={isFetching} />
      </div>
    );
  }

  const published = formatDate(article.publishedAt || article.createdAt);
  const minutes = readingTime(article.content || article.excerpt);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.cover ? [article.cover] : undefined,
    datePublished: article.publishedAt,
    keywords: article.tags?.join(", "),
    publisher: { "@type": "Organization", name: "Rope4 Outdoor Education" },
  };

  return (
    <article className="pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="flex items-center gap-1 hover:text-foreground">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/news" className="hover:text-foreground">
            Stories & News
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate max-w-[12rem] sm:max-w-xs">{article.title}</span>
        </nav>

        {article.type && (
          <span className="inline-flex rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            {NEWS_TYPE_LABEL[article.type] ?? article.type}
          </span>
        )}
        <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] text-foreground">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground leading-relaxed">{article.excerpt}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              R4
            </div>
            <div className="text-sm">
              <div className="font-semibold text-foreground">Rope4 Editorial Team</div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {published && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <time dateTime={article.publishedAt}>{published}</time>
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {minutes} min read
                </span>
              </div>
            </div>
          </div>
          <CopyLinkButton />
        </div>
      </header>

      {/* Cover */}
      {article.cover && (
        <figure className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.cover}
            alt={article.title}
            className="w-full aspect-[16/9] object-cover rounded-2xl shadow-sm bg-muted"
          />
        </figure>
      )}

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-10">
        {embed && (
          <div className="mb-10 aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-sm">
            <iframe
              src={embed}
              title={article.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}

        {article.content ? (
          // Content is sanitized server-side (sanitize-html) before it is stored
          <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          <p className="text-muted-foreground">{article.excerpt}</p>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {article.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-border">
          <Link href="/news" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to all stories
          </Link>
        </div>
      </div>

      {/* More stories */}
      {(moreLoading || related.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="text-2xl font-extrabold tracking-tight mb-6">More Stories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moreLoading
              ? Array.from({ length: 3 }).map((_, i) => <NewsCardSkeleton key={i} />)
              : related.map((n) => <NewsCard key={n._id} item={n} />)}
          </div>
        </section>
      )}
    </article>
  );
}

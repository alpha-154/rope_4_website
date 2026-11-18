import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
const ORG_ID = process.env.NEXT_PUBLIC_ORGANIZATION_ID;

function humanize(slug: string) {
  return decodeURIComponent(slug)
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Server-side metadata so shared links and search engines get the real title/cover. */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const canonical = `/news/${params.slug}`;
  try {
    const headers: Record<string, string> = {};
    if (ORG_ID && /^[a-f0-9]{24}$/i.test(ORG_ID)) headers["x-organization-id"] = ORG_ID;
    const res = await fetch(`${API_URL}/public/news/${encodeURIComponent(params.slug)}`, {
      headers,
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const article = (await res.json())?.data;
      if (article) {
        const title = article.seo?.title || article.title;
        const description = article.seo?.description || article.excerpt;
        const image = article.seo?.ogImage || article.cover;
        return {
          title,
          description,
          alternates: { canonical },
          openGraph: {
            type: "article",
            title,
            description,
            url: canonical,
            publishedTime: article.publishedAt,
            tags: article.tags,
            images: image ? [{ url: image }] : undefined,
          },
          twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
        };
      }
    }
  } catch {
    // fall through to a generic title
  }
  return { title: humanize(params.slug), alternates: { canonical } };
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}

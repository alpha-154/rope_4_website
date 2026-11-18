import type { Metadata } from "next";

function humanize(slug: string) {
  return decodeURIComponent(slug)
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const name = humanize(params.slug);
  const description = `Browse all ${name} programs by Rope4 Outdoor Education: itineraries, departure dates, difficulty and pricing.`;
  return {
    title: `${name} Programs`,
    description,
    alternates: { canonical: `/category/${params.slug}` },
    openGraph: { title: `${name} Programs | Rope4`, description, url: `/category/${params.slug}` },
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

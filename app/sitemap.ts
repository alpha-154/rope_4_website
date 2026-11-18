import { MetadataRoute } from "next";
import { publicApiClient } from "@/lib/axios";

export const revalidate = 3600; // Revalidate dynamic sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rope4.com";

  // Core Static Routes
  const staticRoutes = [
    "",
    "/programs",
    "/store",
    "/contact",
    "/faqs",
    "/news",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" ? "daily" : "weekly") as "daily" | "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Known fallback slugs for build resilience
  const fallbackProgramSlugs = [
    "everest-base-camp-kala-patthar",
    "annapurna-circuit-thorong-la-pass",
    "keokradong-nafakhum-wilderness",
    "saka-haphong-remote-summit-trek",
    "youth-alpine-wilderness-survival-camp",
    "certified-basic-mountaineering-rigging-course",
  ];

  const fallbackProductSlugs = [
    "osprey-atmos-ag-65l-expedition-rucksack",
    "black-diamond-distance-z-trekking-poles",
    "the-north-face-inferno-down-sleeping-bag",
    "petzl-boreo-mountaineering-climbing-helmet",
    "scarpa-ribelle-tech-waterproof-mountaineering-boots",
    "msr-hubba-hubba-nx-2p-tent",
  ];

  let programSlugs = fallbackProgramSlugs;
  let productSlugs = fallbackProductSlugs;
  let categorySlugs: string[] = [];
  let newsSlugs: string[] = [];

  try {
    const [progRes, prodRes] = await Promise.all([
      publicApiClient.get("/public/programs?limit=100"),
      publicApiClient.get("/public/products?limit=100"),
    ]);

    const progs = Array.isArray(progRes.data?.data) ? progRes.data.data : progRes.data?.data?.items;
    if (progs?.length > 0) {
      programSlugs = progs.map((p: any) => p.slug);
    }
    if (prodRes.data?.data?.items?.length > 0) {
      productSlugs = prodRes.data.data.items.map((p: any) => p.slug);
    }
  } catch {
    // Graceful fallback to static list if API unavailable during build
  }

  try {
    const catRes = await publicApiClient.get("/public/categories");
    if (Array.isArray(catRes.data?.data)) {
      categorySlugs = catRes.data.data.map((c: any) => c.slug);
    }
  } catch {
    // Categories are optional in the sitemap
  }

  try {
    const newsRes = await publicApiClient.get("/public/news?limit=200");
    if (Array.isArray(newsRes.data?.data)) {
      newsSlugs = newsRes.data.data.map((n: any) => n.slug);
    }
  } catch {
    // Articles are optional in the sitemap
  }

  const programRoutes = programSlugs.map((slug) => ({
    url: `${baseUrl}/programs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const productRoutes = productSlugs.map((slug) => ({
    url: `${baseUrl}/store/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryRoutes = categorySlugs.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const newsRoutes = newsSlugs.map((slug) => ({
    url: `${baseUrl}/news/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...programRoutes, ...newsRoutes, ...productRoutes];
}

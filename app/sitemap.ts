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

  try {
    const [progRes, prodRes] = await Promise.all([
      publicApiClient.get("/public/programs?limit=100"),
      publicApiClient.get("/public/products?limit=100"),
    ]);

    if (progRes.data?.data?.items?.length > 0) {
      programSlugs = progRes.data.data.items.map((p: any) => p.slug);
    }
    if (prodRes.data?.data?.items?.length > 0) {
      productSlugs = prodRes.data.data.items.map((p: any) => p.slug);
    }
  } catch {
    // Graceful fallback to static list if API unavailable during build
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

  return [...staticRoutes, ...programRoutes, ...productRoutes];
}

import { MetadataRoute } from "next";

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

  // Expedition Programs
  const programSlugs = [
    "everest-base-camp-kala-patthar",
    "annapurna-circuit-thorong-la-pass",
    "keokradong-nafakhum-wilderness",
    "saka-haphong-remote-summit-trek",
    "youth-alpine-wilderness-survival-camp",
    "certified-basic-mountaineering-rigging-course",
  ];

  const programRoutes = programSlugs.map((slug) => ({
    url: `${baseUrl}/programs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Gear Store Products
  const productSlugs = [
    "osprey-atmos-ag-65l-expedition-rucksack",
    "black-diamond-distance-z-trekking-poles",
    "the-north-face-inferno-down-sleeping-bag",
    "petzl-boreo-mountaineering-climbing-helmet",
    "scarpa-ribelle-tech-waterproof-mountaineering-boots",
    "msr-hubba-hubba-nx-2p-tent",
  ];

  const productRoutes = productSlugs.map((slug) => ({
    url: `${baseUrl}/store/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...programRoutes, ...productRoutes];
}

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rope4.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/checkout/", "/customer/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

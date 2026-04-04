import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const market = headersList.get("x-market") ?? "ch";
  const isFrance = market === "fr";

  const base = isFrance ? "https://configpc-france.fr" : "https://config-pc.ch";
  const now = new Date();

  const common: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/catalogue`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/configurateur/manuel`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/support`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/mentions-legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${base}/politique-confidentialite`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Blog articles — Switzerland only (FR domain uses same content for now)
  const blog: MetadataRoute.Sitemap = [
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/blog/meilleur-pc-gaming-1000-chf-suisse`,
      lastModified: new Date("2025-03-15"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog/config-pc-bureautique-suisse`,
      lastModified: new Date("2025-03-10"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog/comparatif-composants-digitec-galaxus`,
      lastModified: new Date("2025-03-05"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  return [...common, ...blog];
}

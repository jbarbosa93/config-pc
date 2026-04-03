import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://config-pc.ch";
  const now = new Date();

  return [
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
}

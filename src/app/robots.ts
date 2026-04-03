import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/panier", "/commander", "/commande/"],
      },
    ],
    sitemap: "https://config-pc.ch/sitemap.xml",
  };
}

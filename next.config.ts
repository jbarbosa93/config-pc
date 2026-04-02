import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.pcpartpicker.com" },
      { protocol: "https", hostname: "cdn.pcpartpicker.com" },
      { protocol: "https", hostname: "cdna.pcpartpicker.com" },
      { protocol: "https", hostname: "**.media-amazon.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.pcpartpicker.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pcpartpicker.com",
      },
    ],
  },
};

export default nextConfig;

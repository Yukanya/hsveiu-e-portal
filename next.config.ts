import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "eiu.edu.vn",
      },
      {
        protocol: "https",
        hostname: "cdn.tuoitre.vn",
      },
      {
        protocol: "https",
        hostname: "cdn2.tuoitre.vn",
      },
      {
        protocol: "https",
        hostname: "hoisinhvien.com.vn",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;

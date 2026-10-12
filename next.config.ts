import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    // Placeholder photography is served from Unsplash during development.
    // Add the property management system's media host here once verified
    // (see docs/INTEGRATION.md).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    qualities: [70, 80],
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    // Pin the workspace root (a lockfile higher up the tree would otherwise be picked up).
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

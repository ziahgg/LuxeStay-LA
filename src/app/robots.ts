import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Set NEXT_PUBLIC_ALLOW_INDEXING=true only on the production deployment.
  const allow = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    rules: allow
      ? { userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}

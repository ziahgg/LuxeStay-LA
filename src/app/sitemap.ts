import type { MetadataRoute } from "next";
import { getDataSource, getPropertySlugs } from "@/lib/properties/service";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/residences", "/experience", "/about", "/faq", "/contact", "/privacy", "/terms", "/accessibility"];
  // Sample listings are excluded so search engines never index fictional inventory.
  const slugs = getDataSource() === "sample" ? [] : await getPropertySlugs();

  return [
    ...pages.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path === "/residences" ? 0.9 : 0.5,
    })),
    ...slugs.map((slug) => ({
      url: `${site.url}/residences/${slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}

import type { MetadataRoute } from "next";
import { ROUTES, SITE } from "@/lib/site";

/**
 * Cached so the timestamp is stable and the sitemap stays part of the static
 * shell — without this, reading the clock makes the route dynamic.
 */
async function lastModified(): Promise<string> {
  "use cache";

  return new Date().toISOString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const modified = await lastModified();

  return ROUTES.map((route) => ({
    url: new URL(route.path, SITE.url).toString(),
    lastModified: modified,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}

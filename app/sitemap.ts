import type { MetadataRoute } from "next";
import { ROUTES, SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: new URL(route.path, SITE.url).toString(),
    lastModified,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}

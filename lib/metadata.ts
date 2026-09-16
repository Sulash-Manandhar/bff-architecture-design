import type { Metadata } from "next";
import { routeMetaFor } from "@/lib/site";

/**
 * Builds the per-page metadata every demo route needs. Fields left out here
 * (siteName, locale, robots, the OG image) are inherited from the root layout.
 */
export function routeMetadata(path: string): Metadata {
  const { title, description } = routeMetaFor(path);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
  };
}

/**
 * Single source of truth for the values SEO metadata, the sitemap and the
 * OG images all need. Keeping them here stops the same string from drifting
 * between `<title>`, og:title and the sitemap.
 */

const DEV_SITE_URL = "http://localhost:3000";

/**
 * Absolute URLs are mandatory for og:image and canonical tags, so the origin
 * has to be known at build time. Vercel exposes the production domain; other
 * hosts set NEXT_PUBLIC_SITE_URL explicitly.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return DEV_SITE_URL;
}

export const SITE = {
  name: "BFF Demo",
  url: resolveSiteUrl(),
  title: "Three ways to fetch the same data in Next.js",
  description:
    "A Backend-for-Frontend demo comparing three Next.js data-fetching strategies — server components, server actions with TanStack Query, and route handlers — against one shared upstream.",
  locale: "en_US",
} as const;

export type RouteMeta = {
  readonly path: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly priority: number;
};

export const ROUTES: readonly RouteMeta[] = [
  {
    path: "/",
    eyebrow: "Backend for Frontend",
    title: SITE.title,
    description: SITE.description,
    priority: 1,
  },
  {
    path: "/server",
    eyebrow: "Server component",
    title: "Fetch on the server",
    description:
      "An async server component awaits the feed before rendering, so the browser receives finished HTML with no loading state and no client-side fetch.",
    priority: 0.8,
  },
  {
    path: "/client",
    eyebrow: "Client component",
    title: "Fetch with TanStack Query",
    description:
      "A client component calls a server action through useQuery, so the data arrives after hydration — cached, retried and refetchable on demand.",
    priority: 0.8,
  },
  {
    path: "/api-route",
    eyebrow: "Route handler",
    title: "Fetch a real endpoint from the browser",
    description:
      "A client component fetches /api/feed over plain HTTP, making the request a normal GET you can watch in DevTools, replay and curl.",
    priority: 0.8,
  },
];

/**
 * Pages and their opengraph-image routes look their copy up by path, so each
 * call site stays a couple of lines and cannot drift from this table.
 */
export function routeMetaFor(path: string): RouteMeta {
  const match = ROUTES.find((route) => route.path === path);

  if (!match) {
    throw new Error(`No route metadata registered for "${path}"`);
  }

  return match;
}

# Two ways to fetch the same data — Next.js demo

The same feed, rendered twice, so you can compare the mechanisms side by side. Both routes share one
`fetchFeed()` function; only the caller differs.

The upstream is [JSONPlaceholder](https://jsonplaceholder.typicode.com), a public fake API.

## Getting started

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>. The home page diagrams both flows and links to each.

## The two routes

### `/server` — server component

```
Server component ──▶ jsonplaceholder ──▶ Browser receives finished HTML
await fetchFeed()     /posts /users /comments
```

An `async` page component awaits the data before rendering. No client JavaScript, no loading state,
no server action. This is the simplest path.

### `/client` — client component + TanStack Query

```
Client component ──▶ getFeed() server action ──▶ jsonplaceholder
useQuery                                          /posts /users /comments
```

The component renders skeletons, then calls a server action through `useQuery`. Costs a loading
state and some client JavaScript; buys caching, retries and refetch-on-demand.

## Where to look

| Path | Role |
|---|---|
| [lib/feed.ts](lib/feed.ts) | `fetchFeed()` — the shared fetch and join. Runs on the server in both routes. |
| [app/server/page.tsx](app/server/page.tsx) | Server component. Awaits `fetchFeed()` directly. |
| [app/client/page.tsx](app/client/page.tsx) | Renders the client component. |
| [app/(demo)/feed-panel.tsx](app/\(demo\)/feed-panel.tsx) | `useQuery` plus loading and error states. |
| [app/actions/feed.ts](app/actions/feed.ts) | `"use server"` wrapper so the browser can call `fetchFeed()`. |
| [app/page.tsx](app/page.tsx) | The comparison and both flow diagrams. |

## Things to try

- **View source on each route.** `/server` ships the twelve cards in the HTML; `/client` ships
  skeletons and fills them in after hydration.
- **Check the build output.** `pnpm build` marks `/server` dynamic (`ƒ`) and `/client` static (`○`).
- **Throttle the network.** The difference between the two loading experiences becomes obvious.

## SEO and social previews

Metadata lives in one table, [lib/site.ts](lib/site.ts): every `<title>`, description, canonical URL,
sitemap entry and OG card reads from it, so a copy change lands everywhere at once.

| Path | Role |
|---|---|
| [app/layout.tsx](app/layout.tsx) | Site-wide defaults: title template, Open Graph, Twitter card, robots, theme color. |
| [lib/metadata.ts](lib/metadata.ts) | `routeMetadata(path)` — per-page title, description and canonical. |
| [lib/og-image.tsx](lib/og-image.tsx) | The shared 1200×630 card, rendered with `next/og`. |
| `app/**/opengraph-image.tsx` | One per route, so each page shares with its own card. |
| [app/robots.ts](app/robots.ts) / [app/sitemap.ts](app/sitemap.ts) | Generated `robots.txt` and `sitemap.xml`. |

Absolute URLs (canonical tags, `og:image`) need a known origin. Set it before deploying:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

On Vercel this falls back to the production domain automatically; locally it falls back to
`http://localhost:3000`.

Preview a card without deploying: `pnpm build && pnpm start`, then open
<http://localhost:3000/opengraph-image>.

# Six ways to move the same data — Next.js demo

One feed, fetched six different ways, so you can compare the mechanisms side by side. Five routes
share a single `fetchFeed()` function and differ only in where it is called from; the sixth writes
instead of reading.

The upstream is [JSONPlaceholder](https://jsonplaceholder.typicode.com), a public fake API.

Built on Next.js 16 with [Cache Components](https://nextjs.org/docs/app/getting-started/caching)
enabled (`cacheComponents: true`), which is what makes `use cache`, `cacheLife` and `cacheTag`
available.

## Getting started

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>. The home page diagrams every flow and links to each.

## The six routes

### `/server` — server component

```
Server component ──▶ jsonplaceholder ──▶ Browser receives finished HTML
await fetchFeed()     /posts /users /comments
```

An `async` page component awaits the data before rendering. No client JavaScript, no loading state.
The cost is that nothing paints until the upstream answers, so the route opts out of instant
rendering with `export const instant = false`.

### `/client` — client component + TanStack Query

```
Client component ──▶ getFeed() server action ──▶ jsonplaceholder
useQuery                                          /posts /users /comments
```

The component renders skeletons, then calls a server action through `useQuery`. Buys caching,
retries and refetch-on-demand. Note the caveat: server actions are queued, so reads through them do
not run in parallel.

### `/api-route` — route handler

```
Client component ──▶ GET /api/feed ──▶ jsonplaceholder
fetch()               route handler     /posts /users /comments
```

A real HTTP endpoint you can watch in DevTools, replay and `curl`. The handler calls `connection()`
first so Cache Components defers it to request time instead of trying to prerender it.

### `/hybrid` — server start, client finish

```
Server component ──▶ Suspense boundary ──▶ Client component
fetchFeed() (no await)  shell + skeletons    use(promise)
```

The promise is created on the server and handed down unresolved. The upstream trip starts before
the first byte of HTML, but the shell still paints immediately and the feed streams in. Builds as a
partial prerender (`◐`).

### `/caching` — `use cache` + tags

```
Page ──▶ fetchCachedFeed() ──▶ cache entry (1m / 1h)
         "use cache"            items + generatedAt
```

`cacheLife('minutes')` sets the lifetime and `cacheTag('feed')` gives it an invalidation handle. The
page prints the timestamp stored *inside* the cache entry, so a value that does not move across
reloads is proof the upstream was never called again.

### `/mutation` — server action write

```
Form ──▶ createNote() ──▶ addNote() ──▶ updateTag("notes")
action    validates        writes        cached list expires
```

The other half of a BFF. The form posts straight to a `"use server"` function — no endpoint, and it
works before hydration. The action validates input at the boundary, writes, then invalidates the tag
the list was read through so the author sees their own write immediately.

## Where to look

| Path | Role |
|---|---|
| [lib/feed.ts](lib/feed.ts) | `fetchFeed()` and `fetchCachedFeed()` — the shared fetch and join, uncached and cached. |
| [lib/notes.ts](lib/notes.ts) | The write side: an in-memory store behind a cached, tagged reader. |
| [lib/note-input.ts](lib/note-input.ts) | Pure validation and limits, shared by the form and the action. |
| [app/server/page.tsx](app/server/page.tsx) | Server component. Awaits `fetchFeed()` directly. |
| [app/(demo)/feed-panel.tsx](app/\(demo\)/feed-panel.tsx) | `useQuery` against a server action. |
| [app/(demo)/feed-fetch-panel.tsx](app/\(demo\)/feed-fetch-panel.tsx) | `useQuery` against `/api/feed`. |
| [app/(demo)/feed-stream.tsx](app/\(demo\)/feed-stream.tsx) | `use(promise)` — the client half of the hybrid. |
| [app/(demo)/note-form.tsx](app/\(demo\)/note-form.tsx) | `useActionState` with pending and error state. |
| [app/actions/feed.ts](app/actions/feed.ts) | `getFeed()` and `revalidateFeed()`. |
| [app/actions/notes.ts](app/actions/notes.ts) | `createNote()` — validate, write, `updateTag`. |
| [app/api/feed/route.ts](app/api/feed/route.ts) | The BFF endpoint the browser can see. |
| [app/page.tsx](app/page.tsx) | The comparison and every flow diagram. |

## Things to try

- **View source on each route.** `/server` ships the twelve cards in the HTML; `/client` ships
  skeletons and fills them in after hydration; `/hybrid` ships skeletons *and* streams the cards
  into the same response.
- **Check the build output.** `pnpm build` labels each route: `○` static, `◐` partial prerender,
  `ƒ` dynamic — and prints the revalidate/expire window for the cached ones.
- **Reload `/caching` a few times.** The timestamp holds still, then jumps when you press
  "Revalidate now".
- **Add a note on `/mutation`.** The list updates on the same render the action returns — that is
  `updateTag` rather than `revalidateTag`. Submit whitespace to see server-side validation reject it.
- **Throttle the network.** The differences between the loading experiences become obvious.

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

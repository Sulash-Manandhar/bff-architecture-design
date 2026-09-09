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

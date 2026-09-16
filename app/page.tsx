import Link from "next/link";
import { FlowDiagram, type FlowStep } from "@/app/(demo)/flow-diagram";

type Demo = {
  readonly href: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly steps: readonly FlowStep[];
  readonly tradeoffs: readonly string[];
};

const DEMOS: readonly Demo[] = [
  {
    href: "/server",
    eyebrow: "Server component",
    title: "Await the data, then render",
    summary:
      "The page component is async. It fetches on the server and sends finished HTML — the browser never runs the fetch.",
    steps: [
      {
        label: "Server component",
        sublabel: "app/server/page.tsx",
        detail: "await fetchFeed() — runs before any HTML is sent.",
      },
      {
        label: "Upstream",
        sublabel: "jsonplaceholder",
        detail: "/posts · /users · /comments, fetched in parallel.",
      },
      {
        label: "Browser",
        sublabel: "HTML",
        detail: "Receives the rendered list. No fetch, no loading state.",
      },
    ],
    tradeoffs: [
      "Simplest possible path — two files, no client JavaScript",
      "No loading spinner: the page waits for the data",
      "Refreshing means re-requesting the page",
    ],
  },
  {
    href: "/client",
    eyebrow: "Client component",
    title: "Fetch after hydration with TanStack Query",
    summary:
      "A client component calls a server action through useQuery. The data arrives after the page does, and the result is cached.",
    steps: [
      {
        label: "Client component",
        sublabel: "useQuery",
        detail: "Renders skeletons first, then calls the server action.",
      },
      {
        label: "Server action",
        sublabel: "getFeed()",
        detail: "Runs on the server. Calls the same fetchFeed().",
      },
      {
        label: "Upstream",
        sublabel: "jsonplaceholder",
        detail: "/posts · /users · /comments, fetched in parallel.",
      },
    ],
    tradeoffs: [
      "Caching, retries and refetch-on-demand come for free",
      "Needs a loading state, and ships client JavaScript",
      "The right choice when data changes while the page is open",
    ],
  },
  {
    href: "/api-route",
    eyebrow: "Route handler",
    title: "Fetch a real endpoint from the browser",
    summary:
      "A client component fetches /api/feed over plain HTTP. The request is a normal GET you can watch in DevTools, replay and curl.",
    steps: [
      {
        label: "Client component",
        sublabel: "useQuery",
        detail: 'Renders skeletons first, then fetch("/api/feed").',
      },
      {
        label: "Route handler",
        sublabel: "app/api/feed/route.ts",
        detail: "GET returns JSON. Calls the same fetchFeed().",
      },
      {
        label: "Upstream",
        sublabel: "jsonplaceholder",
        detail: "/posts · /users · /comments, fetched in parallel.",
      },
    ],
    tradeoffs: [
      "A visible, curl-able GET — the easiest of the three to debug",
      "Types are not shared across the wire: the response needs validating",
      "The right choice when something other than this app also needs the data",
    ],
  },
  {
    href: "/hybrid",
    eyebrow: "Server + client",
    title: "Start on the server, finish on the client",
    summary:
      "The server starts the fetch and hands the unresolved promise to a client component. The shell paints immediately; the feed streams in behind a Suspense boundary.",
    steps: [
      {
        label: "Server component",
        sublabel: "no await",
        detail: "Calls fetchFeed() and passes the promise down.",
      },
      {
        label: "Suspense",
        sublabel: "fallback",
        detail: "Shell and skeletons ship in the first response.",
      },
      {
        label: "Client component",
        sublabel: "use(promise)",
        detail: "Reads the promise as the data streams in.",
      },
    ],
    tradeoffs: [
      "The upstream trip starts before the first byte — no hydration wait",
      "Builds as a partial prerender (◐): static shell, streamed body",
      "The best default when the data is slow but the page should paint fast",
    ],
  },
  {
    href: "/caching",
    eyebrow: "Caching",
    title: "Pay for the upstream once",
    summary:
      'A "use cache" function with a cacheLife profile and a cache tag. Repeat requests skip the upstream entirely, and a tag lets a mutation drop the entry on demand.',
    steps: [
      {
        label: "Cached function",
        sublabel: '"use cache"',
        detail: "cacheLife('minutes') + cacheTag('feed').",
      },
      {
        label: "Cache entry",
        sublabel: "1m / 1h",
        detail: "Stores items and the generation timestamp together.",
      },
      {
        label: "Invalidation",
        sublabel: "updateTag",
        detail: "A server action drops the entry immediately.",
      },
    ],
    tradeoffs: [
      "The upstream is called once per window, not once per visitor",
      "Data can be stale for as long as the cacheLife profile allows",
      "updateTag for read-your-own-writes; revalidateTag for background refresh",
    ],
  },
  {
    href: "/mutation",
    eyebrow: "Mutation",
    title: "Write through a server action",
    summary:
      "The other half of a BFF: a form posts straight to a server function, which validates, writes, then invalidates the cache tag the list was read through.",
    steps: [
      {
        label: "Form",
        sublabel: "useActionState",
        detail: "Posts to the action and renders pending and error state.",
      },
      {
        label: "Server action",
        sublabel: '"use server"',
        detail: "Validates the input, then writes.",
      },
      {
        label: "Invalidation",
        sublabel: "updateTag",
        detail: "Expires the cached list so the write is visible.",
      },
    ],
    tradeoffs: [
      "No endpoint to write, and the form works before hydration",
      "Never trust the payload: the action revalidates every field server-side",
      "Actions are queued — right for writes, wrong for parallel reads",
    ],
  },
];

function DemoSection({ demo }: { demo: Demo }) {
  return (
    <section className="border-t border-border pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">{demo.eyebrow}</p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight">{demo.title}</h2>
        </div>

        <Link
          href={demo.href}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent/50 hover:text-accent"
        >
          Open {demo.href} →
        </Link>
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{demo.summary}</p>

      <div className="mt-6">
        <FlowDiagram steps={demo.steps} />
      </div>

      <ul className="mt-5 flex flex-col gap-1.5">
        {demo.tradeoffs.map((tradeoff) => (
          <li key={tradeoff} className="flex gap-2 text-xs text-muted">
            <span aria-hidden className="text-accent">
              ·
            </span>
            {tradeoff}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:py-16">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Demo</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Six ways to move the same data
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Five of these routes render the same feed from one shared{" "}
          <code className="font-mono text-xs">fetchFeed()</code> function; the sixth writes instead.
          What differs is where the call is made from, what gets cached — and what each choice
          costs.
        </p>
      </header>

      <div className="mt-12 flex flex-col gap-12">
        {DEMOS.map((demo) => (
          <DemoSection key={demo.href} demo={demo} />
        ))}
      </div>
    </main>
  );
}

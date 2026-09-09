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
          Two ways to fetch the same data
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Both routes render the same feed and share one{" "}
          <code className="font-mono text-xs">fetchFeed()</code> function. What differs is where the
          call is made from — and what that costs.
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

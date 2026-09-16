import Link from "next/link";
import { FeedFetchPanel } from "@/app/(demo)/feed-fetch-panel";
import { routeMetadata } from "@/lib/metadata";

export const metadata = routeMetadata("/api-route");

export default function ApiRouteFetchPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:py-16">
      <Link href="/" className="font-mono text-xs text-muted transition-colors hover:text-accent">
        ← Back
      </Link>

      <header className="mt-6 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Route handler</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Fetch a real HTTP endpoint
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          A client component calls{" "}
          <code className="font-mono text-xs">fetch(&quot;/api/feed&quot;)</code>, and{" "}
          <code className="font-mono text-xs">app/api/feed/route.ts</code> answers it. Open DevTools
          → Network → Fetch/XHR: this is the one demo where you can watch the request go out.
        </p>
      </header>

      <section className="mt-10">
        <FeedFetchPanel />
      </section>
    </main>
  );
}

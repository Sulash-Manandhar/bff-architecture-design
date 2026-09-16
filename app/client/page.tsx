import Link from "next/link";
import { FeedPanel } from "@/app/(demo)/feed-panel";
import { routeMetadata } from "@/lib/metadata";

export const metadata = routeMetadata("/client");

export default function ClientFetchPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:py-16">
      <Link href="/" className="font-mono text-xs text-muted transition-colors hover:text-accent">
        ← Back
      </Link>

      <header className="mt-6 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          Client component
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Fetch with TanStack Query
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          A client component calls the{" "}
          <code className="font-mono text-xs">getFeed()</code> server action through{" "}
          <code className="font-mono text-xs">useQuery</code>. The data arrives after hydration, so
          there is a loading state — and the result is cached, retried and refetchable.
        </p>
      </header>

      <section className="mt-10">
        <FeedPanel />
      </section>
    </main>
  );
}

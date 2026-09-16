import Link from "next/link";
import { FeedCard } from "@/app/(demo)/feed-card";
import { fetchFeed } from "@/lib/feed";
import { routeMetadata } from "@/lib/metadata";

export const metadata = routeMetadata("/server");

/**
 * No client component, no TanStack Query, no server action. The component is
 * async and simply awaits the data before it renders.
 */
export default async function ServerFetchPage() {
  const items = await fetchFeed();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:py-16">
      <Link href="/" className="font-mono text-xs text-muted transition-colors hover:text-accent">
        ← Back
      </Link>

      <header className="mt-6 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          Server component
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Fetch on the server
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          The page component is <code className="font-mono text-xs">async</code> and awaits{" "}
          <code className="font-mono text-xs">fetchFeed()</code> directly. The browser receives
          finished HTML — there is no loading state, and no fetch happens client-side.
        </p>
      </header>

      <section className="mt-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <FeedCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

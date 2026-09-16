import { DemoHeader } from "@/app/(demo)/demo-header";
import { FeedGrid } from "@/app/(demo)/feed-grid";
import { RevalidateButton } from "@/app/(demo)/revalidate-button";
import { routeMetadata } from "@/lib/metadata";
import { fetchCachedFeed } from "@/lib/feed";

export const metadata = routeMetadata("/caching");

export default async function CachingPage() {
  const { items, generatedAt } = await fetchCachedFeed();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:py-16">
      <DemoHeader eyebrow="Caching" title="Pay for the upstream once">
        <code className="font-mono text-xs">fetchCachedFeed()</code> is marked{" "}
        <code className="font-mono text-xs">&quot;use cache&quot;</code> with a{" "}
        <code className="font-mono text-xs">minutes</code> lifetime and a{" "}
        <code className="font-mono text-xs">feed</code> tag. Reload the page: the timestamp below is
        stored with the cache entry, so it only moves when the entry is rebuilt.
      </DemoHeader>

      <section className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-5">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Generated at</p>
          <p className="mt-2 truncate font-mono text-sm">{generatedAt}</p>
          <p className="mt-1 text-xs text-muted">
            Unchanged across reloads means the upstream was never called again.
          </p>
        </div>

        <RevalidateButton />
      </section>

      <section className="mt-6">
        <FeedGrid items={items} />
      </section>
    </main>
  );
}

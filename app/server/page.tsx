import { DemoHeader } from "@/app/(demo)/demo-header";
import { FeedGrid } from "@/app/(demo)/feed-grid";
import { routeMetadata } from "@/lib/metadata";
import { fetchFeed } from "@/lib/feed";

export const metadata = routeMetadata("/server");

/**
 * This demo exists to show a page that blocks on its data, so it opts out of
 * instant rendering rather than hiding the wait behind a Suspense boundary.
 * The /hybrid demo is the streaming counterpart.
 */
export const instant = false;

/**
 * No client component, no TanStack Query, no server action. The component is
 * async and simply awaits the data before it renders.
 */
export default async function ServerFetchPage() {
  const items = await fetchFeed();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:py-16">
      <DemoHeader eyebrow="Server component" title="Fetch on the server">
        The page component is <code className="font-mono text-xs">async</code> and awaits{" "}
        <code className="font-mono text-xs">fetchFeed()</code> directly. The browser receives
        finished HTML — there is no loading state, and no fetch happens client-side. The cost is
        that nothing paints until the upstream answers.
      </DemoHeader>

      <section className="mt-10">
        <FeedGrid items={items} />
      </section>
    </main>
  );
}

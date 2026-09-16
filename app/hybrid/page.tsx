import { Suspense } from "react";
import { DemoHeader } from "@/app/(demo)/demo-header";
import { FeedGridSkeleton } from "@/app/(demo)/feed-grid";
import { FeedStream } from "@/app/(demo)/feed-stream";
import { routeMetadata } from "@/lib/metadata";
import { fetchFeed } from "@/lib/feed";

export const metadata = routeMetadata("/hybrid");

export default function HybridFetchPage() {
  // Deliberately not awaited: handing the promise down is what lets the shell
  // render immediately while the feed streams in behind the Suspense boundary.
  const items = fetchFeed();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:py-16">
      <DemoHeader eyebrow="Server + client" title="Start on the server, finish on the client">
        The server component calls <code className="font-mono text-xs">fetchFeed()</code> without
        awaiting it and passes the promise to a client component, which reads it with{" "}
        <code className="font-mono text-xs">use()</code>. The upstream trip begins before the first
        byte of HTML — but the page still paints immediately, and the feed streams in after.
      </DemoHeader>

      <section className="mt-10">
        <Suspense fallback={<FeedGridSkeleton />}>
          <FeedStream items={items} />
        </Suspense>
      </section>
    </main>
  );
}

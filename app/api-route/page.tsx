import { DemoHeader } from "@/app/(demo)/demo-header";
import { FeedFetchPanel } from "@/app/(demo)/feed-fetch-panel";
import { routeMetadata } from "@/lib/metadata";

export const metadata = routeMetadata("/api-route");

export default function ApiRouteFetchPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:py-16">
      <DemoHeader eyebrow="Route handler" title="Fetch a real HTTP endpoint">
        A client component calls{" "}
        <code className="font-mono text-xs">fetch(&quot;/api/feed&quot;)</code>, and{" "}
        <code className="font-mono text-xs">app/api/feed/route.ts</code> answers it. Open DevTools →
        Network → Fetch/XHR: this is the one demo where you can watch the request go out.
      </DemoHeader>

      <section className="mt-10">
        <FeedFetchPanel />
      </section>
    </main>
  );
}

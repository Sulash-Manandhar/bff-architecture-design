import { DemoHeader } from "@/app/(demo)/demo-header";
import { FeedPanel } from "@/app/(demo)/feed-panel";
import { routeMetadata } from "@/lib/metadata";

export const metadata = routeMetadata("/client");

export default function ClientFetchPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:py-16">
      <DemoHeader eyebrow="Client component" title="Fetch with TanStack Query">
        A client component calls the <code className="font-mono text-xs">getFeed()</code> server
        action through <code className="font-mono text-xs">useQuery</code>. The data arrives after
        hydration, so there is a loading state — and the result is cached, retried and refetchable.
        Server actions are queued, though, so reads through them do not run in parallel.
      </DemoHeader>

      <section className="mt-10">
        <FeedPanel />
      </section>
    </main>
  );
}

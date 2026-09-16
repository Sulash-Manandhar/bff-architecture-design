import { FeedCard, FeedCardSkeleton } from "@/app/(demo)/feed-card";
import type { FeedItem } from "@/lib/feed";

const SKELETON_COUNT = 6;
const GRID_CLASS = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

export function FeedGrid({ items }: { items: readonly FeedItem[] }) {
  return (
    <div className={GRID_CLASS}>
      {items.map((item) => (
        <FeedCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export function FeedGridSkeleton() {
  return (
    <div className={GRID_CLASS} aria-busy="true">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <FeedCardSkeleton key={index} />
      ))}
    </div>
  );
}

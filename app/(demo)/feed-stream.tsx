"use client";

import { use } from "react";
import type { FeedItem } from "@/lib/feed";
import { FeedGrid } from "@/app/(demo)/feed-grid";

/**
 * The hybrid half: the server started this promise before any HTML was sent,
 * and use() suspends here until it settles. No fetch runs in the browser, and
 * no effect waits for hydration.
 */
export function FeedStream({ items }: { items: Promise<FeedItem[]> }) {
  return <FeedGrid items={use(items)} />;
}

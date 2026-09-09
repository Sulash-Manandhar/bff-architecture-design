"use server";

import { fetchFeed, type FeedItem } from "@/lib/feed";

/**
 * The client route's entry point. A server action is just an async function the
 * browser is allowed to call — the work itself still happens in lib/feed.ts.
 */
export async function getFeed(): Promise<FeedItem[]> {
  return fetchFeed();
}

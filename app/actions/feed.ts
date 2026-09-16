"use server";

import { updateTag } from "next/cache";
import { fetchFeed, FEED_TAG, type FeedItem } from "@/lib/feed";

/**
 * The client route's entry point. A server action is just an async function the
 * browser is allowed to call — the work itself still happens in lib/feed.ts.
 *
 * Note the caveat this demo exists to expose: server actions are queued, so
 * using them to *read* data serialises requests. Route handlers do not.
 */
export async function getFeed(): Promise<FeedItem[]> {
  return fetchFeed();
}

/** Drops the cached feed so the next render pays for a fresh upstream trip. */
export async function revalidateFeed(): Promise<void> {
  updateTag(FEED_TAG);
}

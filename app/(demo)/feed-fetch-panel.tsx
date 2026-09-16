"use client";

import { useQuery } from "@tanstack/react-query";
import type { FeedItem } from "@/lib/feed";
import { FeedCard, FeedCardSkeleton } from "@/app/(demo)/feed-card";

const SKELETON_COUNT = 6;

async function getFeed(): Promise<FeedItem[]> {
  const response = await fetch("/api/feed");

  if (!response.ok) {
    throw new Error(`GET /api/feed failed with ${response.status}`);
  }

  return response.json() as Promise<FeedItem[]>;
}

export function FeedFetchPanel() {
  const { data, error, isPending, refetch } = useQuery({
    queryKey: ["feed", "api-route"],
    queryFn: getFeed,
  });

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <FeedCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-3 rounded-xl border border-border bg-surface p-6"
      >
        <div>
          <h3 className="text-sm font-semibold">Feed unavailable</h3>
          <p className="mt-1 text-xs text-muted">Could not load the feed. Please try again.</p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent/50 hover:text-accent"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <FeedCard key={item.id} item={item} />
      ))}
    </div>
  );
}

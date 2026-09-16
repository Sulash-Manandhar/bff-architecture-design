"use client";

import { useQuery } from "@tanstack/react-query";
import type { FeedItem } from "@/lib/feed";
import { FeedGrid, FeedGridSkeleton } from "@/app/(demo)/feed-grid";
import { FeedError } from "@/app/(demo)/feed-error";

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

  if (isPending) return <FeedGridSkeleton />;

  if (error) return <FeedError onRetry={() => void refetch()} />;

  return <FeedGrid items={data} />;
}

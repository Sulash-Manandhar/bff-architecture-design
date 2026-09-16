"use client";

import { useQuery } from "@tanstack/react-query";
import { getFeed } from "@/app/actions/feed";
import { FeedGrid, FeedGridSkeleton } from "@/app/(demo)/feed-grid";
import { FeedError } from "@/app/(demo)/feed-error";

export function FeedPanel() {
  const { data, error, isPending, refetch } = useQuery({
    queryKey: ["feed"],
    queryFn: () => getFeed(),
  });

  if (isPending) return <FeedGridSkeleton />;

  if (error) return <FeedError onRetry={() => void refetch()} />;

  return <FeedGrid items={data} />;
}

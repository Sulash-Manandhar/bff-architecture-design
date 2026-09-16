"use client";

import { useTransition } from "react";
import { revalidateFeed } from "@/app/actions/feed";

export function RevalidateButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => revalidateFeed())}
      className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-50"
    >
      {isPending ? "Revalidating…" : "Revalidate now"}
    </button>
  );
}

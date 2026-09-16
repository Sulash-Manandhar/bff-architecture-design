"use client";

export function FeedError({ onRetry }: { onRetry: () => void }) {
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
        onClick={onRetry}
        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent/50 hover:text-accent"
      >
        Try again
      </button>
    </div>
  );
}

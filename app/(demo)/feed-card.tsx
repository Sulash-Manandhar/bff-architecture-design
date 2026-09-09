import type { FeedItem } from "@/lib/feed";

const EXCERPT_MAX_LENGTH = 140;

function toExcerpt(text: string): string {
  if (text.length <= EXCERPT_MAX_LENGTH) return text;

  return `${text.slice(0, EXCERPT_MAX_LENGTH).trimEnd()}…`;
}

export function FeedCard({ item }: { item: FeedItem }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm">
      <h3 className="text-sm font-semibold leading-snug first-letter:uppercase">{item.title}</h3>

      <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">{toExcerpt(item.excerpt)}</p>

      <footer className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <p className="min-w-0 truncate text-xs font-medium">{item.authorName}</p>

        <span className="shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-[11px] text-muted">
          {item.commentCount} {item.commentCount === 1 ? "comment" : "comments"}
        </span>
      </footer>
    </article>
  );
}

export function FeedCardSkeleton() {
  return (
    <div
      aria-hidden
      className="relative h-44 overflow-hidden rounded-xl border border-border bg-surface p-5"
    >
      <div className="h-3 w-3/4 rounded bg-surface-muted" />
      <div className="mt-3 h-2.5 w-full rounded bg-surface-muted" />
      <div className="mt-2 h-2.5 w-5/6 rounded bg-surface-muted" />
      <div className="mt-2 h-2.5 w-2/3 rounded bg-surface-muted" />
      <div className="mt-8 h-2.5 w-1/3 rounded bg-surface-muted" />
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.04] to-transparent [animation:shimmer_1.6s_infinite] dark:via-white/[0.06]" />
    </div>
  );
}

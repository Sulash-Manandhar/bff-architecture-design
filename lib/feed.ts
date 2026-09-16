import { cacheLife, cacheTag } from "next/cache";

const UPSTREAM_BASE_URL = "https://jsonplaceholder.typicode.com";
const POST_LIMIT = 12;

/** Invalidation handle for the cached feed. See app/actions/feed.ts. */
export const FEED_TAG = "feed";

type RawPost = { id: number; userId: number; title: string; body: string };
type RawUser = { id: number; name: string };
type RawComment = { postId: number };

export type FeedItem = {
  id: number;
  title: string;
  excerpt: string;
  authorName: string;
  commentCount: number;
};

export type CachedFeed = {
  items: FeedItem[];
  /** Frozen with the cache entry, so a stable value here proves it was a hit. */
  generatedAt: string;
};

async function get<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${UPSTREAM_BASE_URL}${path}`, init);

  if (!response.ok) {
    throw new Error(`Upstream ${path} failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function loadFeed(init?: RequestInit): Promise<FeedItem[]> {
  const [posts, users, comments] = await Promise.all([
    get<RawPost[]>(`/posts?_limit=${POST_LIMIT}`, init),
    get<RawUser[]>("/users", init),
    get<RawComment[]>("/comments", init),
  ]);

  const nameByUserId = new Map(users.map((user) => [user.id, user.name]));

  const commentCountByPostId = comments.reduce(
    (counts, comment) => counts.set(comment.postId, (counts.get(comment.postId) ?? 0) + 1),
    new Map<number, number>(),
  );

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.body.replace(/\s+/g, " ").trim(),
    authorName: nameByUserId.get(post.userId) ?? "Unknown author",
    commentCount: commentCountByPostId.get(post.id) ?? 0,
  }));
}

/**
 * The uncached path, used by every demo that wants to show a real upstream
 * round trip. The three upstream calls never happen in the browser.
 */
export async function fetchFeed(): Promise<FeedItem[]> {
  return loadFeed({ cache: "no-store" });
}

/**
 * The cached path. `use cache` stores the whole return value — timestamp
 * included — so repeat requests skip the upstream entirely until the entry
 * revalidates or something calls updateTag/revalidateTag(FEED_TAG).
 */
export async function fetchCachedFeed(): Promise<CachedFeed> {
  "use cache";
  cacheLife("minutes");
  cacheTag(FEED_TAG);

  const items = await loadFeed();

  return { items, generatedAt: new Date().toISOString() };
}

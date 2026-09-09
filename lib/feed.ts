const UPSTREAM_BASE_URL = "https://jsonplaceholder.typicode.com";
const POST_LIMIT = 12;

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

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${UPSTREAM_BASE_URL}${path}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Upstream ${path} failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Runs on the server in both demos — the only difference between the two routes
 * is who calls it: a server component directly, or a client component via a
 * server action. The three upstream calls never happen in the browser.
 */
export async function fetchFeed(): Promise<FeedItem[]> {
  const [posts, users, comments] = await Promise.all([
    get<RawPost[]>(`/posts?_limit=${POST_LIMIT}`),
    get<RawUser[]>("/users"),
    get<RawComment[]>("/comments"),
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

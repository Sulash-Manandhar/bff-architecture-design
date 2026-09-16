import { connection } from "next/server";
import { fetchFeed } from "@/lib/feed";

/**
 * The only demo whose upstream trip is visible in the browser's Network tab:
 * the client fetches this URL, and this handler calls the same fetchFeed().
 *
 * connection() defers to request time. Without it, Cache Components tries to
 * prerender the handler at build time, where there is no upstream to call.
 */
export async function GET() {
  await connection();

  try {
    const items = await fetchFeed();

    return Response.json(items);
  } catch (error) {
    console.error("GET /api/feed failed", error);

    return Response.json({ error: "Could not load the feed." }, { status: 502 });
  }
}

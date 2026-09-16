import { fetchFeed } from "@/lib/feed";

/**
 * The only demo whose upstream trip is visible in the browser's Network tab:
 * the client fetches this URL, and this handler calls the same fetchFeed().
 *
 * Route handlers are uncached by default, so no cache opt-out is needed here.
 */
export async function GET() {
  try {
    const items = await fetchFeed();

    return Response.json(items);
  } catch (error) {
    console.error("GET /api/feed failed", error);

    return Response.json({ error: "Could not load the feed." }, { status: 502 });
  }
}

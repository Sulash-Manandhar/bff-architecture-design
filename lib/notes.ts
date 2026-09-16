import { cacheLife, cacheTag } from "next/cache";
import type { Note } from "@/lib/note-input";

/** Invalidation handle for the cached note list. See app/actions/notes.ts. */
export const NOTES_TAG = "notes";

const WRITE_LATENCY_MS = 600;

/**
 * Module memory, not a database. It is enough to show a mutation invalidating
 * a cache, but it resets on restart and is not shared between serverless
 * instances — a real BFF would write to a store here.
 */
let notes: readonly Note[] = [
  {
    id: "seed-1",
    text: "Mutations go through a server action, never a fetch from the browser.",
    createdAt: new Date(0).toISOString(),
  },
];

/**
 * Cached so the mutation has something to invalidate. Without the tag, a new
 * note would not appear until the entry expired on its own.
 */
export async function listNotes(): Promise<readonly Note[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(NOTES_TAG);

  return notes;
}

export async function addNote(text: string): Promise<Note> {
  // Stands in for the round trip a real write would cost, so the pending state is visible.
  await new Promise((resolve) => setTimeout(resolve, WRITE_LATENCY_MS));

  const note: Note = {
    id: `note-${notes.length + 1}-${Date.now()}`,
    text,
    createdAt: new Date().toISOString(),
  };

  notes = [note, ...notes];

  return note;
}

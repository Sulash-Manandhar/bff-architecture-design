"use server";

import { updateTag } from "next/cache";
import { validateNoteText, type NoteFormState } from "@/lib/note-input";
import { addNote, NOTES_TAG } from "@/lib/notes";

/**
 * Shaped for useActionState: it takes the previous state and returns the next
 * one, so a rejected note reports why instead of throwing at the user.
 */
export async function createNote(
  _previous: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const validation = validateNoteText(formData.get("text"));

  if (!validation.ok) {
    return { status: "error", message: validation.error };
  }

  try {
    await addNote(validation.text);
  } catch (error) {
    console.error("createNote failed", error);

    return { status: "error", message: "Could not save the note. Please try again." };
  }

  // updateTag, not revalidateTag: the author must see their own note immediately.
  updateTag(NOTES_TAG);

  return { status: "success", message: "Note added." };
}

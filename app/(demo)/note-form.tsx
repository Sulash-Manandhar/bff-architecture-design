"use client";

import { useActionState } from "react";
import { createNote } from "@/app/actions/notes";
import { INITIAL_NOTE_FORM_STATE, NOTE_MAX_LENGTH } from "@/lib/note-input";

export function NoteForm() {
  const [state, action, isPending] = useActionState(createNote, INITIAL_NOTE_FORM_STATE);

  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="note-text" className="text-xs font-medium">
        Add a note
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="note-text"
          name="text"
          type="text"
          required
          maxLength={NOTE_MAX_LENGTH}
          placeholder="What should the next reader know?"
          aria-describedby="note-status"
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-xs outline-none transition-colors focus:border-accent/60"
        />

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg border border-border px-4 py-2 text-xs font-medium transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save note"}
        </button>
      </div>

      <p
        id="note-status"
        role="status"
        aria-live="polite"
        className={`text-xs ${state.status === "error" ? "text-accent" : "text-muted"}`}
      >
        {state.message || `Server action + updateTag. Max ${NOTE_MAX_LENGTH} characters.`}
      </p>
    </form>
  );
}

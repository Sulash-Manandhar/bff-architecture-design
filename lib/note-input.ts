/**
 * Pure input rules, kept free of server-only imports so the form component can
 * share the limit without pulling the note store into the client bundle.
 */

export const NOTE_MAX_LENGTH = 140;

export type Note = {
  readonly id: string;
  readonly text: string;
  readonly createdAt: string;
};

export type NoteValidation = { ok: true; text: string } | { ok: false; error: string };

/** The trust boundary: form data is untrusted until it has been through here. */
export function validateNoteText(value: FormDataEntryValue | null): NoteValidation {
  if (typeof value !== "string") {
    return { ok: false, error: "A note is required." };
  }

  const text = value.trim();

  if (text.length === 0) {
    return { ok: false, error: "A note cannot be empty." };
  }

  if (text.length > NOTE_MAX_LENGTH) {
    return { ok: false, error: `A note cannot exceed ${NOTE_MAX_LENGTH} characters.` };
  }

  return { ok: true, text };
}

export type NoteFormState = {
  readonly status: "idle" | "success" | "error";
  readonly message: string;
};

/**
 * Lives here rather than beside the action: a "use server" file may only
 * export async functions, so a plain object would break the build.
 */
export const INITIAL_NOTE_FORM_STATE: NoteFormState = { status: "idle", message: "" };

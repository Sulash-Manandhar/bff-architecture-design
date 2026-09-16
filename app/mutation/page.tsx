import { DemoHeader } from "@/app/(demo)/demo-header";
import { NoteForm } from "@/app/(demo)/note-form";
import { routeMetadata } from "@/lib/metadata";
import { listNotes } from "@/lib/notes";

export const metadata = routeMetadata("/mutation");

export default async function MutationPage() {
  const notes = await listNotes();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:py-16">
      <DemoHeader eyebrow="Mutation" title="Write through a server action">
        The form posts to a <code className="font-mono text-xs">&quot;use server&quot;</code>{" "}
        function — no endpoint, no fetch, and it works before hydration. The action validates the
        input, writes, then calls <code className="font-mono text-xs">updateTag(&quot;notes&quot;)</code>{" "}
        so the cached list below expires immediately and your own note is there when the page
        re-renders.
      </DemoHeader>

      <section className="mt-10 rounded-xl border border-border bg-surface p-5">
        <NoteForm />
      </section>

      <section className="mt-6 flex flex-col gap-3">
        {notes.map((note) => (
          <article key={note.id} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-sm leading-snug">{note.text}</p>
            <p className="mt-2 font-mono text-[11px] text-muted">{note.createdAt}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

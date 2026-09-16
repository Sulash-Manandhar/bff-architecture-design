import Link from "next/link";
import type { ReactNode } from "react";

export function DemoHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <Link href="/" className="font-mono text-xs text-muted transition-colors hover:text-accent">
        ← Back
      </Link>

      <header className="mt-6 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <div className="mt-4 text-sm leading-relaxed text-muted">{children}</div>
      </header>
    </>
  );
}

export type FlowStep = {
  readonly label: string;
  readonly sublabel: string;
  readonly detail: string;
};

export function FlowDiagram({ steps }: { steps: readonly FlowStep[] }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3">
      {steps.map((step, index) => (
        <div key={step.label} className="contents">
          {index > 0 && (
            <div aria-hidden className="flex items-center justify-center text-muted sm:px-1">
              <span className="hidden sm:inline">→</span>
              <span className="sm:hidden">↓</span>
            </div>
          )}

          <article className="flex-1 rounded-xl border border-border bg-surface p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold">{step.label}</h3>
              <code className="font-mono text-[11px] text-muted">{step.sublabel}</code>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">{step.detail}</p>
          </article>
        </div>
      ))}
    </div>
  );
}

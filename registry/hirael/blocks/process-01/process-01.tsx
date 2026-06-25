import { Terminal, FileCode2, Rocket, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Step = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const STEPS: readonly Step[] = [
  {
    icon: Terminal,
    title: "Run one command",
    body: "Point the shadcn CLI at any Hirael item. It resolves the registry and writes the source straight into your repo.",
  },
  {
    icon: FileCode2,
    title: "Own the source",
    body: "The component lands as plain TSX in your components folder. No package pin, no version drift, yours to edit.",
  },
  {
    icon: Rocket,
    title: "Compose and ship",
    body: "Build with the compound parts, restyle against your own tokens, and deploy. Nothing phones home.",
  },
];

export default function Process01() {
  return (
    <section data-slot="process" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
        <div className="flex max-w-2xl flex-col gap-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            how it works
          </span>
          <h2 className="font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl">
            From install to shipped in three steps.
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Hirael rides the shadcn CLI you already use. No new tooling, no
            runtime to learn.
          </p>
        </div>

        <ol
          data-slot="process-steps"
          className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6"
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const last = i === STEPS.length - 1;
            return (
              <li
                key={step.title}
                data-slot="process-step"
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-card">
                    <Icon className="size-5" />
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "h-px flex-1 bg-border",
                      last ? "hidden" : "hidden sm:block",
                    )}
                  />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

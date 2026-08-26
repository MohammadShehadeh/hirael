import { Check, Minus } from "lucide-react";

import { Button } from "@/registry/hirael/ui/button";

const HIRAEL = [
  "Source copied straight into your repo",
  "No runtime package and no version pin",
  "Compound parts with data-slot styling hooks",
  "RTL and light or dark theming built in",
  "Edit, extend, or delete any line, it is yours",
] as const;

const USUAL = [
  "A black-box dependency you cannot edit",
  "Locked to the maintainer's release cadence",
  "Restyling fights the library's internals",
  "RTL and theming bolted on after the fact",
  "Fork or eject the moment you outgrow it",
] as const;

const Comparison01 = () => {
  return (
    <section data-slot="comparison" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-4xl px-6 md:px-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            comparison
          </span>
          <h2 className="max-w-2xl font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl">
            The difference is ownership.
          </h2>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Same install command you already use, a very different relationship
            with the code it leaves behind.
          </p>
        </div>

        <div
          data-slot="comparison-grid"
          className="relative mt-12 grid overflow-hidden rounded-xl border border-border md:grid-cols-2"
          style={{
            boxShadow:
              "0 24px 60px -34px color-mix(in oklch, var(--foreground) 22%, transparent)",
          }}
        >
          <span
            aria-hidden
            className="absolute start-1/2 top-1/2 z-20 hidden size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border bg-background font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground shadow-sm md:grid rtl:translate-x-1/2"
          >
            vs
          </span>

          <div
            data-slot="comparison-ours"
            className="relative border-b border-border bg-card p-7 sm:p-8 md:border-b-0 md:border-e"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(110% 80% at 50% 0%, color-mix(in oklch, var(--primary) 11%, transparent), transparent 62%)",
              }}
            />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  with hirael
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.01em]">
                  Code you keep
                </h3>
              </div>
              <ul className="flex flex-col gap-3.5">
                {HIRAEL.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span
                      className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border"
                      style={{
                        borderColor:
                          "color-mix(in oklch, var(--primary) 30%, transparent)",
                        backgroundColor:
                          "color-mix(in oklch, var(--primary) 12%, transparent)",
                      }}
                    >
                      <Check className="size-3 text-foreground" />
                    </span>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-1 w-full sm:w-auto">
                <a href="#">Browse the registry</a>
              </Button>
            </div>
          </div>

          <div data-slot="comparison-theirs" className="bg-muted/20 p-7 sm:p-8">
            <div className="flex flex-col gap-6 opacity-80">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  the usual way
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-muted-foreground">
                  Code you rent
                </h3>
              </div>
              <ul className="flex flex-col gap-3.5">
                {USUAL.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-border">
                      <Minus className="size-3 text-muted-foreground/60" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison01;

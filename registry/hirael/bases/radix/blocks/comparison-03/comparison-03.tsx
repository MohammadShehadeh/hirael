import { ArrowRight, Check, CircleAlert, CircleCheck, Minus } from 'lucide-react';

import { Button } from '@/registry/hirael/bases/radix/ui/button';

const BEFORE = [
  'A combobox lives in three components, each with its own keyboard handling',
  'Right-to-left is a ticket nobody wants to pick up',
  'The dark theme was derived from light, so half of it is grey on grey',
  'Every design tweak means reading someone else’s node_modules',
] as const;

const AFTER = [
  'One compound API, the same shape as the primitives you already use',
  'Logical properties throughout, so right-to-left needs no configuration',
  'Light and dark drawn as two designs, not one and its inverse',
  'The file is in your repo, so a tweak is an edit',
] as const;

const OUTCOMES = [
  { value: 'One command', label: 'from decision to working component' },
  { value: '2 bases', label: 'Radix and Base UI, kept in step' },
  { value: '0 packages', label: 'added to your dependency tree' },
] as const;

const Comparison03 = () => {
  return (
    <section className="bg-background py-20 sm:py-28" aria-labelledby="comparison-03-heading">
      <div className="container w-full max-w-5xl">
        <div className="max-w-2xl">
          <p className="text-xs uppercase text-muted-foreground">Before and after</p>
          <h2 id="comparison-03-heading" className="mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            The same afternoon, spent two ways
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
          <div className="bg-background p-7 sm:p-8">
            <div className="flex items-center gap-2">
              <CircleAlert aria-hidden className="size-4 text-muted-foreground" />
              <h3 className="text-xs uppercase text-muted-foreground">Writing it yourself</h3>
            </div>
            <ul className="mt-6 flex flex-col gap-4">
              {BEFORE.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                  <Minus aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />
                  <span className="line-through decoration-muted-foreground/30">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card p-7 sm:p-8">
            <div className="flex items-center gap-2">
              <CircleCheck aria-hidden className="size-4" />
              <h3 className="text-xs uppercase">Installing it from Hirael</h3>
            </div>
            <ul className="mt-6 flex flex-col gap-4">
              {AFTER.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
            {OUTCOMES.map((outcome) => (
              <div key={outcome.value} className="flex items-baseline gap-2">
                <dt className="text-xs text-muted-foreground">{outcome.label}</dt>
                <dd className="order-first font-mono text-sm font-semibold tracking-tight">{outcome.value}</dd>
              </div>
            ))}
          </dl>
          <Button variant="outline" className="group">
            See what ships
            <ArrowRight className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Comparison03;

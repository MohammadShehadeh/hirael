import { InlineCodeBlock } from '@/components/code-block';
import { SectionLabel } from '@/components/page-header';
import { highlightCode } from '@/lib/highlight';

const COMPOSE_SNIPPET = `import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectTrigger,
} from "@/components/multi-select"

<MultiSelect value={value} onValueChange={setValue} options={options}>
  <MultiSelectTrigger placeholder="Pick…" />
  <MultiSelectContent searchPlaceholder="Filter…" />
</MultiSelect>`;

export const Composition = async () => {
  const html = await highlightCode(COMPOSE_SNIPPET, 'tsx');

  return (
    <section className="flex flex-col gap-5 border-t border-border pt-10">
      <SectionLabel>Composition (the shadcn way)</SectionLabel>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Every compound component ships as flat top-level exports, no namespacing, no convenience wrappers. The bare name
        is the root primitive and holds state; every rendered piece carries a
        <code className="mx-1 rounded-sm bg-muted px-1 py-0.5 text-foreground">data-slot</code>
        attribute for downstream styling.
      </p>
      <InlineCodeBlock code={COMPOSE_SNIPPET} html={html} />
    </section>
  );
};

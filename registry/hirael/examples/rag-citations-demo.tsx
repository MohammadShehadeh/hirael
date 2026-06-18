"use client";

import {
  RagCitations,
  RagCitationsAnswer,
  RagCitationMark,
  RagCitationsSources,
  RagCitationSource,
  RagCitationSourceTitle,
  RagCitationSourceSnippet,
  RagCitationSourceUrl,
  RagCitationScore,
} from "@/registry/hirael/ui/rag-citations";

export default function RagCitationsDemo() {
  return (
    <div className="grid w-full max-w-xl gap-8">
      <RagCitations>
        <RagCitationsAnswer>
          <p>
            The library ships about 70 components and 40 section blocks
            <RagCitationMark index={1} />. Everything installs through the
            shadcn registry, so the source lands in your repo instead of a
            package
            <RagCitationMark index={2} />. The whole site is a static export
            with no server at runtime
            <RagCitationMark index={3} />.
          </p>
        </RagCitationsAnswer>

        <RagCitationsSources>
          <RagCitationSource index={1}>
            <RagCitationSourceTitle>Catalog overview</RagCitationSourceTitle>
            <RagCitationSourceSnippet>
              Around 70 React components, 40 blocks, and full-page templates,
              grouped by category.
            </RagCitationSourceSnippet>
            <RagCitationSourceUrl href="#">
              hirael.com/docs/catalog
            </RagCitationSourceUrl>
          </RagCitationSource>

          <RagCitationSource index={2}>
            <RagCitationSourceTitle>Install with shadcn</RagCitationSourceTitle>
            <RagCitationSourceSnippet>
              Run npx shadcn add to copy a component into your codebase. There
              is no runtime dependency.
            </RagCitationSourceSnippet>
            <RagCitationSourceUrl href="#">
              hirael.com/docs/install
            </RagCitationSourceUrl>
          </RagCitationSource>

          <RagCitationSource index={3}>
            <RagCitationSourceTitle>Static export</RagCitationSourceTitle>
            <RagCitationSourceSnippet>
              The showcase builds to plain HTML. Data is fetched once at build
              time and frozen into the output.
            </RagCitationSourceSnippet>
            <RagCitationSourceUrl href="#">
              hirael.com/docs/architecture
            </RagCitationSourceUrl>
          </RagCitationSource>
        </RagCitationsSources>
      </RagCitations>

      <RagCitations>
        <RagCitationsAnswer className="text-base">
          <p>
            Components are built compound-first
            <RagCitationMark index={1} /> and styled with design tokens, so
            light and dark both work without extra setup
            <RagCitationMark index={2} />.
          </p>
        </RagCitationsAnswer>

        <RagCitationsSources className="gap-3">
          <RagCitationSource index={1} className="bg-muted/30">
            <RagCitationSourceTitle className="flex items-center justify-between gap-2">
              Compound API
              <RagCitationScore score="0.94" />
            </RagCitationSourceTitle>
            <RagCitationSourceSnippet className="line-clamp-none">
              A flat set of composable parts. The root holds state, the parts
              render the slots.
            </RagCitationSourceSnippet>
            <RagCitationSourceUrl href="#">
              hirael.com/docs/conventions
            </RagCitationSourceUrl>
          </RagCitationSource>

          <RagCitationSource index={2} className="bg-muted/30">
            <RagCitationSourceTitle className="flex items-center justify-between gap-2">
              Design tokens
              <RagCitationScore score="0.88" />
            </RagCitationSourceTitle>
            <RagCitationSourceSnippet className="line-clamp-none">
              Color comes from CSS variables, never hard-coded values, so themes
              stay consistent.
            </RagCitationSourceSnippet>
            <RagCitationSourceUrl href="#">
              hirael.com/docs/design
            </RagCitationSourceUrl>
          </RagCitationSource>
        </RagCitationsSources>
      </RagCitations>
    </div>
  );
}

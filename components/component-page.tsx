"use client";

import * as React from "react";
import { CircleAlert, Hash } from "lucide-react";
import { DirectionProvider as BaseDirectionProvider } from "@base-ui/react/direction-provider";

import { BlockViewer } from "@/components/block-viewer";
import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import {
  CodeBlock,
  InlineCodeBlock,
  type CodeBlockTab,
} from "@/components/code-block";
import { DirectionToggle } from "@/components/direction-toggle";
import { InstallBlock } from "@/components/install-block";
import { CopyPageButton } from "@/components/copy-page-button";
import { Pager } from "@/components/pager";
import { SectionLabel } from "@/components/page-header";
import { SegmentedControl } from "@/components/segmented-control";
import { Toc, TocChips, type TocItem } from "@/components/toc";
import { GithubIcon } from "@/components/github-link";
import { DemoLocaleProvider } from "@/lib/demo-locale";
import { SITE } from "@/lib/site";
import { DirectionProvider } from "@/registry/hirael/ui/direction";
import { RegistryExample } from "@/registry/hirael/registry-demos";
import { Button } from "@/registry/hirael/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/hirael/ui/table";
import {
  entryEmbedHref,
  entryHref,
  entrySiblings,
  type RegistryEntryMeta,
} from "@/registry/hirael/registry-meta";

export interface SourceFile {
  code: string;
  html: string;
  lang: string;}

export interface ApiProp {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string | null;
  /** Pre-highlighted inline HTML (VSCode token colors) for `type` / `default`. */
  typeHtml?: string;
  defaultHtml?: string | null;}

export interface ApiPart {
  name: string;
  props: ApiProp[];
  extendsNative: boolean;}

/** A single example a component showcases — its slug, label and source. */
export interface ExampleEntry {
  slug: string;
  title: string;
  source: SourceFile | null;}

export const ComponentPage = ({
  entry,
  source,
  examples,
  api,
  usage,
  breadcrumb,
}: {
  entry: RegistryEntryMeta;
  /** Pre-highlighted install source files, keyed by repo-relative path. */
  source: Record<string, SourceFile>;
  /** Component examples, each with pre-highlighted source. Composite items pass none. */
  examples?: ExampleEntry[];
  /** Highlighted import snippet for the installed file. Components only. */
  usage?: SourceFile | null;
  /** Extracted per-part props tables (registry-props.json). */
  api?: ApiPart[] | null;
  /** Hierarchy trail shown above the header for navigation. */
  breadcrumb?: Crumb[];
}) => {
  const isComposite =
    entry.category === "blocks" || entry.category === "templates";
  // Multi-file items (composites, or a component that ships a folder of parts
  // like the data table) show their install tree; single files stay flat.
  const treeView = isComposite || (entry.files ?? []).length > 1;
  const embedHref = entryEmbedHref(entry);

  const codeTabs: CodeBlockTab[] = (entry.files ?? [])
    .map((f) => {
      const file = source[f.path];
      if (!file) return null;
      const label = treeView ? (f.target ?? f.path) : f.path;
      return { label, code: file.code, html: file.html };
    })
    .filter((t): t is CodeBlockTab => t !== null);

  const exampleList = examples ?? [];
  const registryDeps = entry.registryDependencies ?? [];
  const npmDeps = entry.dependencies ?? [];

  // One descriptor list drives both the rendered sections and the "On this
  // page" rail, so the two can never drift. Order mirrors shadcn/ui's docs:
  // the showcase first, then how to install it, then the reference material.
  const sections: PageSection[] = [];

  if (isComposite) {
    sections.push({
      id: "preview",
      label: "Preview",
      content: <BlockViewer title={entry.title} embedHref={embedHref} />,
    });
  } else {
    sections.push({
      id: "examples",
      label: exampleList.length > 1 ? "Examples" : "Example",
      content: (
        <div className="flex flex-col gap-8">
          {exampleList.map((example) => (
            <ExampleBlock
              key={example.slug}
              example={example}
              showTitle={exampleList.length > 1}
            />
          ))}
        </div>
      ),
    });
  }

  sections.push({
    id: "installation",
    label: "Installation",
    content: <InstallBlock name={entry.name} />,
  });

  if (!isComposite && usage) {
    sections.push({
      id: "usage",
      label: "Usage",
      content: (
        <div className="flex flex-col gap-3">
          <InlineCodeBlock code={usage.code} html={usage.html} />
          <p className="text-xs text-muted-foreground">
            Paths assume the default <code className="font-mono">@/</code> alias
            from your <code className="font-mono">components.json</code>. The
            example above shows the parts composed.
          </p>
        </div>
      ),
    });
  }

  if (!isComposite && api?.length) {
    sections.push({
      id: "api",
      label: "API",
      content: <ApiPanel parts={api} />,
    });
  }

  if (codeTabs.length > 0) {
    sections.push(
      isComposite
        ? {
            id: "code",
            label: "Code",
            content: <CodeBlock tabs={codeTabs} layout="tree" />,
          }
        : {
            id: "component-source",
            label: "Component source",
            content: (
              <CodeBlock
                tabs={codeTabs}
                layout={treeView ? "tree" : "tabs"}
                collapsible
              />
            ),
          },
    );
  }

  if (registryDeps.length || npmDeps.length) {
    sections.push({
      id: "dependencies",
      label: "Dependencies",
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          {registryDeps.length > 0 && (
            <DepGroup title="shadcn registry" deps={registryDeps} />
          )}
          {npmDeps.length > 0 && <DepGroup title="npm" deps={npmDeps} />}
        </div>
      ),
    });
  }

  const tocItems: TocItem[] = sections.map(({ id, label }) => ({ id, label }));
  const { prev, next } = entrySiblings(entry);
  const sourceUrl = githubSourceUrl(entry);
  const issueUrl = `${SITE.githubRepoUrl}/issues/new?title=${encodeURIComponent(`[${entry.name}] `)}`;

  return (
    <div className="container py-10 sm:py-12 md:py-16">
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-10">
        <div className="flex min-w-0 flex-col gap-10 sm:gap-12">
      <header className="flex flex-col gap-3 border-b border-border pb-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          {breadcrumb ? (
            <Breadcrumbs items={breadcrumb} />
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {entry.category}
              </span>
              {entry.blockKind && (
                <>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    ·
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
                    {entry.blockKind}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Page-level actions sit with the breadcrumbs, clear of the
              description below — a toolbar, not a footnote. */}
          <div className="flex items-center gap-0.5 flex-wrap justify-start">
            {sourceUrl && (
              <HeaderAction
                href={sourceUrl}
                title="View source on GitHub"
                icon={<GithubIcon />}
              >
                Source
              </HeaderAction>
            )}
            <HeaderAction
              href={issueUrl}
              title="Open a GitHub issue"
              icon={<CircleAlert />}
            >
              Report issue
            </HeaderAction>
            <CopyPageButton
              input={{
                name: entry.name,
                title: entry.title,
                description: entry.description,
                url: `${SITE.url}${entryHref(entry)}`,
                isComposite,
                usage,
                examples,
                api,
                source,
                files: entry.files ?? [],
              }}
            />
          </div>
        </div>

        <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl">
          {entry.title}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {entry.description}
        </p>
      </header>

          <TocChips items={tocItems} className="xl:hidden" />

          {sections.map((section) => (
            <Section key={section.id} id={section.id} label={section.label}>
              {section.content}
            </Section>
          ))}

          <Pager prev={prev} next={next} />
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <Toc items={tocItems} />
          </div>
        </aside>
      </div>
    </div>
  );
};

interface PageSection { id: string; label: string; content: React.ReactNode}

const githubSourceUrl = (entry: RegistryEntryMeta) => {
  const files = entry.files ?? [];
  const primary = files[0]?.path;
  if (!primary) return null;
  if (files.length === 1) return `${SITE.githubRepoUrl}/blob/main/${primary}`;
  const dir = primary.slice(0, primary.lastIndexOf("/"));
  return `${SITE.githubRepoUrl}/tree/main/${dir}`;
};

const HeaderAction = ({
  href,
  title,
  icon,
  children,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
    >
      <a href={href} target="_blank" rel="noreferrer noopener" title={title}>
        {icon}
        {children}
      </a>
    </Button>
  );
};

const Section = ({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-4">
      <a
        href={`#${id}`}
        className="group/anchor inline-flex w-fit items-center gap-1.5"
        aria-label={`${label} section`}
      >
        <SectionLabel>{label}</SectionLabel>
        <Hash
          className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover/anchor:opacity-100"
          aria-hidden
        />
      </a>
      {children}
    </section>
  );
};

/** One example: a preview ↔ code toggle (with an RTL toggle on the preview). */
const ExampleBlock = ({
  example,
  showTitle,
}: {
  example: ExampleEntry;
  showTitle: boolean;
}) => {
  const [view, setView] = React.useState<"preview" | "code">("preview");
  const [rtl, setRtl] = React.useState(false);
  const hasCode = !!example.source;

  return (
    <section data-slot="example" className="flex flex-col gap-3">
      {showTitle && (
        <h3 className="text-sm font-medium tracking-[-0.01em]">
          {example.title}
        </h3>
      )}
      <div className="relative overflow-hidden rounded-md border border-border">
        <div className="flex items-center justify-between gap-2 border-b border-border/70 bg-card/40 px-3 py-2">
          <SegmentedControl
            role="tab"
            ariaLabel="Example view"
            value={view}
            onValueChange={(v) => setView(v as "preview" | "code")}
            className="rounded-md border border-border/70 bg-card/30 p-0.5"
            itemClassName="rounded-sm px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
            items={[
              { value: "preview", label: "preview" },
              {
                value: "code",
                label: "code",
                disabled: !hasCode,
                title: hasCode ? undefined : "No example source for this item",
              },
            ]}
          />
          {view === "preview" && (
            <DirectionToggle rtl={rtl} onToggle={setRtl} />
          )}
        </div>

        {view === "preview" ? (
          <div
            dir={rtl ? "rtl" : undefined}
            data-customizer-scope=""
            className="bg-dot-grid flex min-h-90 items-center justify-center p-6 sm:min-h-105 sm:p-8 md:p-10"
          >
            {/* Radix + Base UI direction providers cross React portals, so
                dropdown/popover content (which portals to <body>, outside this
                dir wrapper) still renders RTL. Remount on direction change so
                locale-derived initial state re-seeds in the active language. */}
            <DirectionProvider dir={rtl ? "rtl" : "ltr"}>
              <BaseDirectionProvider direction={rtl ? "rtl" : "ltr"}>
                <DemoLocaleProvider locale={rtl ? "ar" : "en"}>
                  <RegistryExample
                    key={rtl ? "ar" : "en"}
                    name={example.slug}
                  />
                </DemoLocaleProvider>
              </BaseDirectionProvider>
            </DirectionProvider>
          </div>
        ) : example.source ? (
          <CodeBlock
            tabs={[
              {
                label: `${example.slug}.tsx`,
                code: example.source.code,
                html: example.source.html,
              },
            ]}
          />
        ) : null}
      </div>
    </section>
  );
};

const DepGroup = ({ title, deps }: { title: string; deps: string[] }) => {
  return (
    <div className="rounded-sm border border-border bg-card p-4">
      <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {deps.map((d) => (
          <span
            key={d}
            className="rounded-sm border border-border px-1.5 py-0 font-mono text-[10px] uppercase tracking-[0.06em]"
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
};

const API_TH =
  "px-4 py-2 text-start font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-muted-foreground";

const ApiPanel = ({ parts }: { parts: ApiPart[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {parts.map((part) => (
        <section
          key={part.name}
          className="overflow-hidden rounded-sm border border-border bg-card"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-4 py-2.5">
            <h3 className="font-mono text-xs text-foreground">
              {`<${part.name} />`}
            </h3>
            {part.extendsNative && (
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                + native element props
              </span>
            )}
          </div>
          {part.props.length ? (
            <Table>
              <TableHeader className="sticky top-14 z-10 bg-card">
                <TableRow>
                  <TableHead className={API_TH}>Prop</TableHead>
                  <TableHead className={API_TH}>Type</TableHead>
                  <TableHead className={API_TH}>Default</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {part.props.map((prop) => (
                  <TableRow key={prop.name} className="align-top">
                    <TableCell className="px-4 py-2.5 whitespace-normal">
                      <code className="font-mono text-xs text-foreground">
                        {prop.name}
                        {prop.required && (
                          <span className="text-destructive" title="Required">
                            *
                          </span>
                        )}
                      </code>
                      {prop.description && (
                        <p className="mt-1 max-w-[32ch] text-xs text-muted-foreground">
                          {prop.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 whitespace-normal">
                      {prop.typeHtml ? (
                        <code
                          className="shiki-inline font-mono text-xs"
                          dangerouslySetInnerHTML={{ __html: prop.typeHtml }}
                        />
                      ) : (
                        <code className="font-mono text-xs text-muted-foreground">
                          {prop.type}
                        </code>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 whitespace-normal font-mono text-xs text-muted-foreground">
                      {prop.defaultHtml ? (
                        <code
                          className="shiki-inline"
                          dangerouslySetInnerHTML={{ __html: prop.defaultHtml }}
                        />
                      ) : (
                        (prop.default ?? "—")
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="px-4 py-3 text-xs text-muted-foreground">
              {part.extendsNative
                ? "No props of its own; forwards everything to the underlying element."
                : "No configurable props."}
            </p>
          )}
        </section>
      ))}
    </div>
  );
};

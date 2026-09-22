'use client';

import * as React from 'react';
import { CircleAlert, Hash } from 'lucide-react';

import { BlockViewer } from '@/components/block-viewer';
import { Breadcrumbs, type Crumb } from '@/components/breadcrumbs';
import { CodeBlock, InlineCodeBlock, type CodeBlockTab } from '@/components/code-block';
import { useRegistryBase } from '@/components/active-theme';
import { DirectionToggle } from '@/components/direction-toggle';
import { InstallBlock } from '@/components/install-block';
import { CopyPageButton } from '@/components/copy-page-button';
import { NewBadge } from '@/components/new-badge';
import { Pager } from '@/components/pager';
import { SectionLabel } from '@/components/page-header';
import { ItemCards } from '@/components/item-cards';
import {
  PreviewFrame,
  PreviewMoreMenu,
  PreviewOpenButton,
  PreviewRefreshButton,
  PreviewThemeButton,
  previewSrc,
  usePreviewTheme,
} from '@/components/preview-frame';
import { SegmentedControl } from '@/components/segmented-control';
import { SponsorsCard } from '@/components/sponsors-card';
import { Toc, TocChips, type TocItem } from '@/components/toc';
import { GithubIcon } from '@/components/github-link';
import { formatDay, type DetailExtras } from '@/lib/freshness';
import { SITE } from '@/lib/site';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/hirael/bases/radix/ui/table';
import {
  entrySiblings,
  exampleEmbedHref,
  registryFilePath,
  type RegistryBase,
  type RegistryEntryMeta,
} from '@/registry/hirael/registry-meta';

export interface SourceFile {
  code: string;
  html: string;
  lang: string;
}

export interface ApiProp {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string | null;
  typeHtml?: string;
  defaultHtml?: string | null;
}

export interface ApiPart {
  name: string;
  props: ApiProp[];
  extendsNative: boolean;
}

export interface ExampleEntry {
  slug: string;
  title: string;
  source: SourceFile | null;
}

export interface ExampleSources {
  slug: string;
  title: string;
  sources: Record<RegistryBase, SourceFile | null>;
}

export interface ComponentPageProps {
  entry: RegistryEntryMeta;
  sources: Record<RegistryBase, Record<string, SourceFile>>;
  examples?: ExampleSources[];
  usage?: SourceFile | null;
  api?: ApiPart[] | null;
  breadcrumb?: Crumb[];
  extras?: DetailExtras;
}

export const ComponentPage = ({ entry, sources, examples, api, usage, breadcrumb, extras }: ComponentPageProps) => {
  const isComposite = entry.category === 'blocks' || entry.category === 'templates';
  const treeView = isComposite || (entry.files ?? []).length > 1;
  const base = useRegistryBase();
  const source = sources[base];

  const codeTabs: CodeBlockTab[] = (entry.files ?? [])
    .map((f) => {
      const file = source[f.path];
      if (!file) return null;
      const label = treeView ? (f.target ?? f.path) : f.path;
      return { label, code: file.code, html: file.html };
    })
    .filter((t): t is CodeBlockTab => t !== null);

  const exampleList: ExampleEntry[] = (examples ?? []).map((example) => ({
    slug: example.slug,
    title: example.title,
    source: example.sources[base],
  }));
  const registryDeps = entry.registryDependencies ?? [];
  const npmDeps = entry.dependencies ?? [];

  const sections: PageSection[] = [];

  if (isComposite) {
    sections.push({
      id: 'preview',
      label: 'Preview',
      content: <BlockViewer entry={entry} />,
    });
  } else {
    sections.push({
      id: 'examples',
      label: exampleList.length > 1 ? 'Examples' : 'Example',
      content: (
        <div className="flex flex-col gap-8">
          {exampleList.map((example) => (
            <ExampleBlock key={example.slug} entry={entry} example={example} showTitle={exampleList.length > 1} />
          ))}
        </div>
      ),
    });
  }

  sections.push({
    id: 'installation',
    label: 'Installation',
    content: <InstallBlock name={entry.name} />,
  });

  if (!isComposite && usage) {
    sections.push({
      id: 'usage',
      label: 'Usage',
      content: (
        <div className="flex flex-col gap-3">
          <InlineCodeBlock code={usage.code} html={usage.html} />
          <p className="text-xs text-muted-foreground">
            Paths assume the default <code className="font-mono">@/</code> alias from your{' '}
            <code className="font-mono">components.json</code>. The example above shows the parts composed.
          </p>
        </div>
      ),
    });
  }

  if (!isComposite && api?.length) {
    sections.push({
      id: 'api',
      label: 'API',
      content: <ApiPanel parts={api} />,
    });
  }

  if (codeTabs.length > 0) {
    sections.push(
      isComposite
        ? {
            id: 'code',
            label: 'Code',
            content: <CodeBlock tabs={codeTabs} layout="tree" />,
          }
        : {
            id: 'component-source',
            label: 'Component source',
            content: <CodeBlock tabs={codeTabs} layout={treeView ? 'tree' : 'tabs'} collapsible />,
          },
    );
  }

  if (registryDeps.length || npmDeps.length) {
    sections.push({
      id: 'dependencies',
      label: 'Dependencies',
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          {registryDeps.length > 0 && <DepGroup title="shadcn registry" deps={registryDeps} />}
          {npmDeps.length > 0 && <DepGroup title="npm" deps={npmDeps} />}
        </div>
      ),
    });
  }

  const related = extras?.related ?? [];
  if (related.length > 0) {
    sections.push({
      id: 'related',
      label: 'Related',
      content: <ItemCards items={related} />,
    });
  }

  const tocItems: TocItem[] = sections.map(({ id, label }) => ({ id, label }));
  const { prev, next } = entrySiblings(entry);
  const sourceUrl = githubSourceUrl(entry, base);
  const issueUrl = `${SITE.githubRepoUrl}/issues/new?title=${encodeURIComponent(`[${entry.name}] `)}`;

  return (
    <div className="docs-container py-10 sm:py-12 md:py-14">
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-10">
        <div className="flex min-w-0 flex-col gap-10 sm:gap-12">
          <header className="flex flex-col gap-4">
            {breadcrumb ? (
              <Breadcrumbs items={breadcrumb} />
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase text-muted-foreground">{entry.category}</span>
                {entry.blockKind && (
                  <>
                    <span className="text-xs text-muted-foreground">/</span>
                    <span className="text-xs uppercase text-foreground">{entry.blockKind}</span>
                  </>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight text-balance md:text-4xl">
                  {entry.title}
                </h1>
                <NewBadge addedAt={extras?.addedAt} />
              </div>
              <div className="flex flex-wrap items-center gap-0.5">
                {sourceUrl && (
                  <HeaderAction href={sourceUrl} title="View source on GitHub" icon={<GithubIcon />}>
                    Source
                  </HeaderAction>
                )}
                <HeaderAction href={issueUrl} title="Open a GitHub issue" icon={<CircleAlert />}>
                  Report issue
                </HeaderAction>
                <CopyPageButton name={entry.name} title={entry.title} />
              </div>
            </div>

            <p className="max-w-xl text-base text-pretty text-muted-foreground md:text-lg">{entry.description}</p>
          </header>

          <TocChips items={tocItems} className="xl:hidden" />

          {sections.map((section) => (
            <Section key={section.id} id={section.id} label={section.label}>
              {section.content}
            </Section>
          ))}

          <Pager prev={prev} next={next} />

          {extras?.addedAt && (
            <p className="text-xs uppercase text-muted-foreground">
              Shipped <time dateTime={extras.addedAt}>{formatDay(extras.addedAt)}</time>
            </p>
          )}
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-16 flex flex-col gap-8">
            <Toc items={tocItems} />
            <SponsorsCard />
          </div>
        </aside>
      </div>
    </div>
  );
};

interface PageSection {
  id: string;
  label: string;
  content: React.ReactNode;
}

const githubSourceUrl = (entry: RegistryEntryMeta, base: RegistryBase) => {
  const files = entry.files ?? [];
  const primary = files[0]?.path;
  if (!primary) return null;
  const repoPath = registryFilePath(base, primary);
  if (files.length === 1) return `${SITE.githubRepoUrl}/blob/main/${repoPath}`;
  const dir = repoPath.slice(0, repoPath.lastIndexOf('/'));
  return `${SITE.githubRepoUrl}/tree/main/${dir}`;
};

interface HeaderActionProps {
  href: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const HeaderAction = ({ href, title, icon, children }: HeaderActionProps) => {
  return (
    <Button asChild variant="ghost" size="sm">
      <a href={href} target="_blank" rel="noreferrer noopener" title={title}>
        {icon}
        {children}
      </a>
    </Button>
  );
};

interface SectionProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

const Section = ({ id, label, children }: SectionProps) => {
  return (
    <section id={id} className="flex scroll-mt-16 flex-col gap-4">
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

interface ExampleBlockProps {
  entry: RegistryEntryMeta;
  example: ExampleEntry;
  showTitle: boolean;
}

// Same floor as the embed shell.
const EXAMPLE_MIN_HEIGHT = 360;
const EXAMPLE_MAX_HEIGHT = 1200;

// Framed because a theme or direction class on this page can't reach dialogs and popovers that portal out.
const ExampleBlock = ({ entry, example, showTitle }: ExampleBlockProps) => {
  const [view, setView] = React.useState<'preview' | 'code'>('preview');
  const [isRtl, setIsRtl] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const previewTheme = usePreviewTheme();
  const base = useRegistryBase();
  const hasCode = !!example.source;
  const src = previewSrc(exampleEmbedHref(entry, example.slug, base), { theme: previewTheme.previewMode, isRtl });

  return (
    <section data-slot="example" className="flex flex-col gap-3">
      {showTitle && <h3 className="text-sm font-medium tracking-[-0.01em]">{example.title}</h3>}
      <div className="relative overflow-hidden rounded-md border border-border">
        <div className="flex items-center justify-between gap-2 border-b border-border/70 bg-card/40 px-3 py-2">
          <SegmentedControl
            role="tab"
            ariaLabel="Example view"
            value={view}
            onValueChange={(v) => setView(v as 'preview' | 'code')}
            className="rounded-md border border-border/70 bg-card/30 p-0.5"
            itemClassName="rounded-sm px-2.5 py-1 text-xs uppercase"
            items={[
              { value: 'preview', label: 'preview' },
              {
                value: 'code',
                label: 'code',
                disabled: !hasCode,
                title: hasCode ? undefined : 'No example source for this item',
              },
            ]}
          />
          {view === 'preview' && (
            <div className="flex items-center gap-1">
              <DirectionToggle pressed={isRtl} onPressedChange={setIsRtl} className="me-1" />
              <PreviewThemeButton theme={previewTheme} />
              <PreviewRefreshButton onRefresh={() => setRefreshKey((k) => k + 1)} />
              <PreviewOpenButton href={src} />
              <PreviewMoreMenu entry={entry} />
            </div>
          )}
        </div>

        {view === 'preview' ? (
          <PreviewFrame
            src={src}
            title={`${entry.title} ${example.title.toLowerCase()} preview`}
            refreshKey={refreshKey}
            initialHeight={EXAMPLE_MIN_HEIGHT}
            minHeight={EXAMPLE_MIN_HEIGHT}
            maxHeight={EXAMPLE_MAX_HEIGHT}
            className="w-full"
          />
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

interface DepGroupProps {
  title: string;
  deps: string[];
}

const DepGroup = ({ title, deps }: DepGroupProps) => {
  return (
    <div className="rounded-sm border border-border bg-card p-4">
      <h3 className="mb-2 text-xs uppercase text-muted-foreground">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {deps.map((d) => (
          <span key={d} className="rounded-sm border border-border px-1.5 py-0 text-xs uppercase">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
};

const API_TH = 'px-4 py-2 text-start';
const API_TH_LABEL = 'text-xs font-normal uppercase text-muted-foreground';

interface ApiPanelProps {
  parts: ApiPart[];
}

const ApiPanel = ({ parts }: ApiPanelProps) => {
  return (
    <div className="flex flex-col gap-4">
      {parts.map((part) => (
        <section key={part.name} className="overflow-hidden rounded-sm border border-border bg-card">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-4 py-2.5">
            <h3 className="font-mono text-xs text-foreground">{`<${part.name} />`}</h3>
            {part.extendsNative && (
              <span className="text-xs uppercase text-muted-foreground">+ native element props</span>
            )}
          </div>
          {part.props.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={API_TH}>
                    <span className={API_TH_LABEL}>Prop</span>
                  </TableHead>
                  <TableHead className={API_TH}>
                    <span className={API_TH_LABEL}>Type</span>
                  </TableHead>
                  <TableHead className={API_TH}>
                    <span className={API_TH_LABEL}>Default</span>
                  </TableHead>
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
                        <p className="mt-1 max-w-[32ch] text-xs text-muted-foreground">{prop.description}</p>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 whitespace-normal">
                      {prop.typeHtml ? (
                        <code
                          className="shiki-inline font-mono text-xs"
                          dangerouslySetInnerHTML={{ __html: prop.typeHtml }}
                        />
                      ) : (
                        <code className="font-mono text-xs text-muted-foreground">{prop.type}</code>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 whitespace-normal">
                      {prop.defaultHtml ? (
                        <code
                          className="shiki-inline font-mono text-xs"
                          dangerouslySetInnerHTML={{ __html: prop.defaultHtml }}
                        />
                      ) : (
                        <code className="font-mono text-xs text-muted-foreground">{prop.default ?? 'none'}</code>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="px-4 py-3 text-xs text-muted-foreground">
              {part.extendsNative
                ? 'No props of its own; forwards everything to the underlying element.'
                : 'No configurable props.'}
            </p>
          )}
        </section>
      ))}
    </div>
  );
};

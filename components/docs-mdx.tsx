import * as React from 'react';
import type { MDXComponents } from 'mdx/types';

import { cn } from '@/lib/utils';
import { slugifyHeading } from '@/lib/docs-nav';
import { highlightCode, type HighlightLang } from '@/lib/highlight';
import { mdxComponents } from '@/components/mdx';
import { InstallBlock } from '@/components/install-block';
import {
  AgentSession,
  InstallFlow,
  InstallTree,
  ItemPreviews,
  RtlCompare,
  TokenSwatches,
} from '@/components/docs-illustrations';
import { CustomizerPlayground, LivePreview, McpClientCommand } from '@/components/docs-interactive';
import { CopyButton } from '@/registry/hirael/bases/radix/components/copy-button';

const textOf = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children);

  return '';
};

interface CodeElementProps {
  className?: string;
  children?: React.ReactNode;
}

const DOC_LANGS: HighlightLang[] = ['tsx', 'ts', 'bash', 'css', 'json', 'html'];

const findHighlightLang = (lang: string): HighlightLang | null =>
  DOC_LANGS.find((supported) => supported === lang) ?? null;

// MDX hands fenced code over as <pre><code className="language-x">, so the language rides on the inner element.
const DocsPre = async ({ children }: React.ComponentProps<'pre'>) => {
  const code = React.isValidElement<CodeElementProps>(children) ? children : null;
  const source = textOf(code?.props.children ?? children).replace(/\n$/, '');
  const lang = findHighlightLang(/language-(\S+)/.exec(code?.props.className ?? '')?.[1] ?? '');
  const html = lang ? await highlightCode(source, lang) : null;

  return (
    <div className="group/code relative mt-4 overflow-hidden rounded-md border border-border bg-card" dir="ltr">
      {html ? (
        <div className="shiki-scroll overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="shiki overflow-x-auto whitespace-pre-wrap">
          <code>{source}</code>
        </pre>
      )}
      <div className="absolute end-2 top-2">
        <CopyButton value={source} size="sm" variant="ghost" label="Copy code" />
      </div>
    </div>
  );
};

const headingId = (children: React.ReactNode) => slugifyHeading(textOf(children));

interface InstallProps {
  name: string;
}

/** The same install command the item pages show, following the visitor's base and package manager. */
const Install = ({ name }: InstallProps) => <InstallBlock name={name} className="mt-4" />;

interface NoteProps {
  children: React.ReactNode;
}

const Note = ({ children }: NoteProps) => (
  <div className="mt-5 rounded-md border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-foreground/80 [&>p]:mt-0">
    {children}
  </div>
);

export const docsMdxComponents: MDXComponents = {
  ...mdxComponents,
  h2: ({ className, children, ...props }: React.ComponentProps<'h2'>) => (
    <h2
      id={headingId(children)}
      className={cn('mt-12 scroll-mt-24 text-xl font-semibold tracking-tight text-foreground first:mt-0', className)}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ className, children, ...props }: React.ComponentProps<'h3'>) => (
    <h3
      id={headingId(children)}
      className={cn('mt-8 scroll-mt-24 text-base font-medium tracking-tight text-foreground', className)}
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ className, ...props }: React.ComponentProps<'p'>) => (
    <p className={cn('mt-4 text-[15px] leading-7 text-foreground/80 first:mt-0', className)} {...props} />
  ),
  pre: DocsPre,
  Install,
  Note,
  InstallFlow,
  InstallTree,
  TokenSwatches,
  RtlCompare,
  AgentSession,
  CustomizerPlayground,
  LivePreview,
  McpClientCommand,
  ItemPreviews,
};

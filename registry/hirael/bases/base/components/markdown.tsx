'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';
import { useCopyToClipboard } from '@/registry/hirael/hooks/use-copy-to-clipboard';

/**
 * Closes markdown that was cut off mid-stream, so a half-written code fence,
 * bold run, inline code or link renders as text instead of swallowing the rest.
 */
export const completeMarkdown = (text: string) => {
  let out = text;
  const fences = out.match(/^\s*(```|~~~)/gm)?.length ?? 0;
  if (fences % 2 === 1) return `${out}\n\`\`\``;

  // Everything below ignores fenced blocks, which were balanced above.
  const prose = out.replace(/(```|~~~)[\s\S]*?\1/g, '');
  const lastLine = prose.split('\n').at(-1) ?? '';
  // An unfinished link or image shows its text until the URL arrives.
  out = out.replace(/!?\[([^\]\n]*)\]\([^)\n]*$/, '$1').replace(/!?\[([^\]\n]*)$/, '$1');
  if ((lastLine.match(/`/g)?.length ?? 0) % 2 === 1) out += '`';
  if ((lastLine.replace(/`[^`]*`/g, '').match(/\*\*/g)?.length ?? 0) % 2 === 1) out += '**';
  if ((lastLine.replace(/`[^`]*`/g, '').match(/~~/g)?.length ?? 0) % 2 === 1) out += '~~';

  return out;
};

export interface MarkdownCodeBlockLabels {
  copy: string;
  copied: string;
}

const DEFAULT_CODE_LABELS: MarkdownCodeBlockLabels = { copy: 'Copy', copied: 'Copied' };

// Labels reach code blocks through context so the renderers below stay module constants; a renderer
// created during render is a new component type each time, which remounts every element on every token.
const CodeLabelsContext = React.createContext<MarkdownCodeBlockLabels>(DEFAULT_CODE_LABELS);

interface CodeBlockProps {
  language: string | undefined;
  code: string;
}

const CodeBlock = ({ language, code }: CodeBlockProps) => {
  const labels = React.useContext(CodeLabelsContext);
  const { copied, copy } = useCopyToClipboard();

  return (
    <div data-slot="markdown-code-block" className="my-4 overflow-hidden rounded-lg border border-border bg-muted/50">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-xs text-muted-foreground">
        <span>{language ?? 'text'}</span>
        <button
          type="button"
          onClick={() => copy(code)}
          aria-label={copied ? labels.copied : labels.copy}
          className="inline-flex items-center gap-1 rounded-sm px-1 outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? labels.copied : labels.copy}
        </button>
      </div>
      <pre dir="ltr" className="overflow-x-auto p-3 text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const BASE_COMPONENTS: Components = {
  h1: ({ node: _node, className, ...props }) => (
    <h1 className={cn('mt-6 mb-3 text-2xl font-semibold tracking-tight first:mt-0', className)} {...props} />
  ),
  h2: ({ node: _node, className, ...props }) => (
    <h2 className={cn('mt-6 mb-2 text-xl font-semibold tracking-tight first:mt-0', className)} {...props} />
  ),
  h3: ({ node: _node, className, ...props }) => (
    <h3 className={cn('mt-5 mb-2 text-lg font-semibold first:mt-0', className)} {...props} />
  ),
  h4: ({ node: _node, className, ...props }) => (
    <h4 className={cn('mt-4 mb-2 font-semibold first:mt-0', className)} {...props} />
  ),
  p: ({ node: _node, className, ...props }) => (
    <p className={cn('my-3 leading-relaxed first:mt-0 last:mb-0', className)} {...props} />
  ),
  a: ({ node: _node, className, ...props }) => (
    <a
      className={cn('font-medium text-primary underline underline-offset-4 hover:no-underline', className)}
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  ),
  ul: ({ node: _node, className, ...props }) => (
    <ul className={cn('my-3 list-disc ps-6 marker:text-muted-foreground [&_ul]:my-1', className)} {...props} />
  ),
  ol: ({ node: _node, className, ...props }) => (
    <ol className={cn('my-3 list-decimal ps-6 marker:text-muted-foreground [&_ol]:my-1', className)} {...props} />
  ),
  li: ({ node: _node, className, ...props }) => (
    <li className={cn('my-1 ps-1 [&:has(>input)]:list-none [&>input]:-ms-6 [&>input]:me-2', className)} {...props} />
  ),
  blockquote: ({ node: _node, className, ...props }) => (
    <blockquote className={cn('my-4 border-s-2 border-border ps-4 text-muted-foreground', className)} {...props} />
  ),
  hr: ({ node: _node, className, ...props }) => <hr className={cn('my-6 border-border', className)} {...props} />,
  table: ({ node: _node, className, ...props }) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-border">
      <table className={cn('w-full text-sm', className)} {...props} />
    </div>
  ),
  th: ({ node: _node, className, ...props }) => (
    <th className={cn('border-b border-border bg-muted/50 px-3 py-2 text-start font-medium', className)} {...props} />
  ),
  td: ({ node: _node, className, ...props }) => (
    <td className={cn('border-b border-border px-3 py-2 [tr:last-child>&]:border-b-0', className)} {...props} />
  ),
  img: ({ node: _node, className, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element -- markdown images come from anywhere
    <img alt={alt ?? ''} className={cn('my-4 max-w-full rounded-lg border border-border', className)} {...props} />
  ),
  pre: ({ children }) => <>{children}</>,
  code: ({ node, className, children, ...props }) => {
    const language = /language-(\S+)/.exec(className ?? '')?.[1];
    // Fenced blocks span lines or name a language; anything else is inline code.
    const block = Boolean(language) || (node?.position && node.position.start.line !== node.position.end.line);
    if (block) return <CodeBlock language={language} code={String(children).replace(/\n$/, '')} />;

    return (
      <code className={cn('rounded-sm bg-muted px-1 py-0.5 text-[0.875em]', className)} {...props}>
        {children}
      </code>
    );
  },
};

const REMARK_PLUGINS = [remarkGfm];

export interface MarkdownProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Markdown source. GitHub tables, task lists and strikethrough are supported. */
  children: string;
  /** Repair text cut off mid-stream and show a caret at the end. */
  streaming?: boolean;
  /** Replace how any element renders, keyed by tag name. Keep it stable, at module scope or memoized. */
  components?: Components;
  /** Text on the copy button of code blocks. */
  codeLabels?: Partial<MarkdownCodeBlockLabels>;
}

const Markdown = ({ children, streaming = false, components, codeLabels, className, ...props }: MarkdownProps) => {
  const copyLabel = codeLabels?.copy ?? DEFAULT_CODE_LABELS.copy;
  const copiedLabel = codeLabels?.copied ?? DEFAULT_CODE_LABELS.copied;
  const labels = React.useMemo(() => ({ copy: copyLabel, copied: copiedLabel }), [copyLabel, copiedLabel]);
  const merged = React.useMemo(
    () => (components ? { ...BASE_COMPONENTS, ...components } : BASE_COMPONENTS),
    [components],
  );

  return (
    <div
      data-slot="markdown"
      data-streaming={streaming || undefined}
      className={cn(
        'text-sm [overflow-wrap:anywhere] text-foreground',
        // The caret follows the last block while text streams in.
        'data-streaming:[&>*:last-child]:after:ms-0.5 data-streaming:[&>*:last-child]:after:inline-block data-streaming:[&>*:last-child]:after:h-[1em] data-streaming:[&>*:last-child]:after:w-1.5 data-streaming:[&>*:last-child]:after:translate-y-0.5 data-streaming:[&>*:last-child]:after:animate-pulse data-streaming:[&>*:last-child]:after:rounded-[1px] data-streaming:[&>*:last-child]:after:bg-foreground/70 data-streaming:[&>*:last-child]:after:content-[""]',
        className,
      )}
      {...props}
    >
      <CodeLabelsContext.Provider value={labels}>
        <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={merged}>
          {streaming ? completeMarkdown(children) : children}
        </ReactMarkdown>
      </CodeLabelsContext.Provider>
    </div>
  );
};

export { Markdown };

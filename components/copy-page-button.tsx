'use client';

import * as React from 'react';
import { Check, ChevronDown, Copy, FileText, LoaderCircle, TriangleAlert } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SITE } from '@/lib/site';
import { useRegistryBase } from '@/components/active-theme';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/radix/ui/dropdown-menu';
import { registryMarkdownPath } from '@/registry/hirael/registry-meta';

type CopyState = 'idle' | 'copying' | 'copied' | 'error';

const RESET_MS = 1800;

const ClaudeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
    <path d="m4.714 15.956 4.718-2.648.079-.23-.08-.128h-.23l-.79-.048-2.695-.073-2.337-.097-2.265-.122-.57-.121-.535-.704.055-.353.48-.321.685.06 1.518.104 2.277.157 1.651.098 2.447.255h.389l.054-.158-.133-.097-.103-.098-2.356-1.596-2.55-1.688-1.336-.972-.722-.491L2 6.223l-.158-1.008.655-.722.88.06.225.061.893.686 1.906 1.476 2.49 1.833.364.304.146-.104.018-.072-.164-.274-1.354-2.446-1.445-2.49-.644-1.032-.17-.619a2.972 2.972 0 0 1-.103-.729L6.287.133 6.7 0l.995.134.42.364.619 1.415L9.735 4.14l1.555 3.03.455.898.243.832.09.255h.159V9.01l.127-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.583.28.48.685-.067.444-.286 1.851-.558 2.903-.365 1.942h.213l.243-.242.983-1.306 1.652-2.064.728-.82.85-.904.547-.431h1.032l.759 1.129-.34 1.166-1.063 1.347-.88 1.142-1.263 1.7-.79 1.36.074.11.188-.02 2.853-.606 1.542-.28 1.84-.315.832.388.09.395-.327.807-1.967.486-2.307.462-3.436.813-.043.03.049.061 1.548.146.662.036h1.62l3.018.225.79.522.473.638-.08.485-1.213.62-1.64-.389-3.825-.91-1.31-.329h-.183v.11l1.093 1.068 2.003 1.81 2.508 2.33.127.578-.321.455-.34-.049-2.204-1.657-.85-.747-1.925-1.62h-.127v.17l.443.649 2.343 3.521.122 1.08-.17.353-.607.213-.668-.122-1.372-1.924-1.415-2.168-1.141-1.943-.14.08-.674 7.254-.316.37-.728.28-.607-.461-.322-.747.322-1.476.388-1.924.316-1.53.285-1.9.17-.632-.012-.042-.14.018-1.432 1.967-2.18 2.945-1.724 1.845-.413.164-.716-.37.066-.662.401-.589 2.386-3.036 1.439-1.882.929-1.086-.006-.158h-.055L4.138 18.56l-1.13.146-.485-.456.06-.746.231-.243 1.907-1.312Z" />
  </svg>
);

const ChatGptIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z" />
  </svg>
);

const V0Icon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 147 70" aria-hidden className={className} fill="currentColor">
    <path d="M56 50.203V14h14v46.156C70 65.593 65.593 70 60.156 70c-2.596 0-5.158-1-7-2.843L0 14h19.797L56 50.203ZM147 56h-14V23.953L100.953 56H133v14H96.687C85.814 70 77 61.186 77 50.312V14h14v32.156L123.156 14H91V0h36.312C138.186 0 147 8.814 147 19.688V56Z" />
  </svg>
);

/**
 * The prompt an assistant opens with. It hands over the Markdown URL rather
 * than the page URL: the Markdown is the same document without the chrome, so
 * a model that follows the link reads the source and API tables instead of a
 * preview it cannot run.
 */
const handoffPrompt = (title: string, markdownUrl: string) =>
  `Read ${markdownUrl} and help me use the ${title} component from the Hirael registry. It documents the install command, the API and the full source.`;

/**
 * Page actions for a detail page: copy the whole page as Markdown, or hand it
 * to an assistant. Everything resolves against the active base, so switching
 * the Customizer to Base UI copies the Base UI source.
 */
export const CopyPageButton = ({ name, title, className }: { name: string; title: string; className?: string }) => {
  const base = useRegistryBase();
  const [state, setState] = React.useState<CopyState>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const markdownPath = registryMarkdownPath(base, name);
  const markdownUrl = `${SITE.url}${markdownPath}`;

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const copyMarkdown = async () => {
    setState('copying');
    try {
      // Fetched rather than rebuilt in the browser: the file at this URL is
      // what an agent reads, so copying anything else would let the two drift.
      const response = await fetch(markdownPath);
      if (!response.ok) throw new Error(String(response.status));
      await navigator.clipboard.writeText(await response.text());
      setState('copied');
    } catch {
      setState('error');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), RESET_MS);
  };

  const StateIcon =
    state === 'copying' ? LoaderCircle : state === 'copied' ? Check : state === 'error' ? TriangleAlert : Copy;

  return (
    <div className={cn('inline-flex items-center', className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={copyMarkdown}
        disabled={state === 'copying'}
        aria-live="polite"
        aria-label={state === 'error' ? 'Copying failed. Try again' : 'Copy this page as Markdown'}
        title="Copy this page as Markdown"
        className="rounded-e-none pe-2"
      >
        <StateIcon
          className={cn(
            state === 'copying' && 'animate-spin motion-reduce:animate-none',
            state === 'copied' && 'text-success',
            state === 'error' && 'text-destructive',
          )}
          aria-hidden
        />
        {state === 'error' ? 'Try again' : 'Copy page'}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="More page actions"
            title="More page actions"
            className="rounded-s-none border-s border-border px-1.5"
          >
            <ChevronDown aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <a href={markdownPath}>
              <FileText aria-hidden />
              View as Markdown
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              href={`https://claude.ai/new?q=${encodeURIComponent(handoffPrompt(title, markdownUrl))}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <ClaudeIcon className="size-4" />
              Open in Claude
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`https://chatgpt.com/?q=${encodeURIComponent(handoffPrompt(title, markdownUrl))}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <ChatGptIcon className="size-4" />
              Open in ChatGPT
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`https://v0.dev/?q=${encodeURIComponent(handoffPrompt(title, markdownUrl))}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <V0Icon className="size-4" />
              Open in v0
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

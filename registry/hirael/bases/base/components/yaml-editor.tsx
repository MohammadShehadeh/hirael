'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

// Dependency-free YAML tokenizer — enough to read config at a glance, not a
// full parser. Each line becomes a list of classed spans.

const tokenClass = {
  comment: 'text-muted-foreground italic',
  key: 'text-info',
  string: 'text-success',
  literal: 'text-warning',
  punctuation: 'text-muted-foreground',
  scalar: 'text-foreground',
} as const;

interface Token {
  className: string;
  text: string;
}

const LITERAL = /^(true|false|null|yes|no|on|off|~)$/i;
const NUMBER = /^-?\d+(\.\d+)?$/;

const classifyValue = (raw: string): Token[] => {
  const tokens: Token[] = [];
  const hashAt = raw.indexOf(' #');
  let value = raw;
  let comment = '';
  if (hashAt !== -1) {
    value = raw.slice(0, hashAt);
    comment = raw.slice(hashAt);
  }
  const trimmed = value.trim();
  if (trimmed) {
    let className: string = tokenClass.scalar;
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      className = tokenClass.string;
    } else if (NUMBER.test(trimmed) || LITERAL.test(trimmed)) {
      className = tokenClass.literal;
    }
    tokens.push({ className, text: value });
  }
  if (comment) tokens.push({ className: tokenClass.comment, text: comment });
  return tokens;
};

const tokenizeLine = (line: string): Token[] => {
  const indentMatch = line.match(/^(\s*)/);
  const indent = indentMatch ? indentMatch[1] : '';
  let rest = line.slice(indent.length);
  const tokens: Token[] = [];
  if (indent) tokens.push({ className: '', text: indent });

  if (rest.startsWith('#')) {
    tokens.push({ className: tokenClass.comment, text: rest });
    return tokens;
  }

  const listMatch = rest.match(/^(-\s+|-$)/);
  if (listMatch) {
    tokens.push({ className: tokenClass.punctuation, text: listMatch[0] });
    rest = rest.slice(listMatch[0].length);
  }

  const keyMatch = rest.match(/^([^\s:#][^:]*?):(\s|$)/);
  if (keyMatch) {
    tokens.push({ className: tokenClass.key, text: keyMatch[1] });
    tokens.push({ className: tokenClass.punctuation, text: ':' });
    const after = rest.slice(keyMatch[1].length + 1);
    tokens.push(...classifyValue(after));
    return tokens;
  }

  if (rest) tokens.push(...classifyValue(rest));
  return tokens;
};

const HighlightLine = React.memo(function HighlightLine({ line }: { line: string }) {
  const tokens = tokenizeLine(line);
  return (
    <span className="block min-h-[1.25rem]">
      {tokens.length === 0
        ? '​'
        : tokens.map((token, i) => (
            <span key={i} className={token.className}>
              {token.text}
            </span>
          ))}
    </span>
  );
});

interface YamlEditorProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  readOnly?: boolean;
  /** Visible rows before the editor scrolls. */
  rows?: number;
  textareaProps?: React.ComponentProps<'textarea'>;
}

const YamlEditor = ({
  value,
  defaultValue = '',
  onValueChange,
  readOnly,
  rows = 12,
  className,
  textareaProps,
  ...props
}: YamlEditorProps) => {
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const text = isControlled ? value : internal;

  const preRef = React.useRef<HTMLPreElement>(null);
  const gutterRef = React.useRef<HTMLDivElement>(null);
  const caretRafRef = React.useRef(0);

  React.useEffect(() => () => cancelAnimationFrame(caretRafRef.current), []);

  const lines = text.split('\n');

  const syncScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
    const el = event.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = el.scrollTop;
      preRef.current.scrollLeft = el.scrollLeft;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = el.scrollTop;
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value;
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Tab' || readOnly) return;
    event.preventDefault();
    const el = event.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = text.slice(0, start) + '  ' + text.slice(end);
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
    caretRafRef.current = requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + 2;
    });
  };

  return (
    <div
      data-slot="yaml-editor"
      dir="ltr"
      className={cn(
        'flex overflow-hidden rounded-lg border border-border bg-card font-mono text-xs leading-5',
        className,
      )}
      style={{ height: `calc(${rows} * 1.25rem + 1.5rem)` }}
      {...props}
    >
      <div
        ref={gutterRef}
        data-slot="yaml-editor-gutter"
        aria-hidden
        className="shrink-0 select-none overflow-hidden border-e border-border bg-muted/40 py-3 text-end text-muted-foreground"
      >
        {lines.map((_, i) => (
          <div key={i} className="px-2.5">
            {i + 1}
          </div>
        ))}
      </div>

      <div className="relative min-w-0 flex-1">
        <pre
          ref={preRef}
          data-slot="yaml-editor-highlight"
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre p-3 text-foreground"
        >
          {lines.map((line, i) => (
            <HighlightLine key={i} line={line} />
          ))}
        </pre>
        <textarea
          data-slot="yaml-editor-input"
          aria-label="YAML editor"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          readOnly={readOnly}
          value={text}
          onChange={handleChange}
          onScroll={syncScroll}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 resize-none overflow-auto whitespace-pre bg-transparent p-3 text-transparent caret-foreground outline-none"
          {...textareaProps}
        />
      </div>
    </div>
  );
};

export { YamlEditor };

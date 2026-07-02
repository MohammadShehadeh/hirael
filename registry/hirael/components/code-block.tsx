"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, FileCode } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import { CopyButton } from "@/registry/hirael/components/copy-button";

type TokenType =
  | "comment"
  | "string"
  | "keyword"
  | "literal"
  | "number"
  | "type"
  | "function"
  | "property"
  | "tag"
  | "punctuation"
  | "plain";

type Token = { type: TokenType; content: string };

type Rule = { type: TokenType; re: string };

const TOKEN_CLASSES: Record<TokenType, string | undefined> = {
  comment: "italic text-muted-foreground",
  string: "text-chart-2",
  keyword: "text-chart-1",
  literal: "text-chart-3",
  number: "text-chart-3",
  type: "text-chart-4",
  function: "text-chart-5",
  property: "text-chart-1",
  tag: "text-chart-1",
  punctuation: "text-muted-foreground",
  plain: undefined,
};

const JS_RULES: Rule[] = [
  { type: "comment", re: String.raw`\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)` },
  {
    type: "string",
    re: String.raw`'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|\`(?:[^\`\\]|\\[\s\S])*\``,
  },
  {
    type: "keyword",
    re: String.raw`\b(?:import|export|from|default|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|implements|interface|type|enum|public|private|protected|readonly|static|async|await|yield|try|catch|finally|throw|typeof|instanceof|in|of|as|satisfies|keyof|infer|declare|namespace|abstract|this|super|void|delete|get|set)\b`,
  },
  {
    type: "literal",
    re: String.raw`\b(?:true|false|null|undefined|NaN|Infinity)\b`,
  },
  {
    type: "number",
    re: String.raw`\b0[xXbBoO]\w+\b|\b\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?n?\b`,
  },
  { type: "function", re: String.raw`\b[a-z_$][\w$]*(?=\s*\()` },
  { type: "type", re: String.raw`\b[A-Z][\w$]*\b` },
  { type: "punctuation", re: String.raw`[{}()[\]<>,;.:?!=+\-*/%&|^~]+` },
];

const JSON_RULES: Rule[] = [
  { type: "property", re: String.raw`"(?:[^"\\]|\\.)*"(?=\s*:)` },
  { type: "string", re: String.raw`"(?:[^"\\]|\\.)*"` },
  { type: "literal", re: String.raw`\b(?:true|false|null)\b` },
  { type: "number", re: String.raw`-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b` },
  { type: "punctuation", re: String.raw`[{}[\],:]+` },
];

const BASH_RULES: Rule[] = [
  { type: "comment", re: String.raw`#[^\n]*` },
  { type: "string", re: String.raw`'[^']*'|"(?:[^"\\\n]|\\.)*"` },
  { type: "type", re: String.raw`\$\{[^}]*\}|\$\w+` },
  {
    type: "keyword",
    re: String.raw`\b(?:if|then|else|elif|fi|for|in|do|done|while|until|case|esac|function|return|exit|export|local|readonly|set|source|alias|echo|cd|sudo)\b`,
  },
  { type: "property", re: String.raw`(?<=\s)--?[\w-]+\b` },
  { type: "number", re: String.raw`\b\d+\b` },
  { type: "punctuation", re: String.raw`[|&;<>(){}[\]=]+` },
];

const CSS_RULES: Rule[] = [
  { type: "comment", re: String.raw`\/\*[\s\S]*?(?:\*\/|$)` },
  { type: "string", re: String.raw`'[^']*'|"[^"]*"` },
  { type: "keyword", re: String.raw`@[\w-]+|!important\b` },
  { type: "number", re: String.raw`#[0-9a-fA-F]{3,8}\b` },
  { type: "type", re: String.raw`[.#][\w-]+` },
  { type: "property", re: String.raw`[\w-]+(?=\s*:)` },
  {
    type: "number",
    re: String.raw`-?\d[\d.]*(?:px|rem|em|vh|vw|vmin|vmax|fr|deg|ch|ex|s|ms|%)?`,
  },
  { type: "function", re: String.raw`\b[\w-]+(?=\()` },
  { type: "punctuation", re: String.raw`[{}();:,>~+*]+` },
];

const HTML_RULES: Rule[] = [
  { type: "comment", re: String.raw`<!--[\s\S]*?(?:-->|$)` },
  { type: "keyword", re: String.raw`<!DOCTYPE[^>]*>` },
  { type: "tag", re: String.raw`<\/?[a-zA-Z][\w:-]*` },
  { type: "property", re: String.raw`[\w-]+(?==)` },
  { type: "string", re: String.raw`"[^"]*"|'[^']*'` },
  { type: "literal", re: String.raw`&\w+;` },
  { type: "punctuation", re: String.raw`\/?>|=` },
];

const GRAMMARS: Record<string, Rule[]> = {
  js: JS_RULES,
  jsx: JS_RULES,
  ts: JS_RULES,
  tsx: JS_RULES,
  javascript: JS_RULES,
  typescript: JS_RULES,
  json: JSON_RULES,
  jsonc: JSON_RULES,
  bash: BASH_RULES,
  sh: BASH_RULES,
  shell: BASH_RULES,
  zsh: BASH_RULES,
  css: CSS_RULES,
  scss: CSS_RULES,
  less: CSS_RULES,
  html: HTML_RULES,
  xml: HTML_RULES,
  svg: HTML_RULES,
};

function tokenize(code: string, language?: string): Token[][] | null {
  const rules = language ? GRAMMARS[language.toLowerCase()] : undefined;
  if (!rules) return null;

  const master = new RegExp(rules.map((rule) => `(${rule.re})`).join("|"), "g");
  const tokens: Token[] = [];
  let last = 0;
  for (const match of code.matchAll(master)) {
    const index = match.index ?? 0;
    if (index > last) {
      tokens.push({ type: "plain", content: code.slice(last, index) });
    }
    const groupIndex = match.slice(1).findIndex((group) => group !== undefined);
    tokens.push({ type: rules[groupIndex].type, content: match[0] });
    last = index + match[0].length;
  }
  if (last < code.length) {
    tokens.push({ type: "plain", content: code.slice(last) });
  }

  const lines: Token[][] = [[]];
  for (const token of tokens) {
    const parts = token.content.split("\n");
    parts.forEach((part, partIndex) => {
      if (partIndex > 0) lines.push([]);
      if (part)
        lines[lines.length - 1].push({ type: token.type, content: part });
    });
  }
  return lines;
}

type CodeBlockContextValue = {
  code: string;
  language?: string;
  filename?: string;
  highlight: boolean;
  showLineNumbers: boolean;
  highlightLines: number[];
  addedLines: number[];
  removedLines: number[];
  wrap: boolean;
  maxHeight?: number;
  copyable: boolean;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const CodeBlockContext = React.createContext<CodeBlockContextValue | null>(
  null,
);

function useCodeBlock() {
  const context = React.useContext(CodeBlockContext);
  if (!context) {
    throw new Error("useCodeBlock must be used within a <CodeBlock />");
  }
  return context;
}

export type CodeBlockProps = React.ComponentProps<"div"> & {
  /** Raw code to display. A string child is accepted as an alternative. */
  code?: string;
  language?: string;
  filename?: string;
  /** Tokenize and color the code when the language has a built-in grammar. */
  highlight?: boolean;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  addedLines?: number[];
  removedLines?: number[];
  wrap?: boolean;
  maxHeight?: number;
  copyable?: boolean;
};

function CodeBlock({
  code,
  language,
  filename,
  highlight = true,
  showLineNumbers = true,
  highlightLines = [],
  addedLines = [],
  removedLines = [],
  wrap = false,
  maxHeight,
  copyable = true,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [expanded, setExpanded] = React.useState(false);

  const rawCode = (
    code ?? (typeof children === "string" ? children : "")
  ).replace(/\n$/, "");
  const hasCustomChildren = children != null && typeof children !== "string";
  const showHeader = Boolean(filename || language || copyable);

  const contextValue = React.useMemo<CodeBlockContextValue>(
    () => ({
      code: rawCode,
      language,
      filename,
      highlight,
      showLineNumbers,
      highlightLines,
      addedLines,
      removedLines,
      wrap,
      maxHeight,
      copyable,
      expanded,
      setExpanded,
    }),
    [
      rawCode,
      language,
      filename,
      highlight,
      showLineNumbers,
      highlightLines,
      addedLines,
      removedLines,
      wrap,
      maxHeight,
      copyable,
      expanded,
    ],
  );

  return (
    <CodeBlockContext.Provider value={contextValue}>
      <div
        data-slot="code-block"
        className={cn(
          "overflow-hidden rounded-md border border-border bg-card text-card-foreground",
          className,
        )}
        {...props}
      >
        {hasCustomChildren ? (
          children
        ) : (
          <>
            {showHeader && <CodeBlockHeader />}
            <CodeBlockContent />
          </>
        )}
      </div>
    </CodeBlockContext.Provider>
  );
}

function CodeBlockHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { code, language, filename, copyable } = useCodeBlock();

  return (
    <div
      data-slot="code-block-header"
      className={cn(
        "flex min-h-10 items-center gap-2 border-b border-border px-3 py-1",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          {filename && (
            <span
              data-slot="code-block-filename"
              className="flex items-center gap-1.5 font-mono text-xs text-foreground"
            >
              <FileCode
                className="size-3.5 text-muted-foreground"
                aria-hidden
              />
              {filename}
            </span>
          )}
          {language && (
            <Badge data-slot="code-block-language" variant="outline">
              {language}
            </Badge>
          )}
          {copyable && (
            <CopyButton value={code} size="sm" className="ms-auto" />
          )}
        </>
      )}
    </div>
  );
}

function CodeBlockContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    code,
    language,
    highlight,
    showLineNumbers,
    highlightLines,
    addedLines,
    removedLines,
    wrap,
    maxHeight,
    expanded,
    setExpanded,
  } = useCodeBlock();
  const preRef = React.useRef<HTMLPreElement>(null);
  const [overflowing, setOverflowing] = React.useState(false);

  const lines = code.split("\n");
  const tokenLines = React.useMemo(
    () => (highlight ? tokenize(code, language) : null),
    [highlight, code, language],
  );
  const hasDiff = addedLines.length > 0 || removedLines.length > 0;
  const collapsible = maxHeight != null;
  const collapsed = collapsible && !expanded;

  React.useEffect(() => {
    if (maxHeight == null) return;
    const pre = preRef.current;
    if (!pre) return;
    const update = () => setOverflowing(pre.scrollHeight > maxHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(pre);
    return () => observer.disconnect();
  }, [maxHeight, code, wrap]);

  return (
    <div
      data-slot="code-block-content"
      className={cn("text-sm", className)}
      {...props}
    >
      <div
        data-slot="code-block-viewport"
        className={cn("relative", collapsed && "overflow-hidden")}
        style={collapsed ? { maxHeight } : undefined}
      >
        <pre
          ref={preRef}
          dir="ltr"
          className={cn(
            "overflow-x-auto py-3 font-mono text-[13px] leading-6",
            wrap && "whitespace-pre-wrap break-words",
          )}
        >
          <code data-slot="code-block-code" className="block w-fit min-w-full">
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const highlighted = highlightLines.includes(lineNumber);
              const added = addedLines.includes(lineNumber);
              const removed = removedLines.includes(lineNumber);

              return (
                <span
                  key={lineNumber}
                  data-slot="code-block-line"
                  data-line-number={lineNumber}
                  data-highlighted={highlighted || undefined}
                  data-diff={added ? "added" : removed ? "removed" : undefined}
                  className={cn(
                    "flex border-s-2 border-transparent pe-4",
                    showLineNumbers || hasDiff ? "ps-2" : "ps-4",
                    highlighted && "border-primary bg-accent",
                    added && "bg-primary/10",
                    removed && "bg-destructive/10",
                  )}
                >
                  {showLineNumbers && (
                    <span
                      aria-hidden
                      data-slot="code-block-line-number"
                      data-line-number={lineNumber}
                      className="w-8 shrink-0 select-none pe-3 text-end text-muted-foreground before:content-[attr(data-line-number)]"
                    />
                  )}
                  {hasDiff && (
                    <span
                      aria-hidden
                      data-slot="code-block-diff-marker"
                      className={cn(
                        "w-4 shrink-0 select-none",
                        added && "text-primary before:content-['+']",
                        removed && "text-destructive before:content-['−']",
                      )}
                    />
                  )}
                  <span className="flex-1">
                    {line.length === 0
                      ? "​"
                      : (tokenLines?.[index]?.map((token, tokenIndex) =>
                          token.type === "plain" ? (
                            token.content
                          ) : (
                            <span
                              key={tokenIndex}
                              data-token={token.type}
                              className={TOKEN_CLASSES[token.type]}
                            >
                              {token.content}
                            </span>
                          ),
                        ) ?? line)}
                  </span>
                </span>
              );
            })}
          </code>
        </pre>
        {collapsed && overflowing && (
          <div
            aria-hidden
            data-slot="code-block-fade"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card to-transparent"
          />
        )}
      </div>
      {collapsible && (overflowing || expanded) && (
        <div
          data-slot="code-block-expand"
          className="flex justify-center border-t border-border p-1"
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
            className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {expanded ? "Show less" : "Show more"}
            {expanded ? <ChevronUp aria-hidden /> : <ChevronDown aria-hidden />}
          </Button>
        </div>
      )}
    </div>
  );
}

export { CodeBlock, CodeBlockHeader, CodeBlockContent };

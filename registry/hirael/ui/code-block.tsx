"use client"

import * as React from "react"
import { ChevronDown, ChevronUp, FileCode } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/registry/hirael/ui/badge"
import { Button } from "@/registry/hirael/ui/button"
import { CopyButton } from "@/registry/hirael/ui/copy-button"

type CodeBlockContextValue = {
  code: string
  language?: string
  filename?: string
  showLineNumbers: boolean
  highlightLines: number[]
  addedLines: number[]
  removedLines: number[]
  wrap: boolean
  maxHeight?: number
  copyable: boolean
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

const CodeBlockContext = React.createContext<CodeBlockContextValue | null>(null)

function useCodeBlock() {
  const context = React.useContext(CodeBlockContext)
  if (!context) {
    throw new Error("useCodeBlock must be used within a <CodeBlock />")
  }
  return context
}

export type CodeBlockProps = React.ComponentProps<"div"> & {
  /** Raw code to display. A string child is accepted as an alternative. */
  code?: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  addedLines?: number[]
  removedLines?: number[]
  wrap?: boolean
  maxHeight?: number
  copyable?: boolean
}

function CodeBlock({
  code,
  language,
  filename,
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
  const [expanded, setExpanded] = React.useState(false)

  const rawCode = (
    code ?? (typeof children === "string" ? children : "")
  ).replace(/\n$/, "")
  const hasCustomChildren = children != null && typeof children !== "string"
  const showHeader = Boolean(filename || language || copyable)

  const contextValue = React.useMemo<CodeBlockContextValue>(
    () => ({
      code: rawCode,
      language,
      filename,
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
      showLineNumbers,
      highlightLines,
      addedLines,
      removedLines,
      wrap,
      maxHeight,
      copyable,
      expanded,
    ]
  )

  return (
    <CodeBlockContext.Provider value={contextValue}>
      <div
        data-slot="code-block"
        className={cn(
          "overflow-hidden rounded-md border border-border bg-card text-card-foreground",
          className
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
  )
}

function CodeBlockHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { code, language, filename, copyable } = useCodeBlock()

  return (
    <div
      data-slot="code-block-header"
      className={cn(
        "flex min-h-10 items-center gap-2 border-b border-border px-3 py-1",
        className
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
              <FileCode className="size-3.5 text-muted-foreground" aria-hidden />
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
  )
}

function CodeBlockContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    code,
    showLineNumbers,
    highlightLines,
    addedLines,
    removedLines,
    wrap,
    maxHeight,
    expanded,
    setExpanded,
  } = useCodeBlock()
  const preRef = React.useRef<HTMLPreElement>(null)
  const [overflowing, setOverflowing] = React.useState(false)

  const lines = code.split("\n")
  const hasDiff = addedLines.length > 0 || removedLines.length > 0
  const collapsible = maxHeight != null
  const collapsed = collapsible && !expanded

  React.useEffect(() => {
    if (maxHeight == null) return
    const pre = preRef.current
    if (!pre) return
    setOverflowing(pre.scrollHeight > maxHeight)
  }, [maxHeight, code, wrap])

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
            wrap && "whitespace-pre-wrap break-words"
          )}
        >
          <code data-slot="code-block-code" className="block w-fit min-w-full">
            {lines.map((line, index) => {
              const lineNumber = index + 1
              const highlighted = highlightLines.includes(lineNumber)
              const added = addedLines.includes(lineNumber)
              const removed = removedLines.includes(lineNumber)

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
                    removed && "bg-destructive/10"
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
                        removed && "text-destructive before:content-['−']"
                      )}
                    />
                  )}
                  <span className="flex-1">
                    {line.length > 0 ? line : "​"}
                  </span>
                </span>
              )
            })}
          </code>
        </pre>
        {collapsed && overflowing && (
          <div
            aria-hidden
            data-slot="code-block-fade"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent"
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
  )
}

export { CodeBlock, CodeBlockHeader, CodeBlockContent }

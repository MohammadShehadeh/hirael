"use client"

import * as React from "react"
import { Check, Copy, Moon, Palette, RotateCcw, Sun } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  formatThemeCss,
  parseThemeCss,
  THEME_PRESETS,
  type ThemeMode,
} from "@/lib/theme"
import { useTheme } from "@/components/showcase/theme-provider"
import { Button } from "@/registry/msh-ui/ui/button"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/msh-ui/ui/sheet"

export function ThemeSheetTrigger({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open theme settings"
          className={cn(
            "inline-flex items-center gap-2 rounded-sm border border-sidebar-border bg-sidebar px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-sidebar-foreground transition-colors hover:border-foreground hover:text-foreground",
            className
          )}
        >
          <Palette className="size-3.5" />
          theme
        </button>
      </SheetTrigger>
      <SheetContent>
        <ThemeSheetBody />
      </SheetContent>
    </Sheet>
  )
}

function ThemeSheetBody() {
  const { mode, setMode, theme, mergeTheme, reset } = useTheme()
  const [paste, setPaste] = React.useState("")
  const [parseStatus, setParseStatus] = React.useState<
    { kind: "idle" } | { kind: "ok"; msg: string } | { kind: "warn"; msg: string }
  >({ kind: "idle" })
  const [copied, setCopied] = React.useState(false)

  const exportCss = React.useMemo(() => {
    // Fall back to a helpful empty hint if no overrides set.
    const formatted = formatThemeCss(theme)
    return (
      formatted ||
      "/* No overrides yet. Paste a theme below or pick a preset to populate this. */"
    )
  }, [theme])

  function applyPaste() {
    const { theme: parsed, warnings } = parseThemeCss(paste, mode)
    const lightCount = Object.keys(parsed.light ?? {}).length
    const darkCount = Object.keys(parsed.dark ?? {}).length
    if (!lightCount && !darkCount) {
      setParseStatus({
        kind: "warn",
        msg: warnings[0] ?? "No tokens recognized.",
      })
      return
    }
    mergeTheme(parsed)
    const parts: string[] = []
    if (darkCount) parts.push(`${darkCount} dark`)
    if (lightCount) parts.push(`${lightCount} light`)
    setParseStatus({
      kind: "ok",
      msg: `Applied ${parts.join(" + ")} token${darkCount + lightCount === 1 ? "" : "s"}.`,
    })
  }

  async function copyExport() {
    try {
      await navigator.clipboard.writeText(exportCss)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  function applyPreset(presetId: string) {
    const preset = THEME_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    mergeTheme(preset.overrides)
    setParseStatus({ kind: "ok", msg: `Applied "${preset.label}" preset.` })
  }

  const overrideCount =
    Object.keys(theme.light).length + Object.keys(theme.dark).length

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
            ◆ theme
          </span>
        </div>
        <SheetTitle>Theme settings</SheetTitle>
        <SheetDescription>
          Preview MSH UI components against your own theme. Paste a CSS
          variable block, pick a preset, or copy the active theme back out.
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <Section title="Mode">
          <div className="grid grid-cols-2 gap-2">
            <ModeButton
              active={mode === "dark"}
              onClick={() => setMode("dark")}
              icon={<Moon className="size-3.5" />}
              label="Dark"
            />
            <ModeButton
              active={mode === "light"}
              onClick={() => setMode("light")}
              icon={<Sun className="size-3.5" />}
              label="Light"
            />
          </div>
        </Section>

        <Section title="Presets">
          <div className="grid grid-cols-2 gap-2">
            {THEME_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className="group flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-2 text-left transition-colors hover:border-foreground"
              >
                <span
                  aria-hidden
                  className="size-3.5 shrink-0 rounded-full border border-border"
                  style={{ background: p.swatch }}
                />
                <span className="text-sm">{p.label}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Presets only override the accent and ring — neutrals stay intact.
          </p>
        </Section>

        <Section
          title="Paste CSS variables"
          hint={`Targets ${mode} when no .light/.dark selector is given`}
        >
          <textarea
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder={`:root {\n  --background: oklch(...);\n  --foreground: oklch(...);\n  --primary: oklch(...);\n  ...\n}\n\n.dark {\n  ...\n}`}
            spellCheck={false}
            className="h-44 w-full resize-y rounded-sm border border-border bg-card px-3 py-2 font-mono text-[11px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60 focus-visible:border-ring"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <p
              className={cn(
                "text-[11px]",
                parseStatus.kind === "warn"
                  ? "text-destructive"
                  : parseStatus.kind === "ok"
                    ? "text-foreground"
                    : "text-muted-foreground"
              )}
            >
              {parseStatus.kind === "idle"
                ? "Accepts :root, .light, .dark, or bare declarations."
                : parseStatus.msg}
            </p>
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={applyPaste}
              disabled={!paste.trim()}
            >
              Apply
            </Button>
          </div>
        </Section>

        <Section
          title="Export"
          hint={`${overrideCount} override${overrideCount === 1 ? "" : "s"} active`}
        >
          <pre className="max-h-40 overflow-auto rounded-sm border border-border bg-card p-3 font-mono text-[11px] leading-relaxed">
            <code>{exportCss}</code>
          </pre>
          <div className="mt-2 flex items-center justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={copyExport}
              disabled={!overrideCount}
            >
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? "Copied" : "Copy CSS"}
            </Button>
          </div>
        </Section>
      </SheetBody>

      <SheetFooter>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          live · persisted in this browser
        </p>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={reset}
          disabled={!overrideCount}
        >
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
      </SheetFooter>
    </>
  )
}

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {title}
        </h3>
        {hint && (
          <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground/70">
            {hint}
          </span>
        )}
      </div>
      {children}
    </section>
  )
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center justify-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors",
        active
          ? "border-foreground bg-accent text-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      {label}
      {active && <span className="ml-1 size-1.5 rounded-full bg-foreground" />}
    </button>
  )
}

// Re-export for client mode usage on the mode-helper as needed.
export type { ThemeMode }

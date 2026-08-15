"use client";

import * as React from "react";
import { Moon, Palette, RotateCcw, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  accentTheme,
  formatThemeCss,
  parseThemeCss,
  radiusTheme,
  RADIUS_OPTIONS,
} from "@/lib/theme";
import { THEME_PRESETS } from "@/registry/themes";
import { useTheme } from "@/components/active-theme";
import { Button } from "@/registry/hirael/ui/button";
import { CopyButton } from "@/registry/hirael/components/copy-button";
import { Textarea } from "@/registry/hirael/ui/textarea";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/hirael/ui/sheet";

export function ThemeSheetTrigger({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          aria-label="Open theme settings"
          className={cn("capitalize", className)}
        >
          <Palette className="size-4" />
          theme
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ThemeSheetBody />
      </SheetContent>
    </Sheet>
  );
}

function ThemeSheetBody() {
  const { mode, setMode, theme, mergeTheme, reset } = useTheme();
  const [paste, setPaste] = React.useState("");
  const [accentHue, setAccentHue] = React.useState(250);
  const [parseStatus, setParseStatus] = React.useState<
    | { kind: "idle" }
    | { kind: "ok"; msg: string }
    | { kind: "warn"; msg: string }
  >({ kind: "idle" });
  // Fall back to a helpful empty hint if no overrides set.
  const exportCss =
    formatThemeCss(theme) ||
    "/* No overrides yet. Paste a theme below or pick a preset to populate this. */";

  function applyPaste() {
    const { theme: parsed, warnings } = parseThemeCss(paste, mode);
    const lightCount = Object.keys(parsed.light ?? {}).length;
    const darkCount = Object.keys(parsed.dark ?? {}).length;
    if (!lightCount && !darkCount) {
      setParseStatus({
        kind: "warn",
        msg: warnings[0] ?? "No tokens recognized.",
      });
      return;
    }
    mergeTheme(parsed);
    const parts: string[] = [];
    if (darkCount) parts.push(`${darkCount} dark`);
    if (lightCount) parts.push(`${lightCount} light`);
    setParseStatus({
      kind: "ok",
      msg: `Applied ${parts.join(" + ")} token${darkCount + lightCount === 1 ? "" : "s"}.`,
    });
  }

  function applyPreset(presetId: string) {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    mergeTheme(preset.overrides);
    setParseStatus({ kind: "ok", msg: `Applied "${preset.label}" preset.` });
  }

  const activeRadius = theme[mode].radius ?? theme.dark.radius;

  function applyRadius(value: string) {
    mergeTheme(radiusTheme(value));
    setParseStatus({ kind: "ok", msg: `Radius set to ${value}.` });
  }

  function applyHue(hue: number) {
    setAccentHue(hue);
    mergeTheme(accentTheme(hue));
  }

  const overrideCount =
    Object.keys(theme.light).length + Object.keys(theme.dark).length;

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
          Preview Hirael components against your own theme. Generate an accent
          and radius, pick a preset, or paste a CSS variable block — then copy
          the result back out.
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
            Presets only override the accent and ring; neutrals stay intact.
          </p>
        </Section>

        <Section title="Generate" hint="radius + accent, both modes">
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-1.5 text-[11px] text-muted-foreground">Radius</p>
              <div className="grid grid-cols-6 gap-1">
                {RADIUS_OPTIONS.map((r) => {
                  const active = activeRadius === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => applyRadius(r)}
                      aria-pressed={active}
                      title={r}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-sm border px-1 py-1.5 transition-colors",
                        active
                          ? "border-foreground bg-accent text-foreground"
                          : "border-border bg-card text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span
                        aria-hidden
                        className="size-4 border border-current/40 bg-current/10"
                        style={{ borderRadius: r }}
                      />
                      <span className="font-mono text-[8px] tracking-tight">
                        {r.replace("rem", "")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-[11px] text-muted-foreground">Accent hue</p>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                  <span
                    aria-hidden
                    className="size-3.5 rounded-full border border-border"
                    style={{ background: `oklch(0.7 0.16 ${accentHue})` }}
                  />
                  {accentHue}°
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={accentHue}
                onChange={(e) => applyHue(Number(e.target.value))}
                aria-label="Accent hue"
                className="h-2 w-full cursor-pointer appearance-none rounded-full border border-border"
                style={{
                  background:
                    "linear-gradient(to right, oklch(0.7 0.16 0), oklch(0.7 0.16 60), oklch(0.7 0.16 120), oklch(0.7 0.16 180), oklch(0.7 0.16 240), oklch(0.7 0.16 300), oklch(0.7 0.16 360))",
                }}
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Sets primary, ring and primary-foreground for both modes.
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Paste CSS variables"
          hint={`Targets ${mode} when no .light/.dark selector is given`}
        >
          <Textarea
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder={`:root {\n  --background: oklch(...);\n  --foreground: oklch(...);\n  --primary: oklch(...);\n  ...\n}\n\n.dark {\n  ...\n}`}
            spellCheck={false}
            maxLength={10000}
            className="h-44 resize-y rounded-sm border-border bg-card field-sizing-fixed font-mono text-[11px] leading-relaxed placeholder:text-muted-foreground/60 dark:bg-card md:text-[11px]"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <p
              role="status"
              aria-live="polite"
              className={cn(
                "text-[11px]",
                parseStatus.kind === "warn"
                  ? "text-destructive"
                  : parseStatus.kind === "ok"
                    ? "text-foreground"
                    : "text-muted-foreground",
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
            <CopyButton
              value={exportCss}
              size="sm"
              variant="outline"
              disabled={!overrideCount}
            >
              Copy CSS
            </CopyButton>
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
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
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
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
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
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
      {active && <span className="ml-1 size-1.5 rounded-full bg-foreground" />}
    </button>
  );
}

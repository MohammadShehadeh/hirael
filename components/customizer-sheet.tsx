"use client";

import * as React from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  BASES,
  ICON_LIBRARIES,
  RADII,
  formatThemeCss,
  type CustomizerConfig,
} from "@/lib/customizer";
import { FONTS } from "@/lib/fonts";
import { getShadcnInitCommand, usePackageManager } from "@/lib/package-managers";
import { BASE_COLORS, getThemesForBaseColor, isBaseColor } from "@/registry/base-colors";
import type { ThemeItem } from "@/registry/themes";
import { useTheme } from "@/components/active-theme";
import { Button } from "@/registry/hirael/ui/button";
import { CopyButton } from "@/registry/hirael/components/copy-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/hirael/ui/select";
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
import { Switch } from "@/registry/hirael/ui/switch";

export const CustomizerTrigger = ({ className }: { className?: string }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Open customizer"
          className={className}
        >
          <SlidersHorizontal className="size-3.5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <CustomizerBody />
      </SheetContent>
    </Sheet>
  );
};

const CustomizerBody = () => {
  const { config, tokens, isDefault, setConfig, reset } = useTheme();
  const [pm] = usePackageManager();

  const themes = getThemesForBaseColor(config.baseColor);
  const css = formatThemeCss(tokens);
  const initCommand = getShadcnInitCommand(pm, `--base ${config.base}`);
  const setup = `${initCommand}\n\n// components.json\n"iconLibrary": "${config.iconLibrary}"`;

  const themeItems = (swatch: (theme: ThemeItem) => string): PickerItem[] =>
    themes.map((theme, i) => ({
      value: theme.name,
      label: theme.title,
      swatch: swatch(theme),
      // The base color's own neutral sits above the accents.
      separatorAfter: i === 0 && isBaseColor(theme.name),
    }));

  return (
    <>
      <SheetHeader>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
          ◆ customizer
        </span>
        <SheetTitle>Customizer</SheetTitle>
        <SheetDescription>
          Preview Hirael against your stack. Config describes the project you
          install into; Styles re-skin every component on this site.
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="flex flex-col gap-7">
        <Section title="Config">
          <Rows>
            <Row label="Base">
              <Picker
                ariaLabel="Base"
                value={config.base}
                onValueChange={(base) =>
                  setConfig({ base: base as CustomizerConfig["base"] })
                }
                items={BASES.map((b) => ({ value: b.name, label: b.title }))}
              />
            </Row>
            <Row label="Icon Library">
              <Picker
                ariaLabel="Icon library"
                value={config.iconLibrary}
                onValueChange={(iconLibrary) =>
                  setConfig({
                    iconLibrary:
                      iconLibrary as CustomizerConfig["iconLibrary"],
                  })
                }
                items={ICON_LIBRARIES.map((i) => ({
                  value: i.name,
                  label: i.title,
                }))}
              />
            </Row>
          </Rows>
          <pre className="mt-2 overflow-x-auto rounded-sm border border-border bg-card p-3 font-mono text-[11px] leading-relaxed">
            <code>{setup}</code>
          </pre>
          <div className="mt-2 flex items-start justify-between gap-3">
            <p className="text-[11px] text-muted-foreground">
              Hirael ships Radix-based primitives and lucide icons. Installed
              items resolve their shadcn dependencies against your project, so
              these only shape the setup above.
            </p>
            <CopyButton value={setup} size="sm" variant="outline">
              Copy
            </CopyButton>
          </div>
        </Section>

        <Section title="Styles">
          <Rows>
            <Row label="Preview only" hint="Demos and previews, not the site">
              <Switch
                aria-label="Preview only"
                checked={config.previewOnly}
                onCheckedChange={(previewOnly) => setConfig({ previewOnly })}
              />
            </Row>
            <Row label="Base Color">
              <Picker
                ariaLabel="Base color"
                value={config.baseColor}
                onValueChange={(baseColor) =>
                  setConfig({
                    baseColor: baseColor as CustomizerConfig["baseColor"],
                  })
                }
                items={BASE_COLORS.map((t) => ({
                  value: t.name,
                  label: t.title,
                  swatch: t.cssVars.light.background ?? "var(--background)",
                }))}
              />
            </Row>
            <Row label="Theme">
              <Picker
                ariaLabel="Theme"
                value={config.theme}
                onValueChange={(theme) => setConfig({ theme })}
                items={themeItems(
                  (t) => t.cssVars.light.primary ?? "var(--primary)",
                )}
              />
            </Row>
            <Row label="Chart Color">
              <Picker
                ariaLabel="Chart color"
                value={config.chartColor}
                onValueChange={(chartColor) => setConfig({ chartColor })}
                items={themeItems(
                  (t) => t.cssVars.light["chart-1"] ?? "var(--chart-1)",
                )}
              />
            </Row>
            <Row label="Font">
              <Picker
                ariaLabel="Font"
                value={config.font}
                onValueChange={(font) => setConfig({ font })}
                items={FONTS.map((f) => ({
                  value: f.name,
                  label: f.title,
                  style: { fontFamily: f.family },
                }))}
              />
            </Row>
            <Row label="Radius">
              <Picker
                ariaLabel="Radius"
                value={config.radius}
                onValueChange={(radius) =>
                  setConfig({ radius: radius as CustomizerConfig["radius"] })
                }
                items={RADII.map((r, i) => ({
                  value: r.name,
                  label: r.title,
                  radius: r.value || "var(--radius)",
                  separatorAfter: i === 0,
                }))}
              />
            </Row>
          </Rows>
        </Section>

        <Section title="Export" hint={isDefault ? "hirael defaults" : "custom"}>
          <pre className="max-h-40 overflow-auto rounded-sm border border-border bg-card p-3 font-mono text-[11px] leading-relaxed">
            <code>
              {css ||
                "/* Hirael defaults. Pick a base color, theme, chart color or radius to generate overrides. */"}
            </code>
          </pre>
          <div className="mt-2 flex items-center justify-end">
            <CopyButton
              value={css}
              size="sm"
              variant="outline"
              disabled={!css}
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
          disabled={isDefault}
        >
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
      </SheetFooter>
    </>
  );
};

interface PickerItem {
  value: string;
  label: string;
  swatch?: string;
  radius?: string;
  style?: React.CSSProperties;
  separatorAfter?: boolean;
}

const Picker = ({
  value,
  onValueChange,
  items,
  ariaLabel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  items: PickerItem[];
  ariaLabel: string;
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger size="sm" aria-label={ariaLabel} className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {items.map((item) => (
          <React.Fragment key={item.value}>
            <SelectItem value={item.value}>
              {item.swatch && (
                <span
                  aria-hidden
                  className="size-3 shrink-0 rounded-full border border-border"
                  style={{ background: item.swatch }}
                />
              )}
              {item.radius && (
                <span
                  aria-hidden
                  className="size-3.5 shrink-0 border border-current/50 bg-current/10"
                  style={{ borderRadius: `calc(${item.radius} * 0.5)` }}
                />
              )}
              <span style={item.style}>{item.label}</span>
            </SelectItem>
            {item.separatorAfter && <SelectSeparator />}
          </React.Fragment>
        ))}
      </SelectContent>
    </Select>
  );
};

const Rows = ({ children }: { children: React.ReactNode }) => (
  <div className="divide-y divide-border rounded-md border border-border bg-card px-3">
    {children}
  </div>
);

const Row = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="flex min-h-11 items-center justify-between gap-3 py-1.5">
    <div className="flex flex-col">
      <span className="text-xs text-foreground">{label}</span>
      {hint && (
        <span className="text-[11px] text-muted-foreground">{hint}</span>
      )}
    </div>
    {children}
  </div>
);

const Section = ({
  title,
  hint,
  children,
  className,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <section className={cn(className)}>
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
};

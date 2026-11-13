'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Paintbrush, RotateCcw, SlidersHorizontal } from 'lucide-react';

import { BASES, ICON_LIBRARIES, RADII, formatThemeCss, isEmbedPath } from '@/lib/customizer';
import { cn } from '@/lib/utils';
import { useIsApple } from '@/hooks/use-is-apple';
import { useMounted } from '@/hooks/use-mounted';
import { Hint } from '@/components/hint';
import { FONTS } from '@/lib/fonts';
import { themeSwatch, type SwatchKind } from '@/lib/theme-swatch';
import { getShadcnInitCommand, usePackageManager } from '@/lib/package-managers';
import { BASE_COLORS, getThemesForBaseColor, isBaseColor } from '@/registry/base-colors';

import { useTheme } from '@/components/active-theme';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { CopyButton } from '@/registry/hirael/bases/radix/components/copy-button';
import { Separator } from '@/registry/hirael/bases/radix/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/registry/hirael/bases/radix/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/registry/hirael/bases/radix/ui/sheet';
import { Switch } from '@/registry/hirael/bases/radix/ui/switch';

export interface CustomizerTriggerProps {
  className?: string;
}

interface PickerItem {
  value: string;
  label: string;
  swatch?: string;
  radius?: string;
  style?: React.CSSProperties;
  separatorAfter?: boolean;
}

interface PickerProps {
  value: string;
  onValueChange: (value: string) => void;
  items: PickerItem[];
  ariaLabel: string;
}

const Picker = ({ value, onValueChange, items, ariaLabel }: PickerProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger size="sm" aria-label={ariaLabel} className="w-40 shrink-0">
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

interface RowsProps {
  children: React.ReactNode;
}

const Rows = ({ children }: RowsProps) => (
  <div className="divide-y divide-border rounded-md border border-border bg-card px-3">{children}</div>
);

interface RowProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

const Row = ({ label, hint, children }: RowProps) => (
  <div className="flex min-h-11 items-center justify-between gap-4 py-1.5">
    <div className="flex min-w-0 flex-col">
      <span className="text-[13px] text-foreground">{label}</span>
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </div>
    {children}
  </div>
);

interface CodeCardProps {
  title: string;
  code: string;
  copyLabel: string;
  placeholder?: string;
}

const CodeCard = ({ title, code, copyLabel, placeholder }: CodeCardProps) => (
  <div className="overflow-hidden rounded-md border border-border bg-card">
    <div className="flex items-center justify-between gap-2 border-b border-border py-1 ps-3 pe-1.5">
      <span className="text-xs text-muted-foreground uppercase">{title}</span>
      <CopyButton value={code} size="sm" variant="ghost" disabled={!code} className="h-7">
        {copyLabel}
      </CopyButton>
    </div>
    {code ? (
      <pre className="max-h-48 overflow-auto p-3 font-mono text-[11px] leading-relaxed">
        <code>{code}</code>
      </pre>
    ) : (
      <p className="p-3 text-[11px] leading-relaxed text-muted-foreground">{placeholder}</p>
    )}
  </div>
);

interface SectionProps {
  title: string;
  hint?: string;
  children: React.ReactNode;
}

const Section = ({ title, hint, children }: SectionProps) => {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-xs text-muted-foreground uppercase">{title}</h3>
        {hint && <span className="text-[11px] text-muted-foreground/70 uppercase">{hint}</span>}
      </div>
      {children}
    </section>
  );
};

const CustomizerBody = () => {
  const { config, tokens, isDefault, mode, setConfig, reset } = useTheme();
  const { packageManager } = usePackageManager();

  const themes = getThemesForBaseColor(config.baseColor);
  const css = formatThemeCss(tokens);
  const initCommand = getShadcnInitCommand(packageManager, `--base ${config.base}`);
  const setup = `${initCommand}\n\n// components.json\n"iconLibrary": "${config.iconLibrary}"`;

  const buildThemeItems = (kind: SwatchKind): PickerItem[] =>
    themes.map((theme, index) => ({
      value: theme.name,
      label: theme.title,
      swatch: themeSwatch(theme, kind, mode),
      separatorAfter: index === 0 && isBaseColor(theme.name),
    }));

  return (
    <>
      <SheetHeader className="pe-12">
        <SheetTitle>Registry Customizer</SheetTitle>
        <SheetDescription>
          Preview Hirael against your stack. Base switches every preview and install command between Radix UI and Base
          UI. Styles re-skin the site.{' '}
          <Link
            href="/docs/customizer"
            className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            How it works
          </Link>
        </SheetDescription>
      </SheetHeader>
      <Separator />

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        <Section title="Config" hint="Icons stay lucide">
          <Rows>
            <Row label="Base">
              <Picker
                ariaLabel="Base"
                value={config.base}
                onValueChange={(base) => {
                  const option = BASES.find((item) => item.name === base);
                  if (option) setConfig({ base: option.name });
                }}
                items={BASES.map((base) => ({ value: base.name, label: base.title }))}
              />
            </Row>
            <Row label="Icon library">
              <Picker
                ariaLabel="Icon library"
                value={config.iconLibrary}
                onValueChange={(iconLibrary) => {
                  const option = ICON_LIBRARIES.find((item) => item.name === iconLibrary);
                  if (option) setConfig({ iconLibrary: option.name });
                }}
                items={ICON_LIBRARIES.map((library) => ({
                  value: library.name,
                  label: library.title,
                }))}
              />
            </Row>
          </Rows>
          <CodeCard title="Setup" code={setup} copyLabel="Copy" />
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
            <Row label="Base color">
              <Picker
                ariaLabel="Base color"
                value={config.baseColor}
                onValueChange={(baseColor) => {
                  if (isBaseColor(baseColor)) setConfig({ baseColor });
                }}
                items={BASE_COLORS.map((baseColor) => ({
                  value: baseColor.name,
                  label: baseColor.title,
                  swatch: themeSwatch(baseColor, 'base', mode),
                }))}
              />
            </Row>
            <Row label="Theme">
              <Picker
                ariaLabel="Theme"
                value={config.theme}
                onValueChange={(theme) => setConfig({ theme })}
                items={buildThemeItems('theme')}
              />
            </Row>
            <Row label="Chart color">
              <Picker
                ariaLabel="Chart color"
                value={config.chartColor}
                onValueChange={(chartColor) => setConfig({ chartColor })}
                items={buildThemeItems('chart')}
              />
            </Row>
            <Row label="Font">
              <Picker
                ariaLabel="Font"
                value={config.font}
                onValueChange={(font) => setConfig({ font })}
                items={FONTS.map((font) => ({
                  value: font.name,
                  label: font.title,
                  style: { fontFamily: font.family },
                }))}
              />
            </Row>
            <Row label="Radius">
              <Picker
                ariaLabel="Radius"
                value={config.radius}
                onValueChange={(radius) => {
                  const option = RADII.find((item) => item.name === radius);
                  if (option) setConfig({ radius: option.name });
                }}
                items={RADII.map((radius, index) => ({
                  value: radius.name,
                  label: radius.title,
                  radius: radius.value || 'var(--radius)',
                  separatorAfter: index === 0,
                }))}
              />
            </Row>
          </Rows>
        </Section>

        <Section title="Export" hint={isDefault ? 'Hirael defaults' : 'Custom'}>
          <CodeCard
            title="globals.css"
            code={css}
            copyLabel="Copy CSS"
            placeholder="Pick a base color, theme, chart color or radius to generate overrides."
          />
        </Section>
      </div>

      <Separator />
      <SheetFooter className="flex-row items-center justify-between">
        <p className="text-xs text-muted-foreground uppercase">Saved in this browser</p>
        <Button type="button" size="sm" variant="ghost" onClick={reset} disabled={isDefault}>
          <RotateCcw className="size-3.5" />
          Reset
        </Button>
      </SheetFooter>
    </>
  );
};

interface CustomizerContextValue {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CustomizerContext = React.createContext<CustomizerContextValue | null>(null);

export const useCustomizer = (): CustomizerContextValue => {
  const context = React.useContext(CustomizerContext);
  if (!context) throw new Error('useCustomizer must be used within CustomizerProvider');

  return context;
};

const CUSTOMIZER_KEY = '.';

const useCustomizerShortcut = () => (useIsApple() ? '⌘.' : 'Ctrl .');

export interface CustomizerProviderProps {
  children: React.ReactNode;
}

/** One sheet for the whole site, so the header, preview toolbars, search and ⌘. all open the same one. */
export const CustomizerProvider = ({ children }: CustomizerProviderProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const isEmbed = isEmbedPath(pathname ?? '');

  const [lastPathname, setLastPathname] = React.useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  React.useEffect(() => {
    if (isEmbed) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== CUSTOMIZER_KEY || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setIsOpen((prev) => !prev);
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isEmbed]);

  return (
    <CustomizerContext value={{ isOpen, setIsOpen }}>
      {children}
      {!isEmbed && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent className="w-full gap-0 sm:max-w-md" onOpenAutoFocus={(event) => event.preventDefault()}>
            <CustomizerBody />
          </SheetContent>
        </Sheet>
      )}
    </CustomizerContext>
  );
};

/** Marks a trigger while the previews run a non-default theme, so it is clear the customizer is in play. */
const CustomizedDot = () => {
  const { isDefault } = useTheme();
  const isMounted = useMounted();
  if (!isMounted || isDefault) return null;

  return (
    <span
      aria-hidden
      className="absolute -inset-e-0.5 -top-0.5 size-2 rounded-full border-2 border-background bg-primary"
    />
  );
};

const CUSTOMIZER_TITLE = 'Registry Customizer';

export const CustomizerTrigger = ({ className }: CustomizerTriggerProps) => {
  const { setIsOpen } = useCustomizer();
  const shortcut = useCustomizerShortcut();

  return (
    <Hint label={CUSTOMIZER_TITLE} shortcut={shortcut}>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Open ${CUSTOMIZER_TITLE.toLowerCase()}`}
        aria-keyshortcuts="Meta+. Control+."
        onClick={() => setIsOpen(true)}
        className={cn('relative', className)}
      >
        <SlidersHorizontal className="size-3.5" />
        <CustomizedDot />
      </Button>
    </Hint>
  );
};

/** The customizer entry point beside each live preview, where the change shows up. */
export const PreviewCustomizeButton = () => {
  const { setIsOpen } = useCustomizer();

  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      aria-label="Customize preview"
      onClick={() => setIsOpen(true)}
      className="relative"
    >
      <Paintbrush />
      <span className="hidden sm:inline">Customize</span>
      <CustomizedDot />
    </Button>
  );
};

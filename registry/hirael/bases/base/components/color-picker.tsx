'use client';

import * as React from 'react';
import { colord } from 'colord';
import { Pipette } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/registry/hirael/bases/base/ui/tabs';

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

interface ColorPickerContextValue {
  hex: string;
  setHex: (hex: string) => void;
  format: ColorFormat;
  setFormat: (f: ColorFormat) => void;
  swatches: string[];
  pushSwatch: (hex: string) => void;
  disabled?: boolean;
}

const ColorPickerContext = React.createContext<ColorPickerContextValue | null>(null);

const useColorPicker = () => {
  const ctx = React.useContext(ColorPickerContext);
  if (!ctx) {
    throw new Error('ColorPicker compound components must be used inside <ColorPicker>');
  }

  return ctx;
};

const DEFAULT_SWATCHES = ['#0ea5e9', '#22c55e', '#a855f7', '#f43f5e', '#f97316', '#facc15', '#14b8a6', '#64748b'];

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  format?: ColorFormat;
  defaultFormat?: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
  swatches?: string[];
  recentLimit?: number;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const ColorPicker = ({
  value: valueProp,
  defaultValue = '#0ea5e9',
  onValueChange,
  format: formatProp,
  defaultFormat = 'hex',
  onFormatChange,
  swatches: swatchesProp,
  recentLimit = 8,
  disabled,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
}: ColorPickerProps) => {
  const [internal, setInternal] = React.useState(defaultValue);
  const value = valueProp ?? internal;
  const setValue = React.useCallback(
    (hex: string) => {
      if (valueProp === undefined) setInternal(hex);
      onValueChange?.(hex);
    },
    [valueProp, onValueChange],
  );

  const [formatInternal, setFormatInternal] = React.useState<ColorFormat>(defaultFormat);
  const format = formatProp ?? formatInternal;
  const setFormat = React.useCallback(
    (next: ColorFormat) => {
      if (formatProp === undefined) setFormatInternal(next);
      onFormatChange?.(next);
    },
    [formatProp, onFormatChange],
  );

  const [recent, setRecent] = React.useState<string[]>([]);
  const pushSwatch = React.useCallback(
    (hex: string) =>
      setRecent((prev) => [hex, ...prev.filter((c) => c.toLowerCase() !== hex.toLowerCase())].slice(0, recentLimit)),
    [recentLimit],
  );

  const [openInternal, setOpenInternal] = React.useState(defaultOpen);
  const open = openProp ?? openInternal;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenInternal(next);
    onOpenChange?.(next);
    // Remember the colour the popover closes on, not every step of a drag.
    if (!next) pushSwatch(value.toLowerCase());
  };

  const swatches = React.useMemo(() => {
    const merged = swatchesProp ? [...swatchesProp, ...recent] : [...recent, ...DEFAULT_SWATCHES];

    return merged.filter((c, i) => merged.findIndex((o) => o.toLowerCase() === c.toLowerCase()) === i).slice(0, 16);
  }, [swatchesProp, recent]);

  const ctx = React.useMemo<ColorPickerContextValue>(
    () => ({ hex: value, setHex: setValue, format, setFormat, swatches, pushSwatch, disabled }),
    [value, setValue, format, setFormat, swatches, pushSwatch, disabled],
  );

  return (
    <ColorPickerContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </ColorPickerContext.Provider>
  );
};

interface ColorPickerTriggerProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  placeholder?: string;
  children?: React.ReactNode;
}

const ColorPickerTrigger = ({
  placeholder = 'Pick a color',
  className,
  children,
  ...props
}: ColorPickerTriggerProps) => {
  const ctx = useColorPicker();

  return (
    <PopoverTrigger
      render={
        <button
          type="button"
          disabled={ctx.disabled}
          data-slot="color-picker-trigger"
          className={cn(
            'inline-flex h-9 w-full items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-3 text-start text-sm uppercase tabular-nums transition-colors outline-none',
            'hover:border-ring/60 focus-visible:border-ring data-popup-open:border-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        />
      }
    >
      {children ?? (
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block size-5 shrink-0 rounded-sm border border-border"
            style={{ backgroundColor: ctx.hex }}
          />
          <span>{ctx.hex || placeholder}</span>
        </span>
      )}
    </PopoverTrigger>
  );
};

/** Saturation, brightness and hue in one control. */
const ColorPickerArea = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const ctx = useColorPicker();

  return (
    <div
      data-slot="color-picker-area"
      className={cn('[&_.react-colorful]:w-full', ctx.disabled && 'pointer-events-none opacity-50', className)}
      {...props}
    >
      <HexColorPicker color={ctx.hex} onChange={ctx.setHex} />
    </div>
  );
};

const ColorPickerFormatTabs = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Tabs>, 'value' | 'onValueChange'>) => {
  const ctx = useColorPicker();

  return (
    <Tabs
      {...props}
      data-slot="color-picker-format-tabs"
      value={ctx.format}
      onValueChange={(v) => ctx.setFormat(v as ColorFormat)}
      className={className}
    >
      <TabsList className="w-full">
        {(['hex', 'rgb', 'hsl'] as const).map((f) => (
          <TabsTrigger key={f} value={f} className="text-xs uppercase">
            {f}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

interface ChannelInputProps {
  value: number;
  max: number;
  onCommit: (n: number) => void;
  'aria-label': string;
}

// Keeps the raw text while editing, so clearing a field doesn't snap it to 0; out-of-range input clamps on blur or Enter.
const ChannelInput = ({ value, max, onCommit, 'aria-label': ariaLabel }: ChannelInputProps) => {
  const [draft, setDraft] = React.useState<string | null>(null);
  const parse = (raw: string) => (/^\d+$/.test(raw.trim()) ? Number(raw) : null);

  const commit = () => {
    const n = draft === null ? null : parse(draft);
    if (n !== null) onCommit(Math.min(max, n));
    setDraft(null);
  };

  return (
    <Input
      value={draft ?? String(Math.round(value))}
      onChange={(e) => {
        setDraft(e.target.value);
        const n = parse(e.target.value);
        if (n !== null && n <= max) onCommit(n);
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit();
      }}
      inputMode="numeric"
      aria-label={ariaLabel}
      className="h-8 px-2 text-center text-xs tabular-nums"
    />
  );
};

const ColorPickerFormatInputs = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const ctx = useColorPicker();
  const color = colord(ctx.hex);
  const [hexDraft, setHexDraft] = React.useState<string | null>(null);

  if (ctx.format === 'hex') {
    const commitHex = () => {
      const next = hexDraft && colord(hexDraft.startsWith('#') ? hexDraft : `#${hexDraft}`);
      if (next && next.isValid()) {
        ctx.setHex(next.toHex());
        ctx.pushSwatch(next.toHex());
      }
      setHexDraft(null);
    };

    return (
      <div {...props} data-slot="color-picker-format-inputs" className={className}>
        <Input
          value={hexDraft ?? ctx.hex.toUpperCase()}
          onChange={(e) => {
            setHexDraft(e.target.value.toUpperCase());
            const next = colord(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`);
            if (/^#?[0-9a-f]{6}$/i.test(e.target.value.trim()) && next.isValid()) ctx.setHex(next.toHex());
          }}
          onBlur={commitHex}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitHex();
          }}
          aria-label="Hex color"
          className="h-8 text-xs uppercase tabular-nums"
        />
      </div>
    );
  }

  const channels =
    ctx.format === 'rgb'
      ? (['r', 'g', 'b'] as const).map((k) => ({
          k,
          value: color.toRgb()[k],
          max: 255,
          commit: (n: number) => ctx.setHex(colord({ ...color.toRgb(), [k]: n }).toHex()),
        }))
      : (['h', 's', 'l'] as const).map((k) => ({
          k,
          value: color.toHsl()[k],
          max: k === 'h' ? 360 : 100,
          commit: (n: number) => ctx.setHex(colord({ ...color.toHsl(), [k]: n }).toHex()),
        }));

  return (
    <div {...props} data-slot="color-picker-format-inputs" className={cn('grid grid-cols-3 gap-1.5', className)}>
      {channels.map((c) => (
        <ChannelInput
          key={c.k}
          value={c.value}
          max={c.max}
          onCommit={c.commit}
          aria-label={`${c.k.toUpperCase()} channel`}
        />
      ))}
    </div>
  );
};

interface EyeDropperResult {
  sRGBHex: string;
}
type EyeDropperCtor = new () => { open: () => Promise<EyeDropperResult> };

const ColorPickerEyedropper = ({
  className,
  ...props
}: Omit<React.ComponentProps<'button'>, 'onClick' | 'children'>) => {
  const ctx = useColorPicker();
  const supported = React.useSyncExternalStore(
    () => () => {},
    () => 'EyeDropper' in window,
    () => false,
  );

  if (!supported) return null;

  return (
    <Button
      {...props}
      type="button"
      variant="outline"
      size="icon-sm"
      data-slot="color-picker-eyedropper"
      aria-label="Pick color from screen"
      onClick={async () => {
        try {
          const Ctor = (window as unknown as { EyeDropper: EyeDropperCtor }).EyeDropper;
          const dropper = new Ctor();
          const res = await dropper.open();
          const next = res.sRGBHex.toLowerCase();
          ctx.setHex(next);
          ctx.pushSwatch(next);
        } catch {}
      }}
      className={cn('shrink-0', className)}
    >
      <Pipette className="size-3.5" />
    </Button>
  );
};

const ColorPickerSwatches = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const ctx = useColorPicker();
  if (ctx.swatches.length === 0) return null;

  return (
    <div {...props} data-slot="color-picker-swatches" className={cn('flex flex-wrap gap-1', className)}>
      {ctx.swatches.map((s) => {
        const active = s.toLowerCase() === ctx.hex.toLowerCase();

        return (
          <button
            key={s}
            type="button"
            data-slot="color-picker-swatch"
            aria-label={`Use ${s}`}
            aria-pressed={active}
            onClick={() => {
              ctx.setHex(s.toLowerCase());
              ctx.pushSwatch(s.toLowerCase());
            }}
            className={cn(
              'size-5 rounded-sm border transition-transform hover:scale-110',
              active ? 'border-foreground ring-1 ring-foreground' : 'border-border',
            )}
            style={{ backgroundColor: s }}
          />
        );
      })}
    </div>
  );
};

/** Renders the default layout; pass children to compose your own from the parts. */
const ColorPickerContent = ({ className, children, ...props }: React.ComponentProps<typeof PopoverContent>) => {
  const ctx = useColorPicker();

  return (
    <PopoverContent align="start" data-slot="color-picker-content" className={cn('w-64 p-3', className)} {...props}>
      {children ?? (
        <div className="flex flex-col gap-3">
          <ColorPickerArea />
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              data-slot="color-picker-preview"
              className="inline-block h-8 flex-1 rounded-sm border border-border"
              style={{ backgroundColor: ctx.hex }}
            />
            <ColorPickerEyedropper />
          </div>
          <ColorPickerFormatTabs />
          <ColorPickerFormatInputs />
          <ColorPickerSwatches />
        </div>
      )}
    </PopoverContent>
  );
};

export {
  ColorPicker,
  ColorPickerTrigger,
  ColorPickerContent,
  ColorPickerArea,
  ColorPickerFormatTabs,
  ColorPickerFormatInputs,
  ColorPickerEyedropper,
  ColorPickerSwatches,
};

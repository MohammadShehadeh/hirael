'use client';

import * as React from 'react';
import { Pipette } from 'lucide-react';

import { cn } from '@/lib/utils';
import { composeRefs } from '@/registry/hirael/bases/base/components/compose-refs';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/registry/hirael/bases/base/ui/tabs';

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

interface RGB {
  r: number;
  g: number;
  b: number;
}
interface HSV {
  h: number;
  s: number;
  v: number;
}
interface HSL {
  h: number;
  s: number;
  l: number;
}

interface ColorPickerContextValue {
  hsv: HSV;
  setHsv: (h: HSV) => void;
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

const clamp = (n: number, lo: number, hi: number) => {
  return Math.max(lo, Math.min(hi, n));
};

const hexToRgb = (hex: string): RGB | null => {
  const m = hex.replace(/^#/, '');
  if (m.length === 3) {
    const r = parseInt(m[0] + m[0], 16);
    const g = parseInt(m[1] + m[1], 16);
    const b = parseInt(m[2] + m[2], 16);
    if ([r, g, b].some(Number.isNaN)) return null;

    return { r, g, b };
  }
  if (m.length === 6) {
    const r = parseInt(m.slice(0, 2), 16);
    const g = parseInt(m.slice(2, 4), 16);
    const b = parseInt(m.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return null;

    return { r, g, b };
  }

  return null;
};

const rgbToHex = ({ r, g, b }: RGB): string => {
  const h = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');

  return `#${h(r)}${h(g)}${h(b)}`;
};

const rgbToHsv = ({ r, g, b }: RGB): HSV => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  const v = max;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case rn:
        h = ((gn - bn) / d) % 6;
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      case bn:
        h = (rn - gn) / d + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s: s * 100, v: v * 100 };
};

const hsvToRgb = ({ h, s, v }: HSV): RGB => {
  const sn = s / 100;
  const vn = v / 100;
  const c = vn * sn;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp >= 0 && hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = vn - c;

  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  };
};

const rgbToHsl = ({ r, g, b }: RGB): HSL => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
        break;
      case gn:
        h = ((bn - rn) / d + 2) * 60;
        break;
      case bn:
        h = ((rn - gn) / d + 4) * 60;
        break;
    }
  }

  return { h, s: s * 100, l: l * 100 };
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
  const [openInternal, setOpenInternal] = React.useState(defaultOpen);
  const open = openProp ?? openInternal;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenInternal(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const [internal, setInternal] = React.useState<string>(defaultValue);
  const value = valueProp ?? internal;

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

  const [hsv, setHsv] = React.useState<HSV>(() => rgbToHsv(hexToRgb(value) ?? { r: 14, g: 165, b: 233 }));

  const [lastValue, setLastValue] = React.useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    const rgb = hexToRgb(value);
    if (rgb) {
      const parsed = rgbToHsv(rgb);
      setHsv((prev) => {
        const next = {
          h: parsed.s === 0 || parsed.v === 0 ? prev.h : parsed.h,
          s: parsed.v === 0 ? prev.s : parsed.s,
          v: parsed.v,
        };

        return Math.abs(prev.h - next.h) < 0.5 && Math.abs(prev.s - next.s) < 0.5 && Math.abs(prev.v - next.v) < 0.5
          ? prev
          : next;
      });
    }
  }

  const setValue = React.useCallback(
    (hex: string) => {
      if (valueProp === undefined) setInternal(hex);
      onValueChange?.(hex);
    },
    [valueProp, onValueChange],
  );

  const setHsvAndPropagate = React.useCallback(
    (next: HSV) => {
      const hex = rgbToHex(hsvToRgb(next));
      setHsv(next);
      // Marks the echo as seen so it is not re-derived: greys and black lose hue/saturation in hex.
      setLastValue(hex);
      setValue(hex);
    },
    [setValue],
  );

  const pushSwatch = React.useCallback(
    (hex: string) => {
      setRecent((prev) => {
        const filtered = prev.filter((c) => c.toLowerCase() !== hex.toLowerCase());

        return [hex, ...filtered].slice(0, recentLimit);
      });
    },
    [recentLimit],
  );

  const swatches = React.useMemo(() => {
    const merged = swatchesProp ? [...swatchesProp, ...recent] : [...recent, ...DEFAULT_SWATCHES];
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const c of merged) {
      const key = c.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(c);
    }

    return unique.slice(0, 16);
  }, [swatchesProp, recent]);

  const ctx = React.useMemo<ColorPickerContextValue>(
    () => ({
      hsv,
      setHsv: setHsvAndPropagate,
      hex: value,
      setHex: setValue,
      format,
      setFormat,
      swatches,
      pushSwatch,
      disabled,
    }),
    [hsv, setHsvAndPropagate, value, setValue, format, setFormat, swatches, pushSwatch, disabled],
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

const ColorPickerArea = ({ className, ref, ...props }: React.ComponentProps<'div'>) => {
  const ctx = useColorPicker();
  const areaRef = React.useRef<HTMLDivElement>(null);
  const composedRef = React.useMemo(() => composeRefs(areaRef, ref), [ref]);
  const draggingRef = React.useRef(false);

  const updateFromPointer = (clientX: number, clientY: number) => {
    const el = areaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clamp((clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((clientY - rect.top) / rect.height, 0, 1);
    ctx.setHsv({ h: ctx.hsv.h, s: x * 100, v: (1 - y) * 100 });
  };

  // A cancelled or lost capture (touch scroll, alt-tab) ends the drag too, or the thumb would follow a hovering pointer.
  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    ctx.pushSwatch(ctx.hex.toLowerCase());
  };

  const pureHue = rgbToHex(hsvToRgb({ h: ctx.hsv.h, s: 100, v: 100 }));

  return (
    <div
      ref={composedRef}
      data-slot="color-picker-area"
      role="slider"
      aria-valuetext={`saturation ${Math.round(ctx.hsv.s)}%, brightness ${Math.round(ctx.hsv.v)}%`}
      aria-valuenow={Math.round(ctx.hsv.s)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      {...props}
      aria-label={props['aria-label'] ?? 'Saturation and brightness'}
      onPointerDown={(e) => {
        props.onPointerDown?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        // Pointer capture routes the rest of the drag to this element, even outside it.
        e.currentTarget.setPointerCapture(e.pointerId);
        draggingRef.current = true;
        updateFromPointer(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        props.onPointerMove?.(e);
        if (draggingRef.current) updateFromPointer(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        props.onPointerUp?.(e);
        endDrag();
      }}
      onPointerCancel={(e) => {
        props.onPointerCancel?.(e);
        endDrag();
      }}
      onLostPointerCapture={(e) => {
        props.onLostPointerCapture?.(e);
        endDrag();
      }}
      onKeyDown={(e) => {
        props.onKeyDown?.(e);
        if (e.defaultPrevented) return;
        const step = e.shiftKey ? 10 : 2;
        let { s, v } = ctx.hsv;
        switch (e.key) {
          case 'ArrowLeft':
            s -= step;
            break;
          case 'ArrowRight':
            s += step;
            break;
          case 'ArrowUp':
            v += step;
            break;
          case 'ArrowDown':
            v -= step;
            break;
          default:
            return;
        }
        e.preventDefault();
        ctx.setHsv({ h: ctx.hsv.h, s: clamp(s, 0, 100), v: clamp(v, 0, 100) });
      }}
      className={cn(
        'relative h-40 w-full cursor-crosshair touch-none rounded-sm border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      style={{
        background: `
          linear-gradient(to top, #000, transparent),
          linear-gradient(to right, #fff, ${pureHue})
        `,
      }}
    >
      <span
        aria-hidden
        data-slot="color-picker-area-thumb"
        className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)]"
        style={{
          left: `${ctx.hsv.s}%`,
          top: `${100 - ctx.hsv.v}%`,
        }}
      />
    </div>
  );
};

const ColorPickerHueSlider = ({ className, ref, ...props }: React.ComponentProps<'div'>) => {
  const ctx = useColorPicker();
  const trackRef = React.useRef<HTMLDivElement>(null);
  const composedRef = React.useMemo(() => composeRefs(trackRef, ref), [ref]);
  const draggingRef = React.useRef(false);

  const updateFromPointer = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clamp((clientX - rect.left) / rect.width, 0, 1);
    ctx.setHsv({ h: x * 360, s: ctx.hsv.s, v: ctx.hsv.v });
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    ctx.pushSwatch(ctx.hex.toLowerCase());
  };

  return (
    <div
      ref={composedRef}
      data-slot="color-picker-hue-slider"
      role="slider"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(ctx.hsv.h)}
      tabIndex={0}
      {...props}
      aria-label={props['aria-label'] ?? 'Hue'}
      onPointerDown={(e) => {
        props.onPointerDown?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        // Pointer capture routes the rest of the drag to this element, even outside it.
        e.currentTarget.setPointerCapture(e.pointerId);
        draggingRef.current = true;
        updateFromPointer(e.clientX);
      }}
      onPointerMove={(e) => {
        props.onPointerMove?.(e);
        if (draggingRef.current) updateFromPointer(e.clientX);
      }}
      onPointerUp={(e) => {
        props.onPointerUp?.(e);
        endDrag();
      }}
      onPointerCancel={(e) => {
        props.onPointerCancel?.(e);
        endDrag();
      }}
      onLostPointerCapture={(e) => {
        props.onLostPointerCapture?.(e);
        endDrag();
      }}
      onKeyDown={(e) => {
        props.onKeyDown?.(e);
        if (e.defaultPrevented) return;
        const step = e.shiftKey ? 24 : 6;
        let h = ctx.hsv.h;
        if (e.key === 'ArrowLeft') h -= step;
        else if (e.key === 'ArrowRight') h += step;
        else return;
        e.preventDefault();
        if (h < 0) h += 360;
        if (h > 360) h -= 360;
        ctx.setHsv({ h, s: ctx.hsv.s, v: ctx.hsv.v });
      }}
      className={cn(
        'relative h-3 w-full cursor-pointer touch-none rounded-full border border-border bg-[linear-gradient(to_right,#f00_0%,#ff0_17%,#0f0_33%,#0ff_50%,#00f_67%,#f0f_83%,#f00_100%)] outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      <span
        aria-hidden
        data-slot="color-picker-hue-slider-thumb"
        className="pointer-events-none absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)]"
        style={{ left: `${(ctx.hsv.h / 360) * 100}%` }}
      />
    </div>
  );
};

const ColorPickerFormatTabs = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Tabs>, 'value' | 'onValueChange'>) => {
  const ctx = useColorPicker();
  const formats: ColorFormat[] = ['hex', 'rgb', 'hsl'];

  return (
    <Tabs
      {...props}
      data-slot="color-picker-format-tabs"
      value={ctx.format}
      onValueChange={(v) => ctx.setFormat(v as ColorFormat)}
      className={className}
    >
      <TabsList className="w-full">
        {formats.map((f) => (
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

  const parse = (raw: string) => {
    if (!/^\d+$/.test(raw.trim())) return null;

    return parseInt(raw, 10);
  };

  const commit = () => {
    if (draft === null) return;
    const n = parse(draft);
    if (n !== null) onCommit(clamp(n, 0, max));
    setDraft(null);
  };

  return (
    <Input
      value={draft ?? String(Math.round(value))}
      onChange={(e) => {
        const raw = e.target.value;
        setDraft(raw);
        const n = parse(raw);
        if (n !== null && n <= max) onCommit(n);
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit();
      }}
      inputMode="numeric"
      aria-label={ariaLabel}
      className="h-8 px-2 text-center font-mono text-xs tabular-nums"
    />
  );
};

const ColorPickerFormatInputs = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const ctx = useColorPicker();
  const rgb = hexToRgb(ctx.hex) ?? { r: 0, g: 0, b: 0 };
  const hsl = rgbToHsl(rgb);

  const [hexDraft, setHexDraft] = React.useState(ctx.hex.toUpperCase());
  const [hexFocused, setHexFocused] = React.useState(false);
  const hexDisplay = hexFocused ? hexDraft : ctx.hex.toUpperCase();

  const parseHex = (raw: string) => {
    const v = raw.trim();
    if (!/^#?[0-9a-fA-F]{6}$/.test(v)) return null;

    return (v.startsWith('#') ? v : `#${v}`).toLowerCase();
  };

  const commitHexDraft = () => {
    const next = parseHex(hexDraft);
    if (next) {
      ctx.setHex(next);
      ctx.pushSwatch(next);
      setHexDraft(next.toUpperCase());
    } else {
      setHexDraft(ctx.hex.toUpperCase());
    }
  };

  if (ctx.format === 'hex') {
    return (
      <div {...props} data-slot="color-picker-format-inputs" className={className}>
        <Input
          value={hexDisplay}
          onChange={(e) => {
            const raw = e.target.value;
            setHexDraft(raw.toUpperCase());
            const next = parseHex(raw);
            if (next) ctx.setHex(next);
          }}
          onFocus={() => {
            setHexDraft(ctx.hex.toUpperCase());
            setHexFocused(true);
          }}
          onBlur={() => {
            setHexFocused(false);
            commitHexDraft();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitHexDraft();
          }}
          aria-label="Hex color"
          className="h-8 text-xs uppercase tabular-nums"
        />
      </div>
    );
  }
  if (ctx.format === 'rgb') {
    const setChannel = (k: keyof RGB, n: number) => {
      ctx.setHex(rgbToHex({ ...rgb, [k]: n }));
    };

    return (
      <div {...props} data-slot="color-picker-format-inputs" className={cn('grid grid-cols-3 gap-1.5', className)}>
        {(['r', 'g', 'b'] as const).map((k) => (
          <ChannelInput
            key={k}
            value={rgb[k]}
            max={255}
            onCommit={(n) => setChannel(k, n)}
            aria-label={`${k.toUpperCase()} channel`}
          />
        ))}
      </div>
    );
  }
  const setHslChannel = (k: keyof HSL, n: number) => {
    const next = { ...hsl, [k]: n };
    const v = next.l / 100;
    const sn = next.s / 100;
    const max2 = v + sn * Math.min(v, 1 - v);
    const hsvS = max2 === 0 ? 0 : 2 * (1 - v / max2);
    ctx.setHsv({ h: next.h, s: hsvS * 100, v: max2 * 100 });
  };

  return (
    <div {...props} data-slot="color-picker-format-inputs" className={cn('grid grid-cols-3 gap-1.5', className)}>
      {(['h', 's', 'l'] as const).map((k) => (
        <ChannelInput
          key={k}
          value={hsl[k]}
          max={k === 'h' ? 360 : 100}
          onCommit={(n) => setHslChannel(k, n)}
          aria-label={`${k.toUpperCase()} channel`}
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
              className="inline-block size-8 shrink-0 rounded-sm border border-border"
              style={{ backgroundColor: ctx.hex }}
            />
            <div className="flex-1">
              <ColorPickerHueSlider />
            </div>
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
  ColorPickerHueSlider,
  ColorPickerFormatTabs,
  ColorPickerFormatInputs,
  ColorPickerEyedropper,
  ColorPickerSwatches,
};

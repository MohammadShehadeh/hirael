'use client';

import * as React from 'react';
import SignaturePadLib from 'signature_pad';
import { Eraser, Undo2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

interface SignaturePadDataURLOptions {
  backgroundColor?: string;
  /** Ink for this export; overrides the pad's `exportColor`. */
  inkColor?: string;
}

export interface SignaturePadRef {
  clear: () => void;
  undo: () => void;
  isEmpty: () => boolean;
  toDataURL: (type?: string, opts?: SignaturePadDataURLOptions) => string;
}

interface SignaturePadContextValue {
  clear: () => void;
  undo: () => void;
  empty: boolean;
  disabled?: boolean;
}

const SignaturePadContext = React.createContext<SignaturePadContextValue | null>(null);

const useSignaturePad = () => {
  const ctx = React.useContext(SignaturePadContext);
  if (!ctx) {
    throw new Error('SignaturePad compound components must be used inside <SignaturePad>');
  }

  return ctx;
};

// Redraws `source`'s strokes through `target` (the same pad, or one on an export canvas) in one ink.
const paint = (canvas: HTMLCanvasElement, source: SignaturePadLib, target: SignaturePadLib, ink: string) => {
  const dpr = Math.max(window.devicePixelRatio || 1, 1);
  canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
  target.penColor = ink;
  target.fromData(source.toData().map((group) => ({ ...group, penColor: ink })));

  return target;
};

export interface SignaturePadProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'ref'> {
  /** Ink while drawing. Defaults to the current text color, so it follows the theme. */
  penColor?: string;
  /** Ink used by `toDataURL`. Defaults to `penColor`, else black, so a dark-theme signature doesn't export white. */
  exportColor?: string;
  minStrokeWidth?: number;
  maxStrokeWidth?: number;
  onChange?: (isEmpty: boolean) => void;
  onStrokeEnd?: () => void;
  disabled?: boolean;
  placeholder?: React.ReactNode;
  ref?: React.Ref<SignaturePadRef>;
}

const SignaturePad = ({
  penColor,
  exportColor,
  minStrokeWidth = 1.5,
  maxStrokeWidth = 3.5,
  onChange,
  onStrokeEnd,
  disabled,
  placeholder,
  className,
  children,
  ref,
  'aria-label': ariaLabel,
  ...props
}: SignaturePadProps) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const padRef = React.useRef<SignaturePadLib | null>(null);
  const [empty, setEmpty] = React.useState(true);

  const onChangeRef = React.useRef(onChange);
  const onStrokeEndRef = React.useRef(onStrokeEnd);
  React.useLayoutEffect(() => {
    onChangeRef.current = onChange;
    onStrokeEndRef.current = onStrokeEnd;
  });

  const setEmptyState = React.useCallback((next: boolean) => {
    setEmpty((prev) => {
      if (prev !== next) onChangeRef.current?.(next);

      return next;
    });
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ink = () => penColor ?? (getComputedStyle(canvas).color || '#000');
    const pad = new SignaturePadLib(canvas, { minWidth: minStrokeWidth, maxWidth: maxStrokeWidth, penColor: ink() });
    padRef.current = pad;
    pad.addEventListener('beginStroke', () => setEmptyState(false));
    pad.addEventListener('endStroke', () => onStrokeEndRef.current?.());

    const resize = () => {
      const dpr = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = Math.max(1, Math.round(canvas.offsetWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.offsetHeight * dpr));
      paint(canvas, pad, pad, ink());
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    // A theme switch changes the text color the ink follows.
    const themeObserver = new MutationObserver(() => paint(canvas, pad, pad, ink()));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });

    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      pad.off();
      padRef.current = null;
    };
  }, [penColor, minStrokeWidth, maxStrokeWidth, setEmptyState]);

  const clear = React.useCallback(() => {
    padRef.current?.clear();
    setEmptyState(true);
  }, [setEmptyState]);

  const undo = React.useCallback(() => {
    const pad = padRef.current;
    if (!pad) return;
    const strokes = pad.toData();
    strokes.pop();
    pad.fromData(strokes);
    setEmptyState(strokes.length === 0);
  }, [setEmptyState]);

  React.useImperativeHandle(
    ref,
    () => ({
      clear,
      undo,
      isEmpty: () => padRef.current?.isEmpty() ?? true,
      toDataURL: (type = 'image/png', opts) => {
        const canvas = canvasRef.current;
        const pad = padRef.current;
        if (!canvas || !pad) return '';
        const off = document.createElement('canvas');
        off.width = canvas.width;
        off.height = canvas.height;
        const exporter = new SignaturePadLib(off, { backgroundColor: opts?.backgroundColor });
        paint(off, pad, exporter, opts?.inkColor ?? exportColor ?? penColor ?? '#000000');
        const url = exporter.toDataURL(type);
        exporter.off();

        return url;
      },
    }),
    [clear, undo, exportColor, penColor],
  );

  const ctxValue = React.useMemo<SignaturePadContextValue>(
    () => ({ clear, undo, empty, disabled }),
    [clear, undo, empty, disabled],
  );

  return (
    <SignaturePadContext.Provider value={ctxValue}>
      <div
        data-slot="signature-pad"
        data-empty={empty ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        className={cn(
          'relative h-40 w-full overflow-hidden rounded-md border border-input bg-transparent text-foreground transition-colors',
          'focus-within:border-ring',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        {...props}
      >
        <canvas
          ref={canvasRef}
          data-slot="signature-pad-canvas"
          role="img"
          aria-roledescription="signature pad"
          aria-label={ariaLabel ?? 'Signature pad. Draw using a mouse or touch.'}
          className="absolute inset-0 size-full cursor-crosshair touch-none"
        />
        <div
          aria-hidden
          data-slot="signature-pad-baseline"
          className={cn(
            'pointer-events-none absolute start-4 end-4 bottom-7 flex items-end gap-2 transition-opacity duration-300',
            empty ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span className="pb-1 text-sm text-muted-foreground/70">✕</span>
          <span className="h-px flex-1 border-b border-dashed border-muted-foreground/40" />
        </div>
        {placeholder != null && (
          <div
            aria-hidden
            data-slot="signature-pad-placeholder"
            className={cn(
              'pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-muted-foreground/60 transition-opacity duration-300',
              empty ? 'opacity-100' : 'opacity-0',
            )}
          >
            {placeholder}
          </div>
        )}
        {children}
      </div>
    </SignaturePadContext.Provider>
  );
};

const SignaturePadClear = ({ className, children, onClick, ...props }: React.ComponentProps<typeof Button>) => {
  const ctx = useSignaturePad();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      data-slot="signature-pad-clear"
      disabled={ctx.disabled || ctx.empty}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        ctx.clear();
      }}
      className={className}
      {...props}
    >
      <Eraser />
      {children ?? 'Clear'}
    </Button>
  );
};

const SignaturePadUndo = ({ className, children, onClick, ...props }: React.ComponentProps<typeof Button>) => {
  const ctx = useSignaturePad();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      data-slot="signature-pad-undo"
      disabled={ctx.disabled || ctx.empty}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        ctx.undo();
      }}
      className={className}
      {...props}
    >
      <Undo2 />
      {children ?? 'Undo'}
    </Button>
  );
};

export { SignaturePad, SignaturePadClear, SignaturePadUndo };

"use client";

import * as React from "react";
import { Eraser, Undo2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";

type Point = { x: number; y: number; w: number };
type Stroke = Point[];

export type SignaturePadRef = {
  clear: () => void;
  undo: () => void;
  isEmpty: () => boolean;
  toDataURL: (type?: string, opts?: { backgroundColor?: string }) => string;
};

type SignaturePadContextValue = {
  clear: () => void;
  undo: () => void;
  empty: boolean;
  disabled?: boolean;
};

const SignaturePadContext =
  React.createContext<SignaturePadContextValue | null>(null);

function useSignaturePad() {
  const ctx = React.useContext(SignaturePadContext);
  if (!ctx) {
    throw new Error(
      "SignaturePad compound components must be used inside <SignaturePad>",
    );
  }
  return ctx;
}

function midpoint(a: Point, b: Point) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function drawSegment(ctx: CanvasRenderingContext2D, points: Stroke, i: number) {
  const prev = points[i - 1];
  const curr = points[i];
  const start = i > 1 ? midpoint(points[i - 2], prev) : prev;
  const end = midpoint(prev, curr);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.quadraticCurveTo(prev.x, prev.y, end.x, end.y);
  ctx.lineWidth = curr.w;
  ctx.stroke();
}

function drawStroke(ctx: CanvasRenderingContext2D, points: Stroke) {
  if (points.length === 0) return;
  if (points.length === 1) {
    const p = points[0];
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(p.w / 2, 0.5), 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  for (let i = 1; i < points.length; i++) {
    drawSegment(ctx, points, i);
  }
}

export type SignaturePadProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "ref"
> & {
  penColor?: string;
  minStrokeWidth?: number;
  maxStrokeWidth?: number;
  onChange?: (isEmpty: boolean) => void;
  onStrokeEnd?: () => void;
  disabled?: boolean;
  placeholder?: React.ReactNode;
  ref?: React.Ref<SignaturePadRef>;
};

function SignaturePad({
  penColor,
  minStrokeWidth = 1.5,
  maxStrokeWidth = 3.5,
  onChange,
  onStrokeEnd,
  disabled,
  placeholder,
  className,
  children,
  ref,
  ...props
}: SignaturePadProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const strokesRef = React.useRef<Stroke[]>([]);
  const drawingRef = React.useRef(false);
  const lastTimeRef = React.useRef(0);
  const [empty, setEmpty] = React.useState(true);
  const emptyRef = React.useRef(true);

  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;
  const onStrokeEndRef = React.useRef(onStrokeEnd);
  onStrokeEndRef.current = onStrokeEnd;

  const setEmptyState = React.useCallback((next: boolean) => {
    if (emptyRef.current === next) return;
    emptyRef.current = next;
    setEmpty(next);
    onChangeRef.current?.(next);
  }, []);

  const resolveInk = React.useCallback(() => {
    if (penColor) return penColor;
    const canvas = canvasRef.current;
    if (!canvas) return "#000";
    return getComputedStyle(canvas).color || "#000";
  }, [penColor]);

  const getCtx = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return null;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const ink = resolveInk();
    ctx.strokeStyle = ink;
    ctx.fillStyle = ink;
    return ctx;
  }, [resolveInk]);

  const redraw = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    for (const stroke of strokesRef.current) {
      drawStroke(ctx, stroke);
    }
  }, [getCtx]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      redraw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const mo = new MutationObserver(redraw);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [redraw]);

  const clear = React.useCallback(() => {
    strokesRef.current = [];
    redraw();
    setEmptyState(true);
  }, [redraw, setEmptyState]);

  const undo = React.useCallback(() => {
    strokesRef.current = strokesRef.current.slice(0, -1);
    redraw();
    setEmptyState(strokesRef.current.length === 0);
  }, [redraw, setEmptyState]);

  React.useImperativeHandle(
    ref,
    () => ({
      clear,
      undo,
      isEmpty: () => strokesRef.current.length === 0,
      toDataURL: (type = "image/png", opts) => {
        const canvas = canvasRef.current;
        if (!canvas) return "";
        const off = document.createElement("canvas");
        off.width = canvas.width;
        off.height = canvas.height;
        const ctx = off.getContext("2d");
        if (!ctx) return "";
        const dpr = window.devicePixelRatio || 1;
        if (opts?.backgroundColor) {
          ctx.fillStyle = opts.backgroundColor;
          ctx.fillRect(0, 0, off.width, off.height);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        const ink = resolveInk();
        ctx.strokeStyle = ink;
        ctx.fillStyle = ink;
        for (const stroke of strokesRef.current) {
          drawStroke(ctx, stroke);
        }
        return off.toDataURL(type);
      },
    }),
    [clear, undo, resolveInk],
  );

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || !e.isPrimary) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastTimeRef.current = e.timeStamp;
    const { x, y } = pointFromEvent(e);
    const w = (minStrokeWidth + maxStrokeWidth) / 2;
    strokesRef.current = [...strokesRef.current, [{ x, y, w }]];
    const ctx = getCtx();
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, Math.max(w / 2, 0.5), 0, Math.PI * 2);
      ctx.fill();
    }
    setEmptyState(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || disabled) return;
    const stroke = strokesRef.current[strokesRef.current.length - 1];
    if (!stroke) return;
    const prev = stroke[stroke.length - 1];
    const { x, y } = pointFromEvent(e);
    const dist = Math.hypot(x - prev.x, y - prev.y);
    if (dist < 0.5) return;
    const dt = Math.max(1, e.timeStamp - lastTimeRef.current);
    lastTimeRef.current = e.timeStamp;
    const velocity = dist / dt;
    const target =
      maxStrokeWidth -
      (maxStrokeWidth - minStrokeWidth) * Math.min(1, velocity / 3);
    const w = prev.w + (target - prev.w) * 0.35;
    stroke.push({ x, y, w });
    const ctx = getCtx();
    if (ctx) drawSegment(ctx, stroke, stroke.length - 1);
  };

  const endStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    onStrokeEndRef.current?.();
  };

  const ctxValue = React.useMemo<SignaturePadContextValue>(
    () => ({ clear, undo, empty, disabled }),
    [clear, undo, empty, disabled],
  );

  return (
    <SignaturePadContext.Provider value={ctxValue}>
      <div
        data-slot="signature-pad"
        data-empty={empty ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        className={cn(
          "relative h-40 w-full overflow-hidden rounded-md border border-input bg-transparent text-foreground transition-colors",
          "focus-within:border-ring",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        {...props}
      >
        <canvas
          ref={canvasRef}
          data-slot="signature-pad-canvas"
          role="img"
          aria-label="Signature pad"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
          className="absolute inset-0 size-full cursor-crosshair touch-none"
        />
        <div
          aria-hidden
          data-slot="signature-pad-baseline"
          className={cn(
            "pointer-events-none absolute bottom-7 left-4 right-4 flex items-end gap-2 transition-opacity duration-300",
            empty ? "opacity-100" : "opacity-0",
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
              "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-muted-foreground/60 transition-opacity duration-300",
              empty ? "opacity-100" : "opacity-0",
            )}
          >
            {placeholder}
          </div>
        )}
        {children}
      </div>
    </SignaturePadContext.Provider>
  );
}

function SignaturePadClear({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const ctx = useSignaturePad();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      data-slot="signature-pad-clear"
      disabled={ctx.disabled || ctx.empty}
      onClick={() => ctx.clear()}
      className={cn(className)}
      {...props}
    >
      <Eraser aria-hidden />
      {children ?? "Clear"}
    </Button>
  );
}

function SignaturePadUndo({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const ctx = useSignaturePad();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      data-slot="signature-pad-undo"
      disabled={ctx.disabled || ctx.empty}
      onClick={() => ctx.undo()}
      className={cn(className)}
      {...props}
    >
      <Undo2 aria-hidden />
      {children ?? "Undo"}
    </Button>
  );
}

export { SignaturePad, SignaturePadClear, SignaturePadUndo };

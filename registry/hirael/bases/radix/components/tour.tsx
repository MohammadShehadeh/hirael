'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

export interface TourStep {
  target: string | React.RefObject<HTMLElement | null>;
  title: React.ReactNode;
  description?: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export interface TourLabels {
  next?: React.ReactNode;
  back?: React.ReactNode;
  skip?: React.ReactNode;
  finish?: React.ReactNode;
}

interface TourContextValue {
  open: boolean;
  step: number;
  start: (at?: number) => void;
  stop: () => void;
  next: () => void;
  back: () => void;
}

const NEVER_CHANGES = () => () => {};

const TourContext = React.createContext<TourContextValue | null>(null);

const useTour = () => {
  const ctx = React.useContext(TourContext);
  if (!ctx) {
    throw new Error('Tour compound parts must be used inside <Tour>');
  }

  return ctx;
};

const resolveTarget = (target: TourStep['target'] | undefined): HTMLElement | null => {
  if (!target) return null;
  if (typeof target === 'string') {
    return document.querySelector<HTMLElement>(target);
  }

  return target.current;
};

export interface TourProps {
  steps: TourStep[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  onFinish?: () => void;
  scrollIntoView?: boolean;
  spotlightPadding?: number;
  labels?: TourLabels;
  children?: React.ReactNode;
}

const Tour = ({
  steps,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  step: stepProp,
  defaultStep = 0,
  onStepChange,
  onFinish,
  scrollIntoView = true,
  spotlightPadding = 8,
  labels,
  children,
}: TourProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (openProp === undefined) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [openProp, onOpenChange],
  );

  const [internalStep, setInternalStep] = React.useState(defaultStep);
  const step = stepProp ?? internalStep;
  const setStep = React.useCallback(
    (nextStep: number) => {
      if (stepProp === undefined) setInternalStep(nextStep);
      onStepChange?.(nextStep);
    },
    [stepProp, onStepChange],
  );

  const findResolvable = React.useCallback(
    (from: number, dir: 1 | -1) => {
      for (let i = from; i >= 0 && i < steps.length; i += dir) {
        if (resolveTarget(steps[i]?.target)) return i;
      }

      return -1;
    },
    [steps],
  );

  const stop = React.useCallback(() => setOpen(false), [setOpen]);

  const finish = React.useCallback(() => {
    onFinish?.();
    setOpen(false);
  }, [onFinish, setOpen]);

  const start = React.useCallback(
    (at?: number) => {
      setStep(at ?? 0);
      setOpen(true);
    },
    [setStep, setOpen],
  );

  const next = React.useCallback(() => {
    const idx = findResolvable(step + 1, 1);
    if (idx === -1) {
      finish();
    } else {
      setStep(idx);
    }
  }, [findResolvable, step, finish, setStep]);

  const back = React.useCallback(() => {
    const idx = findResolvable(step - 1, -1);
    if (idx !== -1) setStep(idx);
  }, [findResolvable, step, setStep]);

  const restoreFocusRef = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    return () => restoreFocusRef.current?.focus();
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    if (resolveTarget(steps[step]?.target)) return;
    const idx = findResolvable(step + 1, 1);
    if (idx === -1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
    } else {
      setStep(idx);
    }
  }, [open, step, steps, findResolvable, setOpen, setStep]);

  const mounted = React.useSyncExternalStore(
    NEVER_CHANGES,
    () => true,
    () => false,
  );

  const ctx = React.useMemo<TourContextValue>(
    () => ({ open, step, start, stop, next, back }),
    [open, step, start, stop, next, back],
  );

  return (
    <TourContext.Provider value={ctx}>
      {children}
      {mounted &&
        open &&
        createPortal(
          <TourOverlay
            steps={steps}
            step={step}
            stop={stop}
            next={next}
            back={back}
            scrollIntoView={scrollIntoView}
            padding={spotlightPadding}
            labels={labels}
          />,
          document.body,
        )}
    </TourContext.Provider>
  );
};

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TourOverlayProps {
  steps: TourStep[];
  step: number;
  stop: () => void;
  next: () => void;
  back: () => void;
  scrollIntoView: boolean;
  padding: number;
  labels?: TourLabels;
}

interface CardPosition {
  top: number;
  left: number;
}

const padRect = (rect: Rect, padding: number): Rect => ({
  top: rect.top - padding,
  left: rect.left - padding,
  width: rect.width + padding * 2,
  height: rect.height + padding * 2,
});

const TourOverlay = ({ steps, step, stop, next, back, scrollIntoView, padding, labels }: TourOverlayProps) => {
  const current = steps[step];
  const side = current?.side ?? 'bottom';
  const target = current?.target;

  const cardRef = React.useRef<HTMLDivElement>(null);
  const [rect, setRect] = React.useState<Rect | null>(null);
  const [viewport, setViewport] = React.useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [pos, setPos] = React.useState<CardPosition | null>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  const measure = React.useCallback(() => {
    const el = resolveTarget(target);
    if (!el) {
      setRect(null);

      return;
    }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    setViewport({ w: window.innerWidth, h: window.innerHeight });
  }, [target]);

  React.useLayoutEffect(() => {
    const el = resolveTarget(target);
    if (el && scrollIntoView) el.scrollIntoView({ block: 'center' });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    measure();
  }, [target, scrollIntoView, measure]);

  React.useEffect(() => {
    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true, capture: true });
    const el = resolveTarget(target);
    const observer = el && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    if (el) observer?.observe(el);

    return () => {
      observer?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, { capture: true });
    };
  }, [measure, target]);

  React.useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || !rect) return;
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const gap = 12;
    const edge = 16;
    const box = padRect(rect, padding);
    const midTop = box.top + box.height / 2 - h / 2;
    const midLeft = box.left + box.width / 2 - w / 2;
    const coords = (s: NonNullable<TourStep['side']>) =>
      ({
        top: { top: box.top - gap - h, left: midLeft },
        bottom: { top: box.top + box.height + gap, left: midLeft },
        left: { top: midTop, left: box.left - gap - w },
        right: { top: midTop, left: box.left + box.width + gap },
      })[s];
    const fits = (s: NonNullable<TourStep['side']>) => {
      const c = coords(s);

      return c.top >= edge && c.left >= edge && c.top + h <= viewport.h - edge && c.left + w <= viewport.w - edge;
    };
    const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const;
    const placed = !fits(side) && fits(opposite[side]) ? opposite[side] : side;
    const c = coords(placed);
    setPos({
      top: Math.min(Math.max(c.top, edge), Math.max(edge, viewport.h - h - edge)),
      left: Math.min(Math.max(c.left, edge), Math.max(edge, viewport.w - w - edge)),
    });
  }, [rect, viewport, side, padding, step]);

  React.useEffect(() => {
    cardRef.current?.focus();
  }, [step]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        stop();

        return;
      }
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const rtl = cardRef.current ? getComputedStyle(cardRef.current).direction === 'rtl' : false;
      if ((e.key === 'ArrowRight') !== rtl) next();
      else back();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [stop, next, back]);

  const onCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const card = cardRef.current;
    if (!card) return;
    const focusables = card.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) {
      e.preventDefault();

      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    const outside = active === null || !Array.from(focusables).includes(active as HTMLElement);
    if (e.shiftKey && (active === first || outside)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || outside)) {
      e.preventDefault();
      first.focus();
    }
  };

  const spotlight = rect ? padRect(rect, padding) : null;
  const radius = spotlight ? Math.min(8, spotlight.width / 2, spotlight.height / 2) : 0;
  const scrimPath = spotlight
    ? `M0 0H${viewport.w}V${viewport.h}H0Z M${spotlight.left + radius} ${spotlight.top}h${spotlight.width - radius * 2}a${radius} ${radius} 0 0 1 ${radius} ${radius}v${spotlight.height - radius * 2}a${radius} ${radius} 0 0 1 ${-radius} ${radius}h${-(spotlight.width - radius * 2)}a${radius} ${radius} 0 0 1 ${-radius} ${-radius}v${-(spotlight.height - radius * 2)}a${radius} ${radius} 0 0 1 ${radius} ${-radius}Z`
    : `M0 0H${viewport.w}V${viewport.h}H0Z`;

  const available = steps.flatMap((s, i) => (resolveTarget(s.target) ? [i] : []));
  const position = available.indexOf(step);
  const isLast = !available.some((i) => i > step);
  const isFirst = !available.some((i) => i < step);

  return (
    <div data-slot="tour" className="pointer-events-none fixed inset-0 z-50">
      <svg
        data-slot="tour-scrim"
        aria-hidden
        className="pointer-events-auto absolute inset-0 size-full animate-in duration-200 fade-in-0"
        width={viewport.w}
        height={viewport.h}
      >
        <path d={scrimPath} fillRule="evenodd" className="fill-black/50" />
      </svg>
      {spotlight && (
        <div
          data-slot="tour-spotlight"
          aria-hidden
          className="pointer-events-none absolute rounded-lg ring-2 ring-ring/60"
          style={spotlight}
        />
      )}
      <div
        key={step}
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={current?.description ? descriptionId : undefined}
        tabIndex={-1}
        data-slot="tour-card"
        onKeyDown={onCardKeyDown}
        className={cn(
          'pointer-events-auto fixed w-72 max-w-[calc(100vw-2rem)] rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-lg outline-none',
          'animate-in duration-200 ease-out fade-in-0 zoom-in-95',
          pos === null && 'invisible',
        )}
        style={{ top: pos?.top ?? 0, left: pos?.left ?? 0 }}
      >
        <p data-slot="tour-counter" className="text-xs text-muted-foreground uppercase tabular-nums">
          {(position === -1 ? 0 : position) + 1} / {Math.max(available.length, 1)}
        </p>
        <h2 id={titleId} data-slot="tour-title" className="mt-1.5 text-sm leading-tight font-semibold">
          {current?.title}
        </h2>
        {current?.description && (
          <p
            id={descriptionId}
            data-slot="tour-description"
            className="mt-1 text-xs leading-relaxed text-muted-foreground"
          >
            {current.description}
          </p>
        )}
        <div data-slot="tour-controls" className="mt-4 flex items-center justify-between gap-2">
          <Button data-slot="tour-skip" variant="ghost" size="sm" onClick={stop}>
            {labels?.skip ?? 'Skip'}
          </Button>
          <div className="flex items-center gap-2">
            <Button data-slot="tour-back" variant="outline" size="sm" onClick={back} disabled={isFirst}>
              {labels?.back ?? 'Back'}
            </Button>
            <Button data-slot="tour-next" size="sm" onClick={next}>
              {isLast ? (labels?.finish ?? 'Finish') : (labels?.next ?? 'Next')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface TourTriggerProps extends React.ComponentProps<typeof Button> {
  /** Step index to start at, 0-based. */
  at?: number;
}

const TourTrigger = ({ at, onClick, ...props }: TourTriggerProps) => {
  const { start } = useTour();

  return (
    <Button
      {...props}
      data-slot="tour-trigger"
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) start(at);
      }}
    />
  );
};

export { Tour, TourTrigger, useTour };

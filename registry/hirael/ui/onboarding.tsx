"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";
import { Progress } from "@/registry/hirael/ui/progress";

type OnboardingCtx = {
  step: number;
  total: number;
  isComplete: boolean;
  registerStep: (value: number) => () => void;
  goTo: (step: number) => void;
  back: () => void;
  next: () => void;
  skip: () => void;
  complete: () => void;
};

const OnboardingContext = React.createContext<OnboardingCtx | null>(null);

function useOnboarding() {
  const ctx = React.useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("Onboarding compound parts must be used inside <Onboarding>");
  }
  return ctx;
}

export type OnboardingProps = Omit<
  React.ComponentProps<"div">,
  "onChange"
> & {
  /** The active step index, 0-based. Pass with `onStepChange` to control. */
  step?: number;
  /** The initial step index for the uncontrolled case, 0-based. */
  defaultStep?: number;
  /** Called when the active step changes, with the next 0-based index. */
  onStepChange?: (step: number) => void;
  /** Called once when the last step is finished. */
  onComplete?: () => void;
};

function Onboarding({
  step: stepProp,
  defaultStep = 0,
  onStepChange,
  onComplete,
  className,
  children,
  ...props
}: OnboardingProps) {
  const [internal, setInternal] = React.useState(defaultStep);
  const [isComplete, setIsComplete] = React.useState(false);
  const [registered, setRegistered] = React.useState<number[]>([]);
  const step = stepProp ?? internal;
  const total = registered.length;

  const registerStep = React.useCallback((value: number) => {
    setRegistered((prev) =>
      prev.includes(value) ? prev : [...prev, value].sort((a, b) => a - b),
    );
    return () => {
      setRegistered((prev) => prev.filter((v) => v !== value));
    };
  }, []);

  const goTo = React.useCallback(
    (next: number) => {
      if (stepProp === undefined) setInternal(next);
      onStepChange?.(next);
    },
    [stepProp, onStepChange],
  );

  const complete = React.useCallback(() => {
    setIsComplete(true);
    onComplete?.();
  }, [onComplete]);

  const back = React.useCallback(() => {
    if (step > 0) goTo(step - 1);
  }, [step, goTo]);

  const next = React.useCallback(() => {
    if (step < total - 1) {
      goTo(step + 1);
    } else {
      complete();
    }
  }, [step, total, goTo, complete]);

  const skip = next;

  const ctx = React.useMemo<OnboardingCtx>(
    () => ({
      step,
      total,
      isComplete,
      registerStep,
      goTo,
      back,
      next,
      skip,
      complete,
    }),
    [step, total, isComplete, registerStep, goTo, back, next, skip, complete],
  );

  return (
    <OnboardingContext.Provider value={ctx}>
      <div
        data-slot="onboarding"
        data-complete={isComplete || undefined}
        className={cn(
          "flex w-full flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </OnboardingContext.Provider>
  );
}

export type OnboardingProgressProps = React.ComponentProps<"div"> & {
  /** Render a continuous bar instead of one dot per step. */
  variant?: "dots" | "bar";
};

function OnboardingProgress({
  variant = "dots",
  className,
  ...props
}: OnboardingProgressProps) {
  const { step, total, isComplete } = useOnboarding();
  const safeTotal = Math.max(total, 1);
  const reached = isComplete ? safeTotal : step + 1;
  const label = isComplete
    ? "Done"
    : `Step ${Math.min(reached, safeTotal)} of ${safeTotal}`;

  return (
    <div
      data-slot="onboarding-progress"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          data-slot="onboarding-progress-label"
          className="text-xs font-medium tabular-nums text-muted-foreground"
        >
          {label}
        </span>
        {variant === "dots" && (
          <div
            data-slot="onboarding-progress-dots"
            className="flex items-center gap-1.5"
          >
            {Array.from({ length: safeTotal }).map((_, index) => {
              const state = isComplete
                ? "completed"
                : index < step
                  ? "completed"
                  : index === step
                    ? "active"
                    : "inactive";
              return (
                <span
                  key={index}
                  data-slot="onboarding-progress-dot"
                  data-state={state}
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    state === "active" && "bg-primary",
                    state === "completed" && "bg-primary/50",
                    state === "inactive" && "bg-border",
                  )}
                />
              );
            })}
          </div>
        )}
      </div>
      {variant === "bar" && (
        <Progress
          data-slot="onboarding-progress-bar"
          value={(reached / safeTotal) * 100}
        />
      )}
    </div>
  );
}

export type OnboardingStepProps = React.ComponentProps<"div"> & {
  /** This step's index, 0-based. Renders only while it is the active step. */
  value: number;
};

function OnboardingStep({
  value,
  className,
  children,
  ...props
}: OnboardingStepProps) {
  const { step, isComplete, registerStep } = useOnboarding();

  React.useEffect(() => registerStep(value), [registerStep, value]);

  if (isComplete || step !== value) return null;

  return (
    <div
      data-slot="onboarding-step"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function OnboardingStepTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="onboarding-step-title"
      className={cn("text-base font-semibold leading-tight", className)}
      {...props}
    />
  );
}

function OnboardingStepDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="onboarding-step-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function OnboardingStepBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="onboarding-step-body"
      className={cn("mt-2", className)}
      {...props}
    />
  );
}

function OnboardingComplete({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { isComplete } = useOnboarding();
  if (!isComplete) return null;

  return (
    <div
      data-slot="onboarding-complete"
      className={cn("flex flex-col items-center gap-3 py-4 text-center", className)}
      {...props}
    >
      <span
        data-slot="onboarding-complete-icon"
        aria-hidden
        className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <Check className="size-5" strokeWidth={2.5} />
      </span>
      {children}
    </div>
  );
}

export type OnboardingActionsProps = React.ComponentProps<"div"> & {
  /** Show the Skip button on non-final steps. */
  showSkip?: boolean;
  /** Label for the advance button on the last step. */
  finishLabel?: string;
};

function OnboardingActions({
  showSkip = true,
  finishLabel = "Finish",
  className,
  ...props
}: OnboardingActionsProps) {
  const { step, total, isComplete, back, next, skip } = useOnboarding();

  if (isComplete) return null;

  const isFirst = step === 0;
  const isLast = step === total - 1;

  return (
    <div
      data-slot="onboarding-actions"
      className={cn("flex items-center justify-between gap-2", className)}
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        data-slot="onboarding-back"
        onClick={back}
        disabled={isFirst}
      >
        <ArrowLeft className="rtl:rotate-180" />
        Back
      </Button>
      <div className="flex items-center gap-2">
        {showSkip && !isLast && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-slot="onboarding-skip"
            onClick={skip}
          >
            Skip
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          data-slot="onboarding-next"
          onClick={next}
        >
          {isLast ? finishLabel : "Next"}
          {!isLast && <ArrowRight className="rtl:rotate-180" />}
        </Button>
      </div>
    </div>
  );
}

export {
  Onboarding,
  OnboardingProgress,
  OnboardingStep,
  OnboardingStepTitle,
  OnboardingStepDescription,
  OnboardingStepBody,
  OnboardingComplete,
  OnboardingActions,
};

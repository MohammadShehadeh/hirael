"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type Orientation = "horizontal" | "vertical";
type StepState = "active" | "completed" | "inactive";

type StepperCtx = {
  value: number;
  setValue: (step: number) => void;
  orientation: Orientation;
};

const StepperContext = React.createContext<StepperCtx | null>(null);

function useStepper() {
  const ctx = React.useContext(StepperContext);
  if (!ctx) {
    throw new Error("Stepper compound parts must be used inside <Stepper>");
  }
  return ctx;
}

type StepperItemCtx = {
  step: number;
  state: StepState;
  disabled: boolean;
};

const StepperItemContext = React.createContext<StepperItemCtx | null>(null);

function useStepperItem() {
  const ctx = React.useContext(StepperItemContext);
  if (!ctx) {
    throw new Error("Stepper item parts must be used inside <StepperItem>");
  }
  return ctx;
}

export type StepperProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** The active step, 1-based. */
  value?: number;
  defaultValue?: number;
  onValueChange?: (step: number) => void;
  orientation?: Orientation;
};

function Stepper({
  value: valueProp,
  defaultValue = 1,
  onValueChange,
  orientation = "horizontal",
  className,
  ...props
}: StepperProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const value = valueProp ?? internal;

  const setValue = React.useCallback(
    (step: number) => {
      if (valueProp === undefined) setInternal(step);
      onValueChange?.(step);
    },
    [valueProp, onValueChange],
  );

  const ctx = React.useMemo<StepperCtx>(
    () => ({ value, setValue, orientation }),
    [value, setValue, orientation],
  );

  return (
    <StepperContext.Provider value={ctx}>
      <div
        data-slot="stepper"
        data-orientation={orientation}
        className={cn(
          "group/stepper flex",
          orientation === "horizontal" ? "w-full items-center" : "flex-col",
          className,
        )}
        {...props}
      />
    </StepperContext.Provider>
  );
}

export type StepperItemProps = React.ComponentProps<"div"> & {
  /** This item's position, 1-based. */
  step: number;
  /** Force the completed state regardless of the active step. */
  completed?: boolean;
  disabled?: boolean;
};

function StepperItem({
  step,
  completed,
  disabled = false,
  className,
  ...props
}: StepperItemProps) {
  const { value, orientation } = useStepper();

  const state: StepState =
    completed || step < value
      ? "completed"
      : step === value
        ? "active"
        : "inactive";

  const ctx = React.useMemo<StepperItemCtx>(
    () => ({ step, state, disabled }),
    [step, state, disabled],
  );

  return (
    <StepperItemContext.Provider value={ctx}>
      <div
        data-slot="stepper-item"
        data-state={state}
        className={cn(
          "group/step flex",
          orientation === "horizontal"
            ? "items-center not-last:flex-1"
            : "relative items-start gap-3 pb-8 last:pb-0",
          className,
        )}
        {...props}
      />
    </StepperItemContext.Provider>
  );
}

function StepperTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { setValue } = useStepper();
  const { step, disabled } = useStepperItem();

  return (
    <button
      type="button"
      data-slot="stepper-trigger"
      disabled={disabled}
      onClick={() => setValue(step)}
      className={cn(
        "flex items-center gap-3 rounded-md text-start outline-none transition-opacity",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function StepperIndicator({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const { step, state } = useStepperItem();

  return (
    <span
      data-slot="stepper-indicator"
      data-state={state}
      aria-hidden
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium tabular-nums transition-colors",
        state === "completed" &&
          "border-primary bg-primary text-primary-foreground",
        state === "active" && "border-primary bg-primary/10 text-foreground",
        state === "inactive" && "border-border bg-card text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children ??
        (state === "completed" ? (
          <Check className="size-4" strokeWidth={2.5} />
        ) : (
          step
        ))}
    </span>
  );
}

function StepperSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stepper-separator"
      aria-hidden
      className={cn(
        "bg-border transition-colors group-data-[state=completed]/step:bg-primary",
        "group-data-[orientation=horizontal]/stepper:mx-2 group-data-[orientation=horizontal]/stepper:h-0.5 group-data-[orientation=horizontal]/stepper:flex-1",
        "group-data-[orientation=vertical]/stepper:absolute group-data-[orientation=vertical]/stepper:bottom-1 group-data-[orientation=vertical]/stepper:start-4 group-data-[orientation=vertical]/stepper:top-9 group-data-[orientation=vertical]/stepper:w-0.5 group-data-[orientation=vertical]/stepper:-translate-x-1/2 rtl:group-data-[orientation=vertical]/stepper:translate-x-1/2",
        className,
      )}
      {...props}
    />
  );
}

function StepperTitle({ className, ...props }: React.ComponentProps<"span">) {
  const { state } = useStepperItem();
  return (
    <span
      data-slot="stepper-title"
      className={cn(
        "block text-sm font-medium leading-tight transition-colors",
        state === "inactive" ? "text-muted-foreground" : "text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function StepperDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="stepper-description"
      className={cn("mt-0.5 block text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperDescription,
};

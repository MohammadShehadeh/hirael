"use client";

import * as React from "react";
import { Percent, Plus, Tag, Truck, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import { Input } from "@/registry/hirael/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/hirael/ui/select";

export type DiscountType = "percentage" | "fixed" | "free_shipping";

export type DiscountConditionKind =
  | "min_order"
  | "collection"
  | "first_order"
  | "date_range";

export type DiscountCondition = {
  id: string;
  kind: DiscountConditionKind;
  amount: number;
  collection: string;
  start: string;
  end: string;
};

export type Discount = {
  type: DiscountType;
  value: number;
  conditions: DiscountCondition[];
};

const TYPE_OPTIONS: {
  value: DiscountType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "percentage", label: "Percentage", icon: Percent },
  { value: "fixed", label: "Fixed amount", icon: Tag },
  { value: "free_shipping", label: "Free shipping", icon: Truck },
];

const CONDITION_OPTIONS: { value: DiscountConditionKind; label: string }[] = [
  { value: "min_order", label: "Minimum order amount" },
  { value: "collection", label: "Specific collection" },
  { value: "first_order", label: "First order only" },
  { value: "date_range", label: "Date range" },
];

function conditionLabel(kind: DiscountConditionKind): string {
  return CONDITION_OPTIONS.find((c) => c.value === kind)?.label ?? kind;
}

function makeId(seed: number): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `discount-condition-${seed}`;
}

function emptyCondition(id: string, kind: DiscountConditionKind): DiscountCondition {
  return { id, kind, amount: 0, collection: "", start: "", end: "" };
}

function formatMoney(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

function conditionSummary(condition: DiscountCondition): string | null {
  switch (condition.kind) {
    case "min_order":
      return condition.amount > 0
        ? `orders over ${formatMoney(condition.amount)}`
        : null;
    case "collection":
      return condition.collection
        ? `in ${condition.collection}`
        : null;
    case "first_order":
      return "first order only";
    case "date_range":
      if (condition.start && condition.end) {
        return `from ${condition.start} to ${condition.end}`;
      }
      if (condition.start) return `from ${condition.start}`;
      if (condition.end) return `until ${condition.end}`;
      return null;
    default:
      return null;
  }
}

function summarize(discount: Discount): string {
  let head: string;
  if (discount.type === "free_shipping") {
    head = "Free shipping";
  } else if (discount.type === "percentage") {
    head = `${discount.value || 0}% off`;
  } else {
    head = `${formatMoney(discount.value || 0)} off`;
  }

  const parts = discount.conditions
    .map(conditionSummary)
    .filter((part): part is string => part !== null);

  return parts.length > 0 ? `${head} ${parts.join(", ")}` : head;
}

type Ctx = {
  value: Discount;
  setType: (type: DiscountType) => void;
  setValue: (value: number) => void;
  addCondition: () => void;
  updateCondition: (
    id: string,
    patch: Partial<Omit<DiscountCondition, "id">>,
  ) => void;
  removeCondition: (id: string) => void;
};

const DiscountBuilderContext = React.createContext<Ctx | null>(null);

function useDiscountBuilder(): Ctx {
  const ctx = React.useContext(DiscountBuilderContext);
  if (!ctx) {
    throw new Error(
      "DiscountBuilder compound parts must be used inside <DiscountBuilder>",
    );
  }
  return ctx;
}

const DEFAULT_DISCOUNT: Discount = {
  type: "percentage",
  value: 0,
  conditions: [],
};

export type DiscountBuilderProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  /** Controlled discount configuration. */
  value?: Discount;
  /** Initial discount for an uncontrolled builder. */
  defaultValue?: Discount;
  /** Called whenever the discount changes. */
  onValueChange?: (value: Discount) => void;
};

function DiscountBuilder({
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: DiscountBuilderProps) {
  const [internalValue, setInternalValue] = React.useState<Discount>(
    defaultValue ?? DEFAULT_DISCOUNT,
  );
  const value = valueProp ?? internalValue;

  const seedRef = React.useRef(0);

  const setValue = React.useCallback(
    (next: Discount) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const setType = React.useCallback(
    (type: DiscountType) => {
      setValue({
        ...value,
        type,
        value: type === "free_shipping" ? 0 : value.value,
      });
    },
    [value, setValue],
  );

  const setAmount = React.useCallback(
    (amount: number) => {
      setValue({ ...value, value: amount });
    },
    [value, setValue],
  );

  const addCondition = React.useCallback(() => {
    const used = new Set(value.conditions.map((c) => c.kind));
    const next = CONDITION_OPTIONS.find((option) => !used.has(option.value));
    if (!next) return;
    setValue({
      ...value,
      conditions: [
        ...value.conditions,
        emptyCondition(makeId(seedRef.current++), next.value),
      ],
    });
  }, [value, setValue]);

  const updateCondition = React.useCallback(
    (id: string, patch: Partial<Omit<DiscountCondition, "id">>) => {
      setValue({
        ...value,
        conditions: value.conditions.map((condition) =>
          condition.id === id ? { ...condition, ...patch } : condition,
        ),
      });
    },
    [value, setValue],
  );

  const removeCondition = React.useCallback(
    (id: string) => {
      setValue({
        ...value,
        conditions: value.conditions.filter((condition) => condition.id !== id),
      });
    },
    [value, setValue],
  );

  const ctx = React.useMemo<Ctx>(
    () => ({
      value,
      setType,
      setValue: setAmount,
      addCondition,
      updateCondition,
      removeCondition,
    }),
    [value, setType, setAmount, addCondition, updateCondition, removeCondition],
  );

  return (
    <DiscountBuilderContext.Provider value={ctx}>
      <div
        data-slot="discount-builder"
        className={cn("flex w-full flex-col gap-4", className)}
        {...props}
      >
        {children}
      </div>
    </DiscountBuilderContext.Provider>
  );
}

type DiscountTypeProps = Omit<React.ComponentProps<"div">, "children">;

function DiscountType({ className, ...props }: DiscountTypeProps) {
  const ctx = useDiscountBuilder();
  return (
    <div
      data-slot="discount-type"
      role="radiogroup"
      aria-label="Discount type"
      className={cn(
        "grid grid-cols-3 gap-2 rounded-lg border border-input bg-card p-1",
        className,
      )}
      {...props}
    >
      {TYPE_OPTIONS.map((option) => {
        const active = option.value === ctx.value.type;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            data-slot="discount-type-option"
            data-state={active ? "active" : "inactive"}
            onClick={() => ctx.setType(option.value)}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 rounded-md px-2 py-3 text-xs font-medium outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
              active
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="size-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

type DiscountValueProps = Omit<
  React.ComponentProps<"div">,
  "children" | "onChange"
> & {
  /** Placeholder shown in the empty amount field. */
  placeholder?: string;
};

function DiscountValue({
  className,
  placeholder = "0",
  ...props
}: DiscountValueProps) {
  const ctx = useDiscountBuilder();

  if (ctx.value.type === "free_shipping") return null;

  const isPercentage = ctx.value.type === "percentage";

  return (
    <div
      data-slot="discount-value"
      className={cn("relative w-full", className)}
      {...props}
    >
      {!isPercentage ? (
        <span
          data-slot="discount-value-symbol"
          className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-sm text-muted-foreground"
        >
          $
        </span>
      ) : null}
      <Input
        data-slot="discount-value-input"
        type="number"
        inputMode="decimal"
        min={0}
        max={isPercentage ? 100 : undefined}
        step={isPercentage ? 1 : "0.01"}
        value={ctx.value.value === 0 ? "" : ctx.value.value}
        placeholder={placeholder}
        aria-label={isPercentage ? "Percentage off" : "Amount off"}
        onChange={(event) => {
          const next = Number.parseFloat(event.target.value);
          ctx.setValue(Number.isFinite(next) ? next : 0);
        }}
        className={cn(isPercentage ? "pe-9" : "ps-7")}
      />
      {isPercentage ? (
        <span
          data-slot="discount-value-symbol"
          className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-sm text-muted-foreground"
        >
          <Percent className="size-4" />
        </span>
      ) : null}
    </div>
  );
}

type DiscountConditionsProps = React.ComponentProps<"div"> & {
  /** Shown when no conditions have been added. */
  emptyHint?: React.ReactNode;
};

function DiscountConditions({
  className,
  children,
  emptyHint = "No conditions. The discount applies to every order.",
  ...props
}: DiscountConditionsProps) {
  const ctx = useDiscountBuilder();
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div
      data-slot="discount-conditions"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {hasChildren ? (
        children
      ) : ctx.value.conditions.length > 0 ? (
        ctx.value.conditions.map((condition) => (
          <DiscountCondition key={condition.id} condition={condition} />
        ))
      ) : (
        <p
          data-slot="discount-conditions-empty"
          className="text-sm text-muted-foreground"
        >
          {emptyHint}
        </p>
      )}
    </div>
  );
}

type DiscountConditionProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The condition row this part renders. */
  condition: DiscountCondition;
};

function DiscountCondition({
  condition,
  className,
  ...props
}: DiscountConditionProps) {
  const ctx = useDiscountBuilder();
  const used = new Set(
    ctx.value.conditions
      .filter((c) => c.id !== condition.id)
      .map((c) => c.kind),
  );
  const available = CONDITION_OPTIONS.filter(
    (option) => option.value === condition.kind || !used.has(option.value),
  );

  return (
    <div
      data-slot="discount-condition"
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-md border border-border bg-background p-2",
        className,
      )}
      {...props}
    >
      <Select
        value={condition.kind}
        onValueChange={(kind) =>
          ctx.updateCondition(condition.id, {
            kind: kind as DiscountConditionKind,
          })
        }
      >
        <SelectTrigger
          data-slot="discount-condition-kind"
          className="w-[12rem]"
          aria-label="Condition"
        >
          <SelectValue placeholder="Condition" />
        </SelectTrigger>
        <SelectContent>
          {available.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {condition.kind === "min_order" ? (
        <div className="relative min-w-[8rem] flex-1">
          <span
            data-slot="discount-condition-symbol"
            className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-sm text-muted-foreground"
          >
            $
          </span>
          <Input
            data-slot="discount-condition-amount"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={condition.amount === 0 ? "" : condition.amount}
            placeholder="0"
            aria-label="Minimum order amount"
            onChange={(event) => {
              const next = Number.parseFloat(event.target.value);
              ctx.updateCondition(condition.id, {
                amount: Number.isFinite(next) ? next : 0,
              });
            }}
            className="ps-7"
          />
        </div>
      ) : null}

      {condition.kind === "collection" ? (
        <Input
          data-slot="discount-condition-collection"
          value={condition.collection}
          placeholder="Collection name"
          aria-label="Collection"
          onChange={(event) =>
            ctx.updateCondition(condition.id, {
              collection: event.target.value,
            })
          }
          className="min-w-[8rem] flex-1"
        />
      ) : null}

      {condition.kind === "date_range" ? (
        <div className="flex min-w-[8rem] flex-1 items-center gap-2">
          <Input
            data-slot="discount-condition-start"
            type="date"
            value={condition.start}
            aria-label="Start date"
            onChange={(event) =>
              ctx.updateCondition(condition.id, { start: event.target.value })
            }
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            data-slot="discount-condition-end"
            type="date"
            value={condition.end}
            aria-label="End date"
            onChange={(event) =>
              ctx.updateCondition(condition.id, { end: event.target.value })
            }
            className="flex-1"
          />
        </div>
      ) : null}

      {condition.kind === "first_order" ? (
        <span
          data-slot="discount-condition-note"
          className="flex-1 text-sm text-muted-foreground"
        >
          Only the customer&apos;s first order qualifies.
        </span>
      ) : null}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        data-slot="discount-condition-remove"
        aria-label={`Remove ${conditionLabel(condition.kind)} condition`}
        onClick={() => ctx.removeCondition(condition.id)}
        className="ms-auto text-muted-foreground"
      >
        <X />
      </Button>
    </div>
  );
}

type DiscountAddConditionProps = React.ComponentProps<typeof Button>;

function DiscountAddCondition({
  className,
  children,
  onClick,
  ...props
}: DiscountAddConditionProps) {
  const ctx = useDiscountBuilder();
  const exhausted = ctx.value.conditions.length >= CONDITION_OPTIONS.length;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      data-slot="discount-add-condition"
      disabled={exhausted}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        ctx.addCondition();
      }}
      className={cn("w-fit", className)}
      {...props}
    >
      <Plus />
      {children ?? "Add condition"}
    </Button>
  );
}

type DiscountSummaryProps = Omit<
  React.ComponentProps<typeof Badge>,
  "children"
>;

function DiscountSummary({ className, ...props }: DiscountSummaryProps) {
  const ctx = useDiscountBuilder();
  return (
    <Badge
      variant="secondary"
      data-slot="discount-summary"
      className={cn(
        "h-auto max-w-full gap-1.5 px-3 py-1.5 text-sm font-normal whitespace-normal",
        className,
      )}
      {...props}
    >
      <Tag className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="min-w-0">{summarize(ctx.value)}</span>
    </Badge>
  );
}

export {
  DiscountBuilder,
  DiscountType,
  DiscountValue,
  DiscountConditions,
  DiscountCondition,
  DiscountAddCondition,
  DiscountSummary,
};

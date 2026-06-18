"use client";

import * as React from "react";
import { Filter, Plus, X } from "lucide-react";

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

export type FilterField = {
  name: string;
  label: string;
  operators?: string[];
};

export type FilterCondition = {
  id: string;
  field: string;
  operator: string;
  value: string;
};

const DEFAULT_OPERATORS = [
  "is",
  "is not",
  "contains",
  "starts with",
  "greater than",
  "less than",
];

function makeId(seed: number): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `filter-${seed}`;
}

function fieldLabel(fields: FilterField[], name: string): string {
  return fields.find((f) => f.name === name)?.label ?? name;
}

function operatorsFor(fields: FilterField[], name: string): string[] {
  const operators = fields.find((f) => f.name === name)?.operators;
  return operators && operators.length > 0 ? operators : DEFAULT_OPERATORS;
}

type Ctx = {
  fields: FilterField[];
  value: FilterCondition[];
  add: () => void;
  update: (id: string, patch: Partial<Omit<FilterCondition, "id">>) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const FilterBuilderContext = React.createContext<Ctx | null>(null);

function useFilterBuilder(): Ctx {
  const ctx = React.useContext(FilterBuilderContext);
  if (!ctx) {
    throw new Error(
      "FilterBuilder compound parts must be used inside <FilterBuilder>",
    );
  }
  return ctx;
}

export type FilterBuilderProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  /** Fields a condition can target. `operators` overrides the default operator list per field. */
  fields: FilterField[];
  /** Controlled list of conditions. */
  value?: FilterCondition[];
  /** Initial conditions for an uncontrolled builder. */
  defaultValue?: FilterCondition[];
  /** Called whenever the condition list changes. */
  onValueChange?: (value: FilterCondition[]) => void;
};

function FilterBuilder({
  fields,
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: FilterBuilderProps) {
  const [internalValue, setInternalValue] = React.useState<FilterCondition[]>(
    defaultValue ?? [],
  );
  const value = valueProp ?? internalValue;

  const seedRef = React.useRef(0);

  const setValue = React.useCallback(
    (next: FilterCondition[]) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const add = React.useCallback(() => {
    const field = fields[0]?.name ?? "";
    const operator = operatorsFor(fields, field)[0] ?? "";
    const condition: FilterCondition = {
      id: makeId(seedRef.current++),
      field,
      operator,
      value: "",
    };
    setValue([...value, condition]);
  }, [fields, value, setValue]);

  const update = React.useCallback(
    (id: string, patch: Partial<Omit<FilterCondition, "id">>) => {
      setValue(
        value.map((condition) =>
          condition.id === id ? { ...condition, ...patch } : condition,
        ),
      );
    },
    [value, setValue],
  );

  const remove = React.useCallback(
    (id: string) => {
      setValue(value.filter((condition) => condition.id !== id));
    },
    [value, setValue],
  );

  const clear = React.useCallback(() => {
    setValue([]);
  }, [setValue]);

  const ctx = React.useMemo<Ctx>(
    () => ({ fields, value, add, update, remove, clear }),
    [fields, value, add, update, remove, clear],
  );

  return (
    <FilterBuilderContext.Provider value={ctx}>
      <div
        data-slot="filter-builder"
        className={cn("flex w-full flex-col gap-3", className)}
        {...props}
      >
        {children}
      </div>
    </FilterBuilderContext.Provider>
  );
}

type FilterRowProps = Omit<React.ComponentProps<"div">, "children"> & {
  condition: FilterCondition;
};

function FilterRow({ condition, className, ...props }: FilterRowProps) {
  const ctx = useFilterBuilder();
  const operators = operatorsFor(ctx.fields, condition.field);

  return (
    <div
      data-slot="filter-row"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      <Select
        value={condition.field}
        onValueChange={(field) => {
          const nextOperators = operatorsFor(ctx.fields, field);
          const operator = nextOperators.includes(condition.operator)
            ? condition.operator
            : (nextOperators[0] ?? "");
          ctx.update(condition.id, { field, operator });
        }}
      >
        <SelectTrigger
          data-slot="filter-row-field"
          className="w-[8.5rem]"
          aria-label="Field"
        >
          <SelectValue placeholder="Field" />
        </SelectTrigger>
        <SelectContent>
          {ctx.fields.map((field) => (
            <SelectItem key={field.name} value={field.name}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={condition.operator}
        onValueChange={(operator) => ctx.update(condition.id, { operator })}
      >
        <SelectTrigger
          data-slot="filter-row-operator"
          className="w-[8.5rem]"
          aria-label="Operator"
        >
          <SelectValue placeholder="Operator" />
        </SelectTrigger>
        <SelectContent>
          {operators.map((operator) => (
            <SelectItem key={operator} value={operator}>
              {operator}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        data-slot="filter-row-value"
        value={condition.value}
        onChange={(event) =>
          ctx.update(condition.id, { value: event.target.value })
        }
        placeholder="Value"
        aria-label="Value"
        className="w-auto min-w-[8rem] flex-1"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        data-slot="filter-row-remove"
        aria-label="Remove filter"
        onClick={() => ctx.remove(condition.id)}
        className="text-muted-foreground"
      >
        <X />
      </Button>
    </div>
  );
}

type FilterAddProps = React.ComponentProps<typeof Button>;

function FilterAdd({ className, children, onClick, ...props }: FilterAddProps) {
  const ctx = useFilterBuilder();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      data-slot="filter-add"
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        ctx.add();
      }}
      className={cn("w-fit", className)}
      {...props}
    >
      <Plus />
      {children ?? "Add filter"}
    </Button>
  );
}

type FilterChipProps = Omit<React.ComponentProps<typeof Badge>, "children"> & {
  condition: FilterCondition;
};

function FilterChip({ condition, className, ...props }: FilterChipProps) {
  const ctx = useFilterBuilder();
  const label = fieldLabel(ctx.fields, condition.field);
  return (
    <Badge
      variant="secondary"
      data-slot="filter-chip"
      className={cn("gap-1 pe-1 font-normal", className)}
      {...props}
    >
      <span className="min-w-0 truncate">
        <span className="font-medium text-foreground">{label}</span>{" "}
        {condition.operator}
        {condition.value ? ` ${condition.value}` : ""}
      </span>
      <button
        type="button"
        tabIndex={-1}
        aria-label={`Remove ${label} filter`}
        onClick={() => ctx.remove(condition.id)}
        className="inline-flex size-3.5 items-center justify-center rounded-[2px] text-secondary-foreground/70 transition-colors hover:bg-secondary-foreground/20 hover:text-secondary-foreground"
      >
        <X className="size-2.5" />
      </button>
    </Badge>
  );
}

type FilterChipsProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Shown when no conditions exist. */
  emptyHint?: React.ReactNode;
};

function FilterChips({
  className,
  emptyHint = "No filters yet.",
  ...props
}: FilterChipsProps) {
  const ctx = useFilterBuilder();

  if (ctx.value.length === 0) {
    return (
      <div
        data-slot="filter-chips"
        data-empty="true"
        className={cn("flex items-center text-sm text-muted-foreground", className)}
        {...props}
      >
        {emptyHint}
      </div>
    );
  }

  return (
    <div
      data-slot="filter-chips"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      {...props}
    >
      {ctx.value.map((condition) => (
        <FilterChip key={condition.id} condition={condition} />
      ))}
      <Button
        type="button"
        variant="ghost"
        size="xs"
        data-slot="filter-clear"
        onClick={ctx.clear}
        className="ms-1 text-muted-foreground"
      >
        Clear all
      </Button>
    </div>
  );
}

export {
  FilterBuilder,
  FilterRow,
  FilterAdd,
  FilterChips,
  FilterChip,
};

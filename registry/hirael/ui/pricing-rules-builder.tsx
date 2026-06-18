"use client";

import * as React from "react";
import { ArrowRight, Plus, X } from "lucide-react";

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

type PricingField = {
  name: string;
  label: string;
  operators?: string[];
};

type PricingAction = {
  name: string;
  label: string;
  unit?: string;
};

type PricingRule = {
  id: string;
  field: string;
  operator: string;
  value: string;
  action: string;
  actionValue: string;
};

const DEFAULT_FIELDS: PricingField[] = [
  {
    name: "quantity",
    label: "Quantity",
    operators: [">=", ">", "=", "<", "<="],
  },
  {
    name: "customer-group",
    label: "Customer group",
    operators: ["is", "is not"],
  },
  {
    name: "cart-total",
    label: "Cart total",
    operators: [">=", ">", "<", "<="],
  },
];

const DEFAULT_ACTIONS: PricingAction[] = [
  { name: "percent-off", label: "Percentage off", unit: "%" },
  { name: "amount-off", label: "Fixed amount off", unit: "$" },
  { name: "set-price", label: "Set price", unit: "$" },
  { name: "price-per-unit", label: "Price per unit", unit: "$" },
];

const DEFAULT_OPERATORS = [">=", ">", "=", "<", "<="];

function fieldLabel(fields: PricingField[], name: string): string {
  return fields.find((field) => field.name === name)?.label ?? name;
}

function operatorsFor(fields: PricingField[], name: string): string[] {
  const operators = fields.find((field) => field.name === name)?.operators;
  return operators && operators.length > 0 ? operators : DEFAULT_OPERATORS;
}

function actionFor(
  actions: PricingAction[],
  name: string,
): PricingAction | undefined {
  return actions.find((action) => action.name === name);
}

function shortFieldLabel(fields: PricingField[], name: string): string {
  const label = fieldLabel(fields, name);
  if (label === "Quantity") return "Qty";
  return label;
}

function summarizeCondition(
  fields: PricingField[],
  rule: PricingRule,
): string {
  const field = shortFieldLabel(fields, rule.field);
  const value = rule.value.trim();
  return [field, rule.operator, value].filter(Boolean).join(" ");
}

function summarizeAction(
  actions: PricingAction[],
  rule: PricingRule,
): string {
  const action = actionFor(actions, rule.action);
  const label = action?.label ?? rule.action;
  const value = rule.actionValue.trim();
  const unit = action?.unit ?? "";

  if (!value) return label;

  if (unit === "%") return `${value}% off`;
  if (action?.name === "amount-off") return `${unit}${value} off`;
  if (action?.name === "set-price") return `set ${unit}${value}`;
  if (action?.name === "price-per-unit") return `${unit}${value}/unit`;
  return `${label} ${value}`;
}

type PricingRulesContextValue = {
  fields: PricingField[];
  actions: PricingAction[];
  value: PricingRule[];
  createId: () => string;
  add: () => void;
  update: (id: string, patch: Partial<Omit<PricingRule, "id">>) => void;
  remove: (id: string) => void;
};

const PricingRulesContext =
  React.createContext<PricingRulesContextValue | null>(null);

function usePricingRules(): PricingRulesContextValue {
  const context = React.useContext(PricingRulesContext);
  if (!context) {
    throw new Error(
      "PricingRules compound parts must be used inside <PricingRules>.",
    );
  }
  return context;
}

function usePricingRule(): PricingRule {
  const rule = React.useContext(PricingRuleContext);
  if (!rule) {
    throw new Error(
      "PricingRule parts must be used inside <PricingRule>.",
    );
  }
  return rule;
}

const PricingRuleContext = React.createContext<PricingRule | null>(null);

type PricingRulesProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  /** Condition fields a rule can target. `operators` overrides the default operator list per field. */
  fields?: PricingField[];
  /** Price actions a rule can apply. `unit` decorates the action value in the summary chip. */
  actions?: PricingAction[];
  /** Controlled list of rules. */
  value?: PricingRule[];
  /** Initial rules for an uncontrolled builder. */
  defaultValue?: PricingRule[];
  /** Called whenever the rule list changes. */
  onValueChange?: (value: PricingRule[]) => void;
};

function PricingRules({
  fields = DEFAULT_FIELDS,
  actions = DEFAULT_ACTIONS,
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: PricingRulesProps) {
  const idPrefix = React.useId();
  const counter = React.useRef(0);

  const createId = React.useCallback(() => {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }
    counter.current += 1;
    return `${idPrefix}rule-${counter.current}`;
  }, [idPrefix]);

  const [internalValue, setInternalValue] = React.useState<PricingRule[]>(
    defaultValue ?? [],
  );
  const value = valueProp ?? internalValue;

  const setValue = React.useCallback(
    (next: PricingRule[]) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const add = React.useCallback(() => {
    const field = fields[0]?.name ?? "";
    const operator = operatorsFor(fields, field)[0] ?? "";
    const action = actions[0]?.name ?? "";
    const rule: PricingRule = {
      id: createId(),
      field,
      operator,
      value: "",
      action,
      actionValue: "",
    };
    setValue([...value, rule]);
  }, [actions, createId, fields, setValue, value]);

  const update = React.useCallback(
    (id: string, patch: Partial<Omit<PricingRule, "id">>) => {
      setValue(
        value.map((rule) =>
          rule.id === id ? { ...rule, ...patch } : rule,
        ),
      );
    },
    [setValue, value],
  );

  const remove = React.useCallback(
    (id: string) => {
      setValue(value.filter((rule) => rule.id !== id));
    },
    [setValue, value],
  );

  const context = React.useMemo<PricingRulesContextValue>(
    () => ({ fields, actions, value, createId, add, update, remove }),
    [fields, actions, value, createId, add, update, remove],
  );

  return (
    <PricingRulesContext.Provider value={context}>
      <div
        data-slot="pricing-rules"
        className={cn("flex w-full flex-col gap-3", className)}
        {...props}
      >
        {children}
      </div>
    </PricingRulesContext.Provider>
  );
}

type PricingRuleProps = React.ComponentProps<"div"> & {
  /** The rule this row renders. */
  rule: PricingRule;
  /** Order in which the rule is evaluated, shown as an ordinal. Rules apply top-down. */
  index?: number;
};

function PricingRule({
  rule,
  index,
  className,
  children,
  ...props
}: PricingRuleProps) {
  const { remove } = usePricingRules();

  return (
    <PricingRuleContext.Provider value={rule}>
      <div
        data-slot="pricing-rule"
        className={cn(
          "rounded-md border border-border bg-card/40 p-3",
          className,
        )}
        {...props}
      >
        <div
          data-slot="pricing-rule-header"
          className="flex flex-wrap items-center gap-2"
        >
          {typeof index === "number" ? (
            <Badge
              variant="outline"
              data-slot="pricing-rule-ordinal"
              className="font-mono text-[0.625rem] tabular-nums"
              aria-label={`Rule ${index + 1}, evaluated top to bottom`}
            >
              {index + 1}
            </Badge>
          ) : null}
          <PricingRuleSummary />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            data-slot="pricing-rule-remove"
            aria-label="Remove rule"
            onClick={() => remove(rule.id)}
            className="ms-auto text-muted-foreground hover:text-destructive"
          >
            <X />
          </Button>
        </div>

        {children ?? (
          <div
            data-slot="pricing-rule-body"
            className="mt-3 flex flex-col gap-2"
          >
            <PricingRuleCondition />
            <PricingRuleAction />
          </div>
        )}
      </div>
    </PricingRuleContext.Provider>
  );
}

type PricingRuleConditionProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  /** Label shown before the condition controls. */
  label?: React.ReactNode;
};

function PricingRuleCondition({
  label = "When",
  className,
  ...props
}: PricingRuleConditionProps) {
  const { fields, update } = usePricingRules();
  const rule = usePricingRule();
  const operators = operatorsFor(fields, rule.field);

  return (
    <div
      data-slot="pricing-rule-condition"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      <span className="text-xs font-medium text-muted-foreground">{label}</span>

      <Select
        value={rule.field}
        onValueChange={(field) => {
          const nextOperators = operatorsFor(fields, field);
          const operator = nextOperators.includes(rule.operator)
            ? rule.operator
            : (nextOperators[0] ?? "");
          update(rule.id, { field, operator });
        }}
      >
        <SelectTrigger
          size="sm"
          data-slot="pricing-rule-field"
          className="w-40"
          aria-label="Condition field"
        >
          <SelectValue placeholder="Field" />
        </SelectTrigger>
        <SelectContent>
          {fields.map((field) => (
            <SelectItem key={field.name} value={field.name}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={rule.operator}
        onValueChange={(operator) => update(rule.id, { operator })}
      >
        <SelectTrigger
          size="sm"
          data-slot="pricing-rule-operator"
          className="w-24"
          aria-label="Condition operator"
        >
          <SelectValue placeholder="Is" />
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
        data-slot="pricing-rule-value"
        className="h-8 w-28 min-w-0 flex-1"
        value={rule.value}
        placeholder="Value"
        aria-label="Condition value"
        onChange={(event) => update(rule.id, { value: event.target.value })}
      />
    </div>
  );
}

type PricingRuleActionProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Label shown before the action controls. */
  label?: React.ReactNode;
};

function PricingRuleAction({
  label = "then",
  className,
  ...props
}: PricingRuleActionProps) {
  const { actions, update } = usePricingRules();
  const rule = usePricingRule();
  const action = actionFor(actions, rule.action);

  return (
    <div
      data-slot="pricing-rule-action"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      <span className="text-xs font-medium text-muted-foreground">{label}</span>

      <Select
        value={rule.action}
        onValueChange={(next) => update(rule.id, { action: next })}
      >
        <SelectTrigger
          size="sm"
          data-slot="pricing-rule-action-type"
          className="w-44"
          aria-label="Price action"
        >
          <SelectValue placeholder="Action" />
        </SelectTrigger>
        <SelectContent>
          {actions.map((item) => (
            <SelectItem key={item.name} value={item.name}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative flex min-w-0 flex-1 items-center">
        {action?.unit ? (
          <span
            data-slot="pricing-rule-action-unit"
            className="pointer-events-none absolute start-3 text-sm text-muted-foreground"
          >
            {action.unit}
          </span>
        ) : null}
        <Input
          data-slot="pricing-rule-action-value"
          inputMode="decimal"
          className={cn("h-8 w-28 min-w-0 flex-1", action?.unit && "ps-7")}
          value={rule.actionValue}
          placeholder="Amount"
          aria-label="Action value"
          onChange={(event) =>
            update(rule.id, { actionValue: event.target.value })
          }
        />
      </div>
    </div>
  );
}

type PricingRuleSummaryProps = Omit<
  React.ComponentProps<typeof Badge>,
  "children"
>;

function PricingRuleSummary({ className, ...props }: PricingRuleSummaryProps) {
  const { fields, actions } = usePricingRules();
  const rule = usePricingRule();
  const condition = summarizeCondition(fields, rule);
  const result = summarizeAction(actions, rule);

  return (
    <Badge
      variant="secondary"
      data-slot="pricing-rule-summary"
      className={cn("min-w-0 max-w-full gap-1.5 font-normal", className)}
      {...props}
    >
      <span className="truncate font-medium text-foreground">{condition}</span>
      <ArrowRight
        className="size-3 shrink-0 text-muted-foreground rtl:rotate-180"
        aria-hidden="true"
      />
      <span className="truncate">{result}</span>
    </Badge>
  );
}

type PricingRulesAddProps = React.ComponentProps<typeof Button>;

function PricingRulesAdd({
  className,
  children,
  onClick,
  ...props
}: PricingRulesAddProps) {
  const { add } = usePricingRules();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      data-slot="pricing-rules-add"
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        add();
      }}
      className={cn("w-fit", className)}
      {...props}
    >
      <Plus />
      {children ?? "Add rule"}
    </Button>
  );
}

export {
  PricingRules,
  PricingRule,
  PricingRuleCondition,
  PricingRuleAction,
  PricingRuleSummary,
  PricingRulesAdd,
  DEFAULT_FIELDS,
  DEFAULT_ACTIONS,
};
export type {
  PricingRulesProps,
  PricingRuleProps,
  PricingRuleConditionProps,
  PricingRuleActionProps,
  PricingRuleSummaryProps,
  PricingRulesAddProps,
  PricingField,
  PricingAction,
};

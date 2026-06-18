"use client";

import * as React from "react";

import {
  PricingRule,
  PricingRuleAction,
  PricingRuleCondition,
  PricingRuleSummary,
  PricingRules,
  PricingRulesAdd,
  type PricingAction,
  type PricingField,
  type PricingRule as PricingRuleValue,
} from "@/registry/hirael/ui/pricing-rules-builder";

const shippingFields: PricingField[] = [
  { name: "weight", label: "Weight (kg)", operators: [">=", ">", "<", "<="] },
  { name: "zone", label: "Zone", operators: ["is", "is not"] },
];

const shippingActions: PricingAction[] = [
  { name: "flat-rate", label: "Flat rate", unit: "$" },
  { name: "percent-off", label: "Percentage off", unit: "%" },
  { name: "free", label: "Free shipping" },
];

export default function PricingRulesBuilderDemo() {
  const [rules, setRules] = React.useState<PricingRuleValue[]>([
    {
      id: "rule-volume",
      field: "quantity",
      operator: ">=",
      value: "10",
      action: "percent-off",
      actionValue: "15",
    },
    {
      id: "rule-bulk",
      field: "quantity",
      operator: ">=",
      value: "50",
      action: "price-per-unit",
      actionValue: "8.50",
    },
    {
      id: "rule-wholesale",
      field: "customer-group",
      operator: "is",
      value: "Wholesale",
      action: "amount-off",
      actionValue: "25",
    },
  ]);

  const [shipping, setShipping] = React.useState<PricingRuleValue[]>([
    {
      id: "ship-heavy",
      field: "weight",
      operator: ">=",
      value: "20",
      action: "flat-rate",
      actionValue: "12",
    },
  ]);

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-3">
        <div className="grid gap-1">
          <p className="text-sm font-medium text-foreground">Volume pricing</p>
          <p className="text-xs text-muted-foreground">
            Rules run top to bottom. The first match wins.
          </p>
        </div>
        <PricingRules value={rules} onValueChange={setRules}>
          {rules.map((rule, index) => (
            <PricingRule key={rule.id} rule={rule} index={index} />
          ))}
          <PricingRulesAdd />
        </PricingRules>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium text-foreground">
          Shipping discounts
        </p>
        <PricingRules
          fields={shippingFields}
          actions={shippingActions}
          value={shipping}
          onValueChange={setShipping}
          className="gap-4"
        >
          {shipping.map((rule) => (
            <PricingRule key={rule.id} rule={rule}>
              <div className="mt-3 grid gap-2 rounded-md bg-muted/40 p-2">
                <PricingRuleSummary className="w-fit" />
                <PricingRuleCondition label="If" />
                <PricingRuleAction label="charge" />
              </div>
            </PricingRule>
          ))}
          <PricingRulesAdd variant="ghost">Add a discount</PricingRulesAdd>
        </PricingRules>
      </div>
    </div>
  );
}

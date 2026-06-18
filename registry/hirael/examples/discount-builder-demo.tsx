"use client";

import * as React from "react";

import {
  DiscountAddCondition,
  DiscountBuilder,
  DiscountConditions,
  DiscountSummary,
  DiscountType,
  DiscountValue,
  type Discount,
} from "@/registry/hirael/ui/discount-builder";

export default function DiscountBuilderDemo() {
  const [basic, setBasic] = React.useState<Discount>({
    type: "percentage",
    value: 20,
    conditions: [
      {
        id: "min-order",
        kind: "min_order",
        amount: 50,
        collection: "",
        start: "",
        end: "",
      },
      {
        id: "first-order",
        kind: "first_order",
        amount: 0,
        collection: "",
        start: "",
        end: "",
      },
    ],
  });

  const [shipping, setShipping] = React.useState<Discount>({
    type: "free_shipping",
    value: 0,
    conditions: [
      {
        id: "ship-min",
        kind: "min_order",
        amount: 75,
        collection: "",
        start: "",
        end: "",
      },
    ],
  });

  return (
    <div className="grid w-full max-w-xl gap-8">
      <DiscountBuilder value={basic} onValueChange={setBasic}>
        <DiscountType />
        <DiscountValue />
        <DiscountConditions />
        <DiscountAddCondition />
        <DiscountSummary />
      </DiscountBuilder>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium text-foreground">Shipping offer</p>
        <DiscountBuilder
          value={shipping}
          onValueChange={setShipping}
          className="gap-3"
        >
          <DiscountType />
          <DiscountValue />
          <DiscountConditions emptyHint="Add a spend threshold to qualify." />
          <DiscountAddCondition variant="ghost">
            Add a condition
          </DiscountAddCondition>
          <DiscountSummary />
        </DiscountBuilder>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";

import {
  FilterAdd,
  FilterBuilder,
  FilterChips,
  FilterRow,
  type FilterCondition,
} from "@/registry/hirael/ui/filter-builder";

const FIELDS = [
  { name: "status", label: "Status" },
  { name: "owner", label: "Owner" },
  { name: "created", label: "Created" },
];

const PLAN_FIELDS = [
  { name: "plan", label: "Plan", operators: ["is", "is not"] },
  { name: "seats", label: "Seats", operators: ["greater than", "less than"] },
  { name: "email", label: "Email", operators: ["contains", "starts with"] },
];

export default function FilterBuilderDemo() {
  const [basic, setBasic] = React.useState<FilterCondition[]>([
    { id: "row-status", field: "status", operator: "is", value: "Open" },
  ]);

  const [advanced, setAdvanced] = React.useState<FilterCondition[]>([
    { id: "row-plan", field: "plan", operator: "is", value: "Pro" },
    { id: "row-seats", field: "seats", operator: "greater than", value: "10" },
  ]);

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <FilterBuilder fields={FIELDS} value={basic} onValueChange={setBasic}>
        <FilterChips />
        {basic.map((condition) => (
          <FilterRow key={condition.id} condition={condition} />
        ))}
        <FilterAdd />
      </FilterBuilder>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium text-foreground">Audience</p>
        <FilterBuilder
          fields={PLAN_FIELDS}
          value={advanced}
          onValueChange={setAdvanced}
          className="gap-4"
        >
          {advanced.map((condition) => (
            <FilterRow key={condition.id} condition={condition} />
          ))}
          <FilterAdd variant="ghost">Add condition</FilterAdd>
          <FilterChips emptyHint="Everyone matches until you add a filter." />
        </FilterBuilder>
      </div>
    </div>
  );
}

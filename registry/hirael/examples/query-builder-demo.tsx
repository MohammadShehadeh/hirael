"use client";

import * as React from "react";

import {
  QueryBuilder,
  type QueryField,
  type QueryGroupNode,
} from "@/registry/hirael/ui/query-builder";

const accountFields: QueryField[] = [
  { name: "status", label: "Status", operators: ["is", "is not"] },
  { name: "plan", label: "Plan", operators: ["is", "is not"] },
  {
    name: "seats",
    label: "Seats",
    operators: ["is", "greater than", "less than"],
  },
  { name: "country", label: "Country", operators: ["is", "is not"] },
];

const initialQuery: QueryGroupNode = {
  id: "root",
  combinator: "and",
  rules: [
    { id: "r1", field: "status", operator: "is", value: "active" },
    {
      id: "g1",
      combinator: "or",
      rules: [
        { id: "r2", field: "plan", operator: "is", value: "pro" },
        { id: "r3", field: "seats", operator: "greater than", value: "10" },
      ],
    },
    { id: "r4", field: "country", operator: "is not", value: "US" },
  ],
};

const eventFields: QueryField[] = [
  { name: "type", label: "Event", operators: ["is", "is not"] },
  { name: "source", label: "Source", operators: ["is", "contains"] },
  { name: "date", label: "Date", operators: ["before", "after"] },
];

export default function QueryBuilderDemo() {
  const [query, setQuery] = React.useState<QueryGroupNode>(initialQuery);

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Audience filter
        </p>
        <QueryBuilder
          fields={accountFields}
          value={query}
          onValueChange={setQuery}
        />
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Event rules
        </p>
        <QueryBuilder fields={eventFields} />
      </div>
    </div>
  );
}

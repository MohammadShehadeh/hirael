"use client";

import * as React from "react";

import {
  NestedSortable,
  NestedSortableHandle,
  NestedSortableItem,
  NestedSortableLabel,
  type NestedItem,
} from "@/registry/hirael/ui/nested-sortable";

const nav: NestedItem[] = [
  { id: "home", label: "Home" },
  {
    id: "products",
    label: "Products",
    children: [
      { id: "components", label: "Components" },
      { id: "blocks", label: "Blocks" },
      { id: "templates", label: "Templates" },
    ],
  },
  {
    id: "docs",
    label: "Docs",
    children: [{ id: "getting-started", label: "Getting started" }],
  },
  { id: "pricing", label: "Pricing" },
];

const checklist: NestedItem[] = [
  {
    id: "launch",
    label: "Launch",
    children: [
      { id: "copy", label: "Write the copy" },
      { id: "qa", label: "Run QA" },
    ],
  },
  { id: "announce", label: "Announce" },
];

function renderRows(items: NestedItem[]): React.ReactNode {
  return items.map((item) => (
    <React.Fragment key={item.id}>
      <NestedSortableItem value={item.id}>
        <NestedSortableHandle />
        <NestedSortableLabel>{item.label}</NestedSortableLabel>
      </NestedSortableItem>
      {item.children ? renderRows(item.children) : null}
    </React.Fragment>
  ));
}

export default function NestedSortableDemo() {
  const [menu, setMenu] = React.useState(nav);
  const [tasks, setTasks] = React.useState(checklist);

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Navigation</p>
          <p className="text-sm text-muted-foreground">
            Drag to reorder. Drag sideways, or use the arrow keys, to nest an
            item under the one above.
          </p>
        </div>
        <NestedSortable value={menu} onValueChange={setMenu}>
          {renderRows(menu)}
        </NestedSortable>
      </div>

      <div className="grid gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Checklist</p>
          <p className="text-sm text-muted-foreground">
            Capped at one level of nesting.
          </p>
        </div>
        <NestedSortable value={tasks} onValueChange={setTasks} maxDepth={1}>
          {renderRows(tasks)}
        </NestedSortable>
      </div>
    </div>
  );
}

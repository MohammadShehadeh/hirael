"use client";

import * as React from "react";

import {
  Sortable,
  SortableHandle,
  SortableItem,
} from "@/registry/hirael/ui/sortable";

const tasks = {
  "design-review": "Design review with the product team",
  "fix-onboarding": "Fix onboarding empty state",
  "ship-registry": "Ship the registry build pipeline",
  "write-changelog": "Write the release changelog",
};

const tags = ["react", "tailwind", "radix", "cmdk", "lucide"];

export default function SortableDemo() {
  const [taskOrder, setTaskOrder] = React.useState(Object.keys(tasks));
  const [tagOrder, setTagOrder] = React.useState(tags);

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Tasks · drag handle
        </p>
        <Sortable value={taskOrder} onValueChange={setTaskOrder}>
          {Object.entries(tasks).map(([id, title]) => (
            <SortableItem key={id} value={id} className="p-3">
              <SortableHandle />
              <span className="flex-1 truncate">{title}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {id}
              </span>
            </SortableItem>
          ))}
        </Sortable>
        <p className="font-mono text-[10px] text-muted-foreground">
          order: [{taskOrder.join(", ")}]
        </p>
      </div>

      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Tags · horizontal, whole item drags
        </p>
        <Sortable
          orientation="horizontal"
          value={tagOrder}
          onValueChange={setTagOrder}
        >
          {tags.map((tag) => (
            <SortableItem
              key={tag}
              value={tag}
              className="rounded-full px-3 py-1 font-medium"
            >
              {tag}
            </SortableItem>
          ))}
        </Sortable>
        <p className="font-mono text-[10px] text-muted-foreground">
          order: [{tagOrder.join(", ")}]
        </p>
      </div>

      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Disabled item · skipped while sorting
        </p>
        <Sortable
          defaultValue={["draft", "locked", "review", "published"]}
          className="max-w-sm"
        >
          <SortableItem value="draft" className="p-3">
            <SortableHandle />
            Draft
          </SortableItem>
          <SortableItem value="locked" disabled className="p-3">
            <SortableHandle />
            Locked (disabled)
          </SortableItem>
          <SortableItem value="review" className="p-3">
            <SortableHandle />
            In review
          </SortableItem>
          <SortableItem value="published" className="p-3">
            <SortableHandle />
            Published
          </SortableItem>
        </Sortable>
      </div>
    </div>
  );
}

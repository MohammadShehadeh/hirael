"use client";

import {
  DiffViewer,
  DiffViewerHeader,
} from "@/registry/hirael/ui/diff-viewer";

const oldConfig = `{
  "name": "site",
  "version": "0.6.0",
  "scripts": {
    "build": "next build"
  }
}`;

const newConfig = `{
  "name": "site",
  "version": "0.7.0",
  "scripts": {
    "build": "next build",
    "check": "next lint"
  }
}`;

const oldFn = `export function total(items) {
  let sum = 0;
  for (const item of items) {
    sum += item.price;
  }
  return sum;
}`;

const newFn = `export function total(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}`;

export default function DiffViewerDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Unified
        </p>
        <DiffViewer oldText={oldConfig} newText={newConfig} />
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Split, with a header
        </p>
        <DiffViewer oldText={oldFn} newText={newFn} mode="split">
          <DiffViewerHeader
            fileName="lib/total.ts"
            oldLabel="for loop"
            newLabel="reduce"
          />
        </DiffViewer>
      </div>
    </div>
  );
}

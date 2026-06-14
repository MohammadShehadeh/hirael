"use client";

import {
  SplitView,
  SplitViewPanel,
  SplitViewResizer,
} from "@/registry/hirael/ui/split-view";

const FILES = [
  { name: "index.ts", meta: "2.1 KB" },
  { name: "router.ts", meta: "8.4 KB" },
  { name: "db.ts", meta: "3.0 KB" },
  { name: "auth.ts", meta: "5.7 KB" },
];

export default function SplitViewDemo() {
  return (
    <SplitView defaultSize={38} minSize={20} className="h-72 w-full max-w-2xl">
      <SplitViewPanel className="bg-card">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Files
          </span>
        </div>
        <ul className="p-1.5">
          {FILES.map((file, i) => (
            <li key={file.name}>
              <button
                type="button"
                className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-start text-sm transition-colors hover:bg-accent ${
                  i === 1
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <span className="truncate font-mono text-xs">{file.name}</span>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  {file.meta}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </SplitViewPanel>
      <SplitViewResizer />
      <SplitViewPanel className="bg-background">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span className="font-mono text-xs text-foreground">router.ts</span>
        </div>
        <pre className="overflow-auto p-4 font-mono text-xs leading-relaxed text-muted-foreground">
          {`export function createRouter() {
  const routes = new Map()
  return {
    add(path, handler) {
      routes.set(path, handler)
    },
    match(url) {
      return routes.get(url) ?? null
    },
  }
}`}
        </pre>
      </SplitViewPanel>
    </SplitView>
  );
}

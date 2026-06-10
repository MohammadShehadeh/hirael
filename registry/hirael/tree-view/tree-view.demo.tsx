"use client"

import * as React from "react"

import { TreeItem, TreeView } from "@/registry/hirael/ui/tree-view"

export default function TreeViewDemo() {
  const [selected, setSelected] = React.useState("page")

  return (
    <div className="grid w-full max-w-md gap-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        File explorer · selected{" "}
        <span className="text-foreground">{selected}</span>
      </p>
      <div className="rounded-md border border-border bg-card/40 p-2">
        <TreeView value={selected} onValueChange={setSelected}>
          <TreeItem value="app" label="app" defaultExpanded>
            <TreeItem value="layout" label="layout.tsx" />
            <TreeItem value="page" label="page.tsx" />
            <TreeItem value="components" label="components" defaultExpanded>
              <TreeItem value="header" label="header.tsx" />
              <TreeItem value="footer" label="footer.tsx" />
            </TreeItem>
          </TreeItem>
          <TreeItem value="lib" label="lib">
            <TreeItem value="utils" label="utils.ts" />
          </TreeItem>
          <TreeItem value="readme" label="README.md" />
          <TreeItem value="package" label="package.json" />
        </TreeView>
      </div>
    </div>
  )
}

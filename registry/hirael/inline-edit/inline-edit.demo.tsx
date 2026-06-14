"use client";

import * as React from "react";

import {
  InlineEdit,
  InlineEditControls,
  InlineEditInput,
  InlineEditPreview,
  InlineEditTextarea,
} from "@/registry/hirael/ui/inline-edit";

export default function InlineEditDemo() {
  const [title, setTitle] = React.useState("Quarterly revenue report");

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Single-line · title
        </p>
        <InlineEdit
          value={title}
          onValueChange={setTitle}
          placeholder="Untitled document"
          aria-label="Document title"
        >
          <div className="flex items-center gap-2">
            <InlineEditPreview className="text-sm font-medium" />
            <InlineEditInput aria-label="Edit document title" />
            <InlineEditControls />
          </div>
        </InlineEdit>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Textarea · validation + async submit
        </p>
        <InlineEdit
          defaultValue="Design systems engineer shipping accessible component registries."
          placeholder="Add a short bio"
          validate={(value) =>
            value.trim().length < 10
              ? "Bio must be at least 10 characters"
              : null
          }
          onSubmit={async () => {
            await new Promise((resolve) => setTimeout(resolve, 800));
          }}
        >
          <div className="grid gap-2">
            <InlineEditPreview className="text-sm leading-relaxed" />
            <InlineEditTextarea aria-label="Edit bio" rows={3} />
            <InlineEditControls className="justify-end" />
          </div>
        </InlineEdit>
        <p className="text-xs text-muted-foreground">
          Cmd/Ctrl + Enter submits, Escape cancels. Saving takes 800ms.
        </p>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          asChild · heading
        </p>
        <InlineEdit defaultValue="Release notes v2.4" required>
          <div className="flex items-center gap-2">
            <InlineEditPreview asChild>
              <h3 className="text-lg font-semibold tracking-tight" />
            </InlineEditPreview>
            <InlineEditInput aria-label="Edit heading" />
            <InlineEditControls />
          </div>
        </InlineEdit>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { Eraser, Sparkles, Wand2 } from "lucide-react";

import {
  PromptEditor,
  PromptEditorField,
  PromptEditorFooter,
  PromptEditorToolbar,
  PromptEditorVariable,
  PromptEditorVariables,
} from "@/registry/hirael/ui/prompt-editor";

export default function PromptEditorDemo() {
  const [system, setSystem] = React.useState(
    "You are a friendly assistant for {{name}}.\nAnswer questions about {{topic}} in two short sentences.",
  );
  const [reply, setReply] = React.useState(
    "Reply to {{customer}} about their {{order_id}} order.",
  );

  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          System prompt · controlled
        </p>
        <PromptEditor value={system} onValueChange={setSystem}>
          <PromptEditorField rows={5} placeholder="Write your prompt…" />
          <PromptEditorVariables label="Insert">
            <PromptEditorVariable name="name" />
            <PromptEditorVariable name="topic" />
            <PromptEditorVariable name="tone" />
          </PromptEditorVariables>
          <PromptEditorFooter />
        </PromptEditor>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          With a toolbar and custom footer
        </p>
        <PromptEditor value={reply} onValueChange={setReply}>
          <PromptEditorToolbar>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Sparkles className="size-3.5" />
              Improve
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Wand2 className="size-3.5" />
              Rephrase
            </button>
            <button
              type="button"
              onClick={() => setReply("")}
              className="ms-auto inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Eraser className="size-3.5" />
              Clear
            </button>
          </PromptEditorToolbar>
          <PromptEditorField rows={4} placeholder="Draft a reply…" />
          <PromptEditorVariables label="Variables">
            <PromptEditorVariable name="customer" />
            <PromptEditorVariable name="order_id" />
            <PromptEditorVariable name="agent_name" />
          </PromptEditorVariables>
          <PromptEditorFooter>
            <span>Tokens are an estimate.</span>
            <span className="font-mono">~{Math.ceil(reply.length / 4)}</span>
          </PromptEditorFooter>
        </PromptEditor>
      </div>
    </div>
  );
}

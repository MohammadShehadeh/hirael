"use client";

import * as React from "react";

import {
  AiCompletionField,
  AiCompletionGhost,
  AiCompletionHint,
  AiCompletionInput,
} from "@/registry/hirael/ui/ai-completion-input";

const PHRASES = [
  "thanks for the quick review",
  "thanks for catching that",
  "let me know if anything is unclear",
  "let me know what you think",
  "shipping this today",
  "the build is green now",
  "happy to pair on this tomorrow",
  "merging once CI passes",
];

function predict(value: string): string {
  if (value.trim() === "") return "";
  const lower = value.toLowerCase();
  const match = PHRASES.find(
    (phrase) => phrase.startsWith(lower) && phrase !== lower,
  );
  return match ?? "";
}

const COMMANDS: Record<string, string> = {
  g: "git status",
  gi: "git status",
  gc: "git commit -m ",
  gco: "git checkout ",
  gp: "git push origin main",
  n: "npm run",
  nr: "npm run build",
  d: "docker compose up -d",
};

function predictCommand(value: string): string {
  if (value === "") return "";
  return COMMANDS[value.toLowerCase()] ?? "";
}

export default function AiCompletionInputDemo() {
  const [message, setMessage] = React.useState("thanks");
  const [command, setCommand] = React.useState("");

  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Basic · type to see a suggestion
        </p>
        <AiCompletionInput
          value={message}
          onValueChange={setMessage}
          suggestion={predict(message)}
        >
          <AiCompletionField placeholder="Write a reply" />
          <AiCompletionHint />
        </AiCompletionInput>
        <p className="text-xs text-muted-foreground">
          Try &quot;let me&quot; or &quot;shipping&quot;. Tab accepts, Escape
          dismisses.
        </p>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Custom · command palette
        </p>
        <AiCompletionInput
          value={command}
          onValueChange={setCommand}
          suggestion={predictCommand(command)}
          onAccept={(value) => console.log("ran", value)}
        >
          <AiCompletionField
            placeholder="Type a command, e.g. gc"
            className="font-mono"
          />
          <AiCompletionHint className="font-mono">
            <AiCompletionGhost className="text-foreground" />
            <span>· press Tab</span>
          </AiCompletionHint>
        </AiCompletionInput>
        <p className="text-xs text-muted-foreground">
          Shortcuts: g, gc, gco, gp, nr, d.
        </p>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import {
  Terminal,
  TerminalBody,
  TerminalHeader,
  TerminalInput,
  TerminalLine,
  TerminalPrompt,
} from "@/registry/hirael/components/terminal";

type Entry = { kind: "command" | "output" | "error"; text: string };

const USER = "deploy@edge";

export default function TerminalDemo() {
  const t = useT();

  const [entries, setEntries] = React.useState<Entry[]>([
    { kind: "output", text: "hirael cloud shell — type `help` to start" },
  ]);

  function run(command: string) {
    const next: Entry[] = [{ kind: "command", text: command }];
    const [name, ...args] = command.split(/\s+/);

    switch (name) {
      case "help":
        next.push({
          kind: "output",
          text: "commands: help  ls  status  whoami  echo  clear",
        });
        break;
      case "ls":
        next.push({
          kind: "output",
          text: "services/  infra/  README.md  deploy.sh",
        });
        break;
      case "status":
        next.push({
          kind: "output",
          text: "api  ok    worker  ok    db  degraded",
        });
        break;
      case "whoami":
        next.push({ kind: "output", text: USER });
        break;
      case "echo":
        next.push({ kind: "output", text: args.join(" ") });
        break;
      case "clear":
        setEntries([]);
        return;
      default:
        next.push({ kind: "error", text: `command not found: ${name}` });
    }

    setEntries((prev) => [...prev, ...next]);
  }

  return (
    <div className="w-full max-w-2xl">
      <Terminal>
        <TerminalHeader>{USER}: ~/app</TerminalHeader>
        <TerminalBody>
          {entries.map((entry, i) => {
            if (entry.kind === "command") {
              return (
                <TerminalLine key={i}>
                  <TerminalPrompt>{USER}</TerminalPrompt>
                  {entry.text}
                </TerminalLine>
              );
            }
            return (
              <TerminalLine
                key={i}
                className={
                  entry.kind === "error"
                    ? "text-destructive"
                    : "text-muted-foreground"
                }
              >
                {entry.text}
              </TerminalLine>
            );
          })}
          <TerminalInput
            user={USER}
            onSubmit={run}
            aria-label={t({ en: "Terminal command", ar: "أمر الطرفية" })}
          />
        </TerminalBody>
      </Terminal>
      <p className="mt-2 text-xs text-muted-foreground">
        {t({
          en: "Try help, ls, status, whoami, echo, clear. ↑ / ↓ recall history.",
          ar: "جرّب help و ls و status و whoami و echo و clear. الأسهم ↑ / ↓ لاستعادة السجل.",
        })}
      </p>
    </div>
  );
}

"use client"

import * as React from "react"

import {
  Terminal,
  TerminalBody,
  TerminalHeader,
  TerminalInput,
  TerminalLine,
  TerminalOutput,
  TerminalPrompt,
  useTerminal,
} from "@/registry/hirael/ui/terminal"

const HELP = `Available commands:
  help     show this list
  echo     print the text you pass
  whoami   print the current user
  date     print the current time
  clear    clear the screen`

function WindowShell() {
  const { clear } = useTerminal()

  function run(input: string): React.ReactNode {
    const [command, ...rest] = input.trim().split(/\s+/)
    const args = rest.join(" ")

    switch (command) {
      case "":
        return null
      case "help":
        return HELP
      case "echo":
        return args
      case "whoami":
        return "mona"
      case "date":
        return new Date().toString()
      case "clear":
        clear()
        return null
      default:
        return (
          <TerminalOutput tone="error">
            command not found: {command}
          </TerminalOutput>
        )
    }
  }

  return (
    <>
      <TerminalLine>
        <TerminalPrompt />
        <span>whoami</span>
      </TerminalLine>
      <TerminalOutput>mona</TerminalOutput>
      <TerminalLine>
        <TerminalPrompt />
        <span>echo hello world</span>
      </TerminalLine>
      <TerminalOutput>hello world</TerminalOutput>
      <TerminalOutput tone="muted">Type help to see what works.</TerminalOutput>
      <TerminalInput onCommand={run} />
    </>
  )
}

function HeadlessShell() {
  function run(input: string): React.ReactNode {
    const trimmed = input.trim()
    if (!trimmed) return null
    if (trimmed === "ping") return "pong"
    if (trimmed === "version") return "hirael 1.0.0"
    return <TerminalOutput tone="muted">No output.</TerminalOutput>
  }

  return (
    <>
      <TerminalLine>
        <TerminalPrompt symbol="~/app ❯" className="text-accent-foreground" />
        <span>version</span>
      </TerminalLine>
      <TerminalOutput>hirael 1.0.0</TerminalOutput>
      <TerminalInput prompt="~/app ❯" onCommand={run} />
    </>
  )
}

export default function TerminalDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Window with a live prompt
        </p>
        <Terminal>
          <TerminalHeader title="zsh — ~/projects/hirael" />
          <TerminalBody>
            <WindowShell />
          </TerminalBody>
        </Terminal>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Headless, custom prompt
        </p>
        <Terminal>
          <TerminalBody>
            <HeadlessShell />
          </TerminalBody>
        </Terminal>
      </div>
    </div>
  )
}

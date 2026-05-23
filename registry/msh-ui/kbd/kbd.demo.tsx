"use client"

import { ArrowUp, Command, Option } from "lucide-react"

import { Kbd, KbdDisplay, KbdGroup } from "@/registry/sabk/kbd/kbd"

export default function KbdDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Pressable
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Kbd>A</Kbd>
          <Kbd>Esc</Kbd>
          <Kbd>Enter</Kbd>
          <Kbd>
            <ArrowUp className="size-3.5" />
          </Kbd>
          <Kbd disabled>Caps</Kbd>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Chords
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <KbdGroup>
            <Kbd>
              <Command className="size-3.5" />
            </Kbd>
            <span className="text-muted-foreground">+</span>
            <Kbd>K</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd>
              <Option className="size-3.5" />
            </Kbd>
            <span className="text-muted-foreground">+</span>
            <Kbd>Shift</Kbd>
            <span className="text-muted-foreground">+</span>
            <Kbd>P</Kbd>
          </KbdGroup>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Inline display
        </p>
        <p className="text-sm text-muted-foreground">
          Press <KbdDisplay>⌘</KbdDisplay> <KbdDisplay>K</KbdDisplay> to open
          the command palette, or <KbdDisplay>?</KbdDisplay> to view shortcuts.
        </p>
      </div>
    </div>
  )
}

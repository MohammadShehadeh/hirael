"use client";

import * as React from "react";

import { Button } from "@/registry/hirael/ui/button";
import {
  KeyboardShortcuts,
  KeyboardShortcutsTrigger,
  KeyboardShortcutsContent,
  KeyboardShortcutsSearch,
  KeyboardShortcutsGroup,
  KeyboardShortcut,
} from "@/registry/hirael/ui/keyboard-shortcuts";

export default function KeyboardShortcutsDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-3">
        <KeyboardShortcuts>
          <KeyboardShortcutsTrigger asChild>
            <Button variant="outline" className="w-fit">
              Shortcuts
            </Button>
          </KeyboardShortcutsTrigger>
          <KeyboardShortcutsContent description="Press ? anytime to open this.">
            <KeyboardShortcutsSearch />
            <div className="flex max-h-80 flex-col gap-5 overflow-y-auto p-6">
              <KeyboardShortcutsGroup heading="General">
                <KeyboardShortcut keys={["?"]}>
                  Show shortcuts
                </KeyboardShortcut>
                <KeyboardShortcut keys={["⌘", "K"]}>
                  Open command menu
                </KeyboardShortcut>
                <KeyboardShortcut keys={["⌘", ","]}>
                  Open settings
                </KeyboardShortcut>
              </KeyboardShortcutsGroup>

              <KeyboardShortcutsGroup heading="Navigation">
                <KeyboardShortcut keys={["G", "H"]}>Go home</KeyboardShortcut>
                <KeyboardShortcut keys={["G", "I"]}>
                  Go to inbox
                </KeyboardShortcut>
                <KeyboardShortcut keys={["J"]}>Next item</KeyboardShortcut>
                <KeyboardShortcut keys={["K"]}>
                  Previous item
                </KeyboardShortcut>
              </KeyboardShortcutsGroup>

              <KeyboardShortcutsGroup heading="Editing">
                <KeyboardShortcut keys={["⌘", "B"]}>Bold</KeyboardShortcut>
                <KeyboardShortcut keys={["⌘", "I"]}>Italic</KeyboardShortcut>
                <KeyboardShortcut keys={["⌘", "Z"]}>Undo</KeyboardShortcut>
                <KeyboardShortcut keys={["⌘", "⇧", "Z"]}>
                  Redo
                </KeyboardShortcut>
              </KeyboardShortcutsGroup>
            </div>
          </KeyboardShortcutsContent>
        </KeyboardShortcuts>
      </div>

      <div className="grid gap-3">
        <Button
          variant="outline"
          className="w-fit"
          onClick={() => setOpen(true)}
        >
          Open from a button
        </Button>
        <KeyboardShortcuts open={open} onOpenChange={setOpen} hotkey={null}>
          <KeyboardShortcutsContent title="Quick keys">
            <div className="flex flex-col gap-5 p-6">
              <KeyboardShortcutsGroup heading="Files">
                <KeyboardShortcut keys={["⌘", "N"]}>
                  New file
                </KeyboardShortcut>
                <KeyboardShortcut keys={["⌘", "S"]}>Save</KeyboardShortcut>
                <KeyboardShortcut keys={["⌘", "P"]}>
                  Go to file
                </KeyboardShortcut>
              </KeyboardShortcutsGroup>
            </div>
          </KeyboardShortcutsContent>
        </KeyboardShortcuts>
      </div>
    </div>
  );
}

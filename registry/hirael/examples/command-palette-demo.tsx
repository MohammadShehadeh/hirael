"use client";

import * as React from "react";
import {
  HomeIcon,
  SearchIcon,
  SettingsIcon,
  FilePlusIcon,
  UserPlusIcon,
  MoonIcon,
} from "lucide-react";

import { Button } from "@/registry/hirael/ui/button";
import {
  CommandPalette,
  CommandPaletteTrigger,
  CommandPaletteInput,
  CommandPaletteList,
  CommandPaletteEmpty,
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteSeparator,
} from "@/registry/hirael/ui/command-palette";

export default function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false);
  const [controlledOpen, setControlledOpen] = React.useState(false);
  const [ran, setRan] = React.useState<string | null>(null);

  function run(label: string, close: (next: boolean) => void) {
    setRan(label);
    close(false);
  }

  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-3">
        <CommandPaletteTrigger onClick={() => setOpen(true)} />
        <CommandPalette open={open} onOpenChange={setOpen}>
          <CommandPaletteInput placeholder="Type a command or search…" />
          <CommandPaletteList>
            <CommandPaletteEmpty>No results.</CommandPaletteEmpty>
            <CommandPaletteGroup heading="Navigation">
              <CommandPaletteItem
                icon={<HomeIcon />}
                onSelect={() => run("Home", setOpen)}
              >
                Home
              </CommandPaletteItem>
              <CommandPaletteItem
                icon={<SearchIcon />}
                shortcut="/"
                onSelect={() => run("Search", setOpen)}
              >
                Search
              </CommandPaletteItem>
              <CommandPaletteItem
                icon={<SettingsIcon />}
                shortcut="⌘,"
                onSelect={() => run("Settings", setOpen)}
              >
                Settings
              </CommandPaletteItem>
            </CommandPaletteGroup>
            <CommandPaletteSeparator />
            <CommandPaletteGroup heading="Actions">
              <CommandPaletteItem
                icon={<FilePlusIcon />}
                shortcut="⌘N"
                onSelect={() => run("New file", setOpen)}
              >
                New file
              </CommandPaletteItem>
              <CommandPaletteItem
                icon={<UserPlusIcon />}
                onSelect={() => run("Invite", setOpen)}
              >
                Invite people
              </CommandPaletteItem>
              <CommandPaletteItem
                icon={<MoonIcon />}
                shortcut="⌘T"
                onSelect={() => run("Toggle theme", setOpen)}
              >
                Toggle theme
              </CommandPaletteItem>
            </CommandPaletteGroup>
          </CommandPaletteList>
        </CommandPalette>
        {ran && (
          <p className="text-sm text-muted-foreground">Ran: {ran}</p>
        )}
      </div>

      <div className="grid gap-3">
        <Button
          variant="outline"
          className="w-fit"
          onClick={() => setControlledOpen(true)}
        >
          Open from a button
        </Button>
        <CommandPalette open={controlledOpen} onOpenChange={setControlledOpen}>
          <CommandPaletteInput placeholder="Search files…" />
          <CommandPaletteList>
            <CommandPaletteEmpty>No files.</CommandPaletteEmpty>
            <CommandPaletteGroup heading="Recent">
              <CommandPaletteItem
                onSelect={() => run("README.md", setControlledOpen)}
              >
                README.md
              </CommandPaletteItem>
              <CommandPaletteItem
                onSelect={() => run("package.json", setControlledOpen)}
              >
                package.json
              </CommandPaletteItem>
            </CommandPaletteGroup>
          </CommandPaletteList>
        </CommandPalette>
      </div>
    </div>
  );
}

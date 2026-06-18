"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { KbdDisplay, KbdGroup } from "@/registry/hirael/ui/kbd";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/registry/hirael/ui/command";

type CommandPaletteProps = Omit<
  React.ComponentProps<typeof CommandDialog>,
  "open" | "onOpenChange"
> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Single key paired with ⌘ / Ctrl to toggle the palette.
   * @default "k"
   */
  shortcut?: string;
};

function useControllableOpen(
  open: boolean | undefined,
  onOpenChange: ((open: boolean) => void) | undefined,
) {
  const [uncontrolled, setUncontrolled] = React.useState(false);
  const isControlled = open !== undefined;
  const value = isControlled ? open : uncontrolled;

  const setValue = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  return [value, setValue] as const;
}

function CommandPalette({
  open,
  onOpenChange,
  shortcut = "k",
  children,
  ...props
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useControllableOpen(open, onOpenChange);
  const key = shortcut.toLowerCase();

  React.useEffect(() => {
    if (typeof document === "undefined") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === key && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [key, isOpen, setIsOpen]);

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen} {...props}>
      {children}
    </CommandDialog>
  );
}

function CommandPaletteTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="command-palette-trigger"
      className={cn(
        "inline-flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground shadow-xs transition-colors outline-none hover:border-foreground/40 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    >
      {children ?? <span className="text-start">Search…</span>}
      <KbdGroup
        data-slot="command-palette-trigger-kbd"
        className="ms-auto opacity-70"
      >
        <KbdDisplay>⌘</KbdDisplay>
        <KbdDisplay>K</KbdDisplay>
      </KbdGroup>
    </button>
  );
}

function CommandPaletteInput({
  ...props
}: React.ComponentProps<typeof CommandInput>) {
  return <CommandInput data-slot="command-palette-input" {...props} />;
}

function CommandPaletteList({
  ...props
}: React.ComponentProps<typeof CommandList>) {
  return <CommandList data-slot="command-palette-list" {...props} />;
}

function CommandPaletteEmpty({
  ...props
}: React.ComponentProps<typeof CommandEmpty>) {
  return <CommandEmpty data-slot="command-palette-empty" {...props} />;
}

function CommandPaletteGroup({
  ...props
}: React.ComponentProps<typeof CommandGroup>) {
  return <CommandGroup data-slot="command-palette-group" {...props} />;
}

type CommandPaletteItemProps = React.ComponentProps<typeof CommandItem> & {
  /** Leading icon, typically a lucide-react icon. */
  icon?: React.ReactNode;
  /** Trailing keyboard hint rendered as a Kbd display. */
  shortcut?: string;
};

function CommandPaletteItem({
  icon,
  shortcut,
  children,
  ...props
}: CommandPaletteItemProps) {
  return (
    <CommandItem data-slot="command-palette-item" {...props}>
      {icon != null && (
        <span data-slot="command-palette-item-icon" className="shrink-0">
          {icon}
        </span>
      )}
      <span data-slot="command-palette-item-label">{children}</span>
      {shortcut != null && (
        <CommandShortcut data-slot="command-palette-item-shortcut">
          <KbdDisplay>{shortcut}</KbdDisplay>
        </CommandShortcut>
      )}
    </CommandItem>
  );
}

function CommandPaletteSeparator({
  ...props
}: React.ComponentProps<typeof CommandSeparator>) {
  return <CommandSeparator data-slot="command-palette-separator" {...props} />;
}

export {
  CommandPalette,
  CommandPaletteTrigger,
  CommandPaletteInput,
  CommandPaletteList,
  CommandPaletteEmpty,
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteSeparator,
};

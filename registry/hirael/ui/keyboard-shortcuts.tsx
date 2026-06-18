"use client";

import * as React from "react";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { KbdDisplay, KbdGroup } from "@/registry/hirael/ui/kbd";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/hirael/ui/dialog";

type KeyboardShortcutsContextValue = {
  query: string;
  setQuery: (query: string) => void;
  matches: (haystack: string) => boolean;
};

const KeyboardShortcutsContext =
  React.createContext<KeyboardShortcutsContextValue | null>(null);

function useKeyboardShortcuts() {
  const context = React.useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error(
      "KeyboardShortcuts parts must be used within <KeyboardShortcuts>.",
    );
  }
  return context;
}

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

type KeyboardShortcutsProps = Omit<
  React.ComponentProps<typeof Dialog>,
  "open" | "onOpenChange"
> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Key that opens the cheat sheet from anywhere. Pass null to disable
   * the global hotkey.
   * @default "?"
   */
  hotkey?: string | null;
};

function KeyboardShortcuts({
  open,
  onOpenChange,
  hotkey = "?",
  children,
  ...props
}: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useControllableOpen(open, onOpenChange);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (hotkey == null) return;
    if (typeof document === "undefined") return;

    const key = hotkey.toLowerCase();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT"
      ) {
        return;
      }

      if (event.key.toLowerCase() === key) {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [hotkey, setIsOpen]);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next) setQuery("");
      setIsOpen(next);
    },
    [setIsOpen],
  );

  const matches = React.useCallback(
    (haystack: string) => {
      const term = query.trim().toLowerCase();
      if (!term) return true;
      return haystack.toLowerCase().includes(term);
    },
    [query],
  );

  const value = React.useMemo<KeyboardShortcutsContextValue>(
    () => ({ query, setQuery, matches }),
    [query, matches],
  );

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      <Dialog
        data-slot="keyboard-shortcuts"
        open={isOpen}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </Dialog>
    </KeyboardShortcutsContext.Provider>
  );
}

function KeyboardShortcutsTrigger({
  ...props
}: React.ComponentProps<typeof DialogTrigger>) {
  return <DialogTrigger data-slot="keyboard-shortcuts-trigger" {...props} />;
}

type KeyboardShortcutsContentProps = React.ComponentProps<
  typeof DialogContent
> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
};

function KeyboardShortcutsContent({
  className,
  title = "Keyboard shortcuts",
  description,
  children,
  ...props
}: KeyboardShortcutsContentProps) {
  return (
    <DialogContent
      data-slot="keyboard-shortcuts-content"
      className={cn("gap-0 p-0 sm:max-w-lg", className)}
      {...props}
    >
      <DialogHeader
        data-slot="keyboard-shortcuts-header"
        className="border-b p-6 pb-4"
      >
        <DialogTitle data-slot="keyboard-shortcuts-title">{title}</DialogTitle>
        {description != null && (
          <DialogDescription data-slot="keyboard-shortcuts-description">
            {description}
          </DialogDescription>
        )}
      </DialogHeader>
      {children}
    </DialogContent>
  );
}

function KeyboardShortcutsSearch({
  className,
  placeholder = "Search shortcuts",
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "onChange">) {
  const { query, setQuery } = useKeyboardShortcuts();

  return (
    <div
      data-slot="keyboard-shortcuts-search"
      className="flex items-center gap-2 border-b px-6 py-3"
    >
      <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
      <input
        data-slot="keyboard-shortcuts-search-input"
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function KeyboardShortcutsGroup({
  className,
  children,
  heading,
  ...props
}: React.ComponentProps<"div"> & {
  /** Group heading shown above its shortcut rows. */
  heading?: React.ReactNode;
}) {
  const visibleChildren = React.Children.toArray(children).filter(Boolean);
  if (visibleChildren.length === 0) return null;

  return (
    <div
      data-slot="keyboard-shortcuts-group"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      {heading != null && (
        <div
          data-slot="keyboard-shortcuts-group-heading"
          className="px-2 pb-1 text-xs font-medium text-muted-foreground"
        >
          {heading}
        </div>
      )}
      {children}
    </div>
  );
}

type KeyboardShortcutProps = React.ComponentProps<"div"> & {
  /**
   * Keys in the combo, each rendered as a KbdDisplay inside a KbdGroup.
   * @example ["⌘", "K"]
   */
  keys: string[];
};

function KeyboardShortcut({
  className,
  keys,
  children,
  ...props
}: KeyboardShortcutProps) {
  const { matches } = useKeyboardShortcuts();

  const description =
    typeof children === "string" || typeof children === "number"
      ? String(children)
      : "";

  if (!matches(`${description} ${keys.join(" ")}`)) return null;

  return (
    <div
      data-slot="keyboard-shortcut"
      className={cn(
        "flex items-center justify-between gap-4 rounded-md px-2 py-1.5 text-sm text-foreground",
        className,
      )}
      {...props}
    >
      <span data-slot="keyboard-shortcut-description" className="text-start">
        {children}
      </span>
      <KbdGroup data-slot="keyboard-shortcut-keys" className="ms-auto shrink-0">
        {keys.map((key, index) => (
          <KbdDisplay key={`${key}-${index}`}>{key}</KbdDisplay>
        ))}
      </KbdGroup>
    </div>
  );
}

export {
  KeyboardShortcuts,
  KeyboardShortcutsTrigger,
  KeyboardShortcutsContent,
  KeyboardShortcutsSearch,
  KeyboardShortcutsGroup,
  KeyboardShortcut,
};

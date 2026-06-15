"use client";

import * as React from "react";
import { Check, ChevronDown, Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/hirael/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/hirael/ui/command";

export type Language = {
  /** Locale code used as the selected value, e.g. "en", "fr", "ar". */
  value: string;
  /** Name in the app's language, e.g. "French". */
  label: string;
  /** Endonym — the name in that language, e.g. "Français". */
  nativeLabel?: string;
  /** Group heading, e.g. "Suggested" vs "All". */
  group?: string;
  disabled?: boolean;
};

type Ctx = {
  value: string | undefined;
  setValue: (next: string | undefined) => void;
  languages: Language[];
  active: Language | undefined;
  open: boolean;
  setOpen: (next: boolean) => void;
  search: string;
  setSearch: (next: string) => void;
  disabled?: boolean;
};

const LanguageSwitcherContext = React.createContext<Ctx | null>(null);

function useLanguageSwitcher() {
  const ctx = React.useContext(LanguageSwitcherContext);
  if (!ctx) {
    throw new Error(
      "LanguageSwitcher compound parts must be used inside <LanguageSwitcher>",
    );
  }
  return ctx;
}

function LanguageCode({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <span
      data-slot="language-switcher-code"
      className={cn(
        "flex h-5 min-w-7 shrink-0 items-center justify-center rounded-sm bg-muted px-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase",
        className,
      )}
    >
      {value.split("-")[0]}
    </span>
  );
}

export type LanguageSwitcherProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  languages?: Language[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSearchChange?: (search: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

function LanguageSwitcher({
  value: valueProp,
  defaultValue,
  onValueChange,
  languages = [],
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSearchChange,
  disabled,
  children,
}: LanguageSwitcherProps) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue,
  );
  const value = valueProp !== undefined ? valueProp : internalValue;
  const setValue = React.useCallback(
    (next: string | undefined) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const [search, setSearchState] = React.useState("");
  const setSearch = React.useCallback(
    (next: string) => {
      setSearchState(next);
      onSearchChange?.(next);
    },
    [onSearchChange],
  );

  const active = languages.find((l) => l.value === value);

  const ctx = React.useMemo<Ctx>(
    () => ({
      value,
      setValue,
      languages,
      active,
      open,
      setOpen,
      search,
      setSearch,
      disabled,
    }),
    [
      value,
      setValue,
      languages,
      active,
      open,
      setOpen,
      search,
      setSearch,
      disabled,
    ],
  );

  return (
    <LanguageSwitcherContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </LanguageSwitcherContext.Provider>
  );
}

type LanguageSwitcherTriggerProps = Omit<
  React.ComponentProps<"button">,
  "children"
> & {
  placeholder?: string;
  /** Hide the text label and show only the globe and code. */
  iconOnly?: boolean;
  children?: React.ReactNode | ((ctx: Ctx) => React.ReactNode);
};

function LanguageSwitcherTrigger({
  placeholder = "Language",
  iconOnly = false,
  className,
  children,
  ...props
}: LanguageSwitcherTriggerProps) {
  const ctx = useLanguageSwitcher();
  const active = ctx.active;
  const labelText = active ? (active.nativeLabel ?? active.label) : placeholder;

  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        role="combobox"
        aria-expanded={ctx.open}
        aria-haspopup="listbox"
        aria-label={iconOnly ? labelText : undefined}
        disabled={ctx.disabled}
        data-slot="language-switcher-trigger"
        data-state={ctx.open ? "open" : "closed"}
        className={cn(
          "group flex h-9 items-center gap-2 rounded-md border border-input bg-transparent px-2.5 text-start text-sm outline-none transition-colors",
          "hover:border-ring/60 focus-visible:border-ring data-[state=open]:border-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          iconOnly ? "w-auto" : "w-full",
          className,
        )}
        {...props}
      >
        {typeof children === "function" ? (
          children(ctx)
        ) : children ? (
          children
        ) : (
          <>
            <Globe className="size-4 shrink-0 text-muted-foreground" />
            {!iconOnly && (
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  !active && "text-muted-foreground",
                )}
              >
                {labelText}
              </span>
            )}
            {iconOnly && active && <LanguageCode value={active.value} />}
            <ChevronDown
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-transform duration-150",
                ctx.open && "rotate-180",
              )}
            />
          </>
        )}
      </button>
    </PopoverTrigger>
  );
}

type LanguageSwitcherContentProps = React.ComponentProps<
  typeof PopoverContent
> & {
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  children?: React.ReactNode;
};

function LanguageSwitcherContent({
  className,
  searchable = true,
  searchPlaceholder = "Search languages…",
  emptyMessage = "No languages found.",
  children,
  ...props
}: LanguageSwitcherContentProps) {
  const ctx = useLanguageSwitcher();

  const groups = React.useMemo(() => {
    const map = new Map<string | undefined, Language[]>();
    for (const l of ctx.languages) {
      const key = l.group;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(l);
    }
    return Array.from(map.entries());
  }, [ctx.languages]);

  return (
    <PopoverContent
      align="start"
      sideOffset={6}
      data-slot="language-switcher-content"
      className={cn(
        "w-(--radix-popover-trigger-width) min-w-[14rem] p-0",
        className,
      )}
      onOpenAutoFocus={(e) => e.preventDefault()}
      {...props}
    >
      <Command shouldFilter={searchable} loop>
        {searchable && (
          <CommandInput
            placeholder={searchPlaceholder}
            value={ctx.search}
            onValueChange={ctx.setSearch}
          />
        )}
        <CommandList>
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          {children ??
            groups.map(([group, items]) => (
              <CommandGroup key={group ?? "__default"} heading={group}>
                {items.map((l) => (
                  <LanguageSwitcherItem key={l.value} language={l} />
                ))}
              </CommandGroup>
            ))}
        </CommandList>
      </Command>
    </PopoverContent>
  );
}

type LanguageSwitcherItemProps = Omit<
  React.ComponentProps<typeof CommandItem>,
  "value" | "onSelect" | "children"
> & {
  language: Language;
};

function LanguageSwitcherItem({
  language,
  className,
  ...props
}: LanguageSwitcherItemProps) {
  const ctx = useLanguageSwitcher();
  const selected = ctx.value === language.value;
  const primary = language.nativeLabel ?? language.label;

  return (
    <CommandItem
      value={`${language.label} ${language.nativeLabel ?? ""} ${language.value}`}
      disabled={language.disabled}
      onSelect={() => {
        ctx.setValue(language.value);
        ctx.setOpen(false);
      }}
      data-slot="language-switcher-item"
      className={cn("gap-2.5", className)}
      {...props}
    >
      <LanguageCode value={language.value} />
      <span className="flex min-w-0 flex-1 items-baseline gap-2">
        <span className="truncate">{primary}</span>
        {language.nativeLabel && language.nativeLabel !== language.label && (
          <span className="truncate text-xs text-muted-foreground">
            {language.label}
          </span>
        )}
      </span>
      {selected && <Check className="size-4 text-foreground" strokeWidth={3} />}
    </CommandItem>
  );
}

export {
  LanguageSwitcher,
  LanguageSwitcherTrigger,
  LanguageSwitcherContent,
  LanguageSwitcherItem,
};

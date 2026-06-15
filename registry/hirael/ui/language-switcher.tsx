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

function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const value = controlled === undefined ? uncontrolled : controlled;
  const setValue = React.useCallback(
    (next: T) => {
      if (controlled === undefined) setUncontrolled(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [value, setValue] as const;
}

type LanguageSwitcherContextValue = {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  active: Language | undefined;
  languages: Language[];
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
};

const LanguageSwitcherContext =
  React.createContext<LanguageSwitcherContextValue | null>(null);

function useLanguageSwitcher() {
  const context = React.useContext(LanguageSwitcherContext);
  if (!context) {
    throw new Error(
      "LanguageSwitcher parts must be used within <LanguageSwitcher>",
    );
  }
  return context;
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
  disabled,
  children,
}: LanguageSwitcherProps) {
  const [value, setValue] = useControllableState(
    valueProp,
    defaultValue,
    onValueChange,
  );
  const [open, setOpen] = useControllableState(
    openProp,
    defaultOpen,
    onOpenChange,
  );
  const active = languages.find((language) => language.value === value);

  const context = React.useMemo<LanguageSwitcherContextValue>(
    () => ({ value, setValue, active, languages, open, setOpen, disabled }),
    [value, setValue, active, languages, open, setOpen, disabled],
  );

  return (
    <LanguageSwitcherContext.Provider value={context}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </LanguageSwitcherContext.Provider>
  );
}

function LanguageSwitcherTrigger({
  placeholder = "Language",
  iconOnly = false,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & {
  placeholder?: string;
  /** Hide the text label and show only the globe and code. */
  iconOnly?: boolean;
  children?: React.ReactNode;
}) {
  const { active, open, disabled } = useLanguageSwitcher();
  const label = active ? (active.nativeLabel ?? active.label) : placeholder;

  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={iconOnly ? label : undefined}
        disabled={disabled}
        data-slot="language-switcher-trigger"
        data-state={open ? "open" : "closed"}
        className={cn(
          "group flex h-9 items-center gap-2 rounded-md border border-input bg-transparent px-2.5 text-start text-sm outline-none transition-colors",
          "hover:border-ring/60 focus-visible:border-ring data-[state=open]:border-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          iconOnly ? "w-auto" : "w-full",
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <Globe className="size-4 shrink-0 text-muted-foreground" />
            {iconOnly ? (
              active && <LanguageCode value={active.value} />
            ) : (
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  !active && "text-muted-foreground",
                )}
              >
                {label}
              </span>
            )}
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-150 group-data-[state=open]:rotate-180" />
          </>
        )}
      </button>
    </PopoverTrigger>
  );
}

function LanguageSwitcherContent({
  className,
  searchable = true,
  searchPlaceholder = "Search languages…",
  emptyMessage = "No languages found.",
  children,
  ...props
}: React.ComponentProps<typeof PopoverContent> & {
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}) {
  const { languages } = useLanguageSwitcher();
  const groups = useGroupedLanguages(languages);

  return (
    <PopoverContent
      align="start"
      sideOffset={6}
      data-slot="language-switcher-content"
      className={cn(
        "w-(--radix-popover-trigger-width) min-w-[14rem] p-0",
        className,
      )}
      onOpenAutoFocus={(event) => event.preventDefault()}
      {...props}
    >
      <Command loop>
        {searchable && <CommandInput placeholder={searchPlaceholder} />}
        <CommandList>
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          {children ??
            groups.map(([group, items]) => (
              <CommandGroup key={group ?? "__ungrouped"} heading={group}>
                {items.map((language) => (
                  <LanguageSwitcherItem
                    key={language.value}
                    language={language}
                  />
                ))}
              </CommandGroup>
            ))}
        </CommandList>
      </Command>
    </PopoverContent>
  );
}

function LanguageSwitcherItem({
  language,
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof CommandItem>,
  "value" | "onSelect" | "children"
> & {
  language: Language;
}) {
  const { value, setValue, setOpen } = useLanguageSwitcher();
  const selected = value === language.value;
  const primary = language.nativeLabel ?? language.label;

  return (
    <CommandItem
      value={`${language.label} ${language.nativeLabel ?? ""} ${language.value}`}
      disabled={language.disabled}
      onSelect={() => {
        setValue(language.value);
        setOpen(false);
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

/** Bucket languages by their `group`, preserving first-seen order. */
function useGroupedLanguages(languages: Language[]) {
  return React.useMemo(() => {
    const groups = new Map<string | undefined, Language[]>();
    for (const language of languages) {
      const bucket = groups.get(language.group) ?? [];
      bucket.push(language);
      groups.set(language.group, bucket);
    }
    return [...groups];
  }, [languages]);
}

export {
  LanguageSwitcher,
  LanguageSwitcherTrigger,
  LanguageSwitcherContent,
  LanguageSwitcherItem,
};

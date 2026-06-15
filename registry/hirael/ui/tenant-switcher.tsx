"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

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
  CommandSeparator,
} from "@/registry/hirael/ui/command";

export type Tenant = {
  /** Stable id used as the selected value. */
  value: string;
  /** Display name, e.g. "Acme Inc". */
  label: string;
  /** Logo image URL. Falls back to the label's initials. */
  image?: string;
  /** Secondary line under the name, e.g. a plan or role. */
  caption?: string;
  /** Group heading, e.g. "Personal" vs "Teams". */
  group?: string;
  disabled?: boolean;
};

type Ctx = {
  value: string | undefined;
  setValue: (next: string | undefined) => void;
  tenants: Tenant[];
  active: Tenant | undefined;
  open: boolean;
  setOpen: (next: boolean) => void;
  search: string;
  setSearch: (next: string) => void;
  disabled?: boolean;
};

const TenantSwitcherContext = React.createContext<Ctx | null>(null);

function useTenantSwitcher() {
  const ctx = React.useContext(TenantSwitcherContext);
  if (!ctx) {
    throw new Error(
      "TenantSwitcher compound parts must be used inside <TenantSwitcher>",
    );
  }
  return ctx;
}

function initials(label: string) {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function TenantLogo({
  tenant,
  className,
}: {
  tenant?: Tenant;
  className?: string;
}) {
  return (
    <span
      data-slot="tenant-switcher-logo"
      className={cn(
        "flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-muted text-[11px] font-medium text-foreground",
        className,
      )}
    >
      {tenant?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tenant.image} alt="" className="size-full object-cover" />
      ) : tenant ? (
        initials(tenant.label)
      ) : null}
    </span>
  );
}

export type TenantSwitcherProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  tenants?: Tenant[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSearchChange?: (search: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

function TenantSwitcher({
  value: valueProp,
  defaultValue,
  onValueChange,
  tenants = [],
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSearchChange,
  disabled,
  children,
}: TenantSwitcherProps) {
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

  const active = tenants.find((t) => t.value === value);

  const ctx = React.useMemo<Ctx>(
    () => ({
      value,
      setValue,
      tenants,
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
      tenants,
      active,
      open,
      setOpen,
      search,
      setSearch,
      disabled,
    ],
  );

  return (
    <TenantSwitcherContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </TenantSwitcherContext.Provider>
  );
}

type TenantSwitcherTriggerProps = Omit<
  React.ComponentProps<"button">,
  "children"
> & {
  placeholder?: string;
  children?: React.ReactNode | ((ctx: Ctx) => React.ReactNode);
};

function TenantSwitcherTrigger({
  placeholder = "Select workspace",
  className,
  children,
  ...props
}: TenantSwitcherTriggerProps) {
  const ctx = useTenantSwitcher();
  const active = ctx.active;

  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        role="combobox"
        aria-expanded={ctx.open}
        aria-haspopup="listbox"
        disabled={ctx.disabled}
        data-slot="tenant-switcher-trigger"
        data-state={ctx.open ? "open" : "closed"}
        className={cn(
          "group flex h-12 w-full items-center gap-2.5 rounded-md border border-input bg-transparent px-2.5 text-start text-sm outline-none transition-colors",
          "hover:border-ring/60 focus-visible:border-ring data-[state=open]:border-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
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
            <TenantLogo tenant={active} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span
                className={cn(
                  "truncate font-medium leading-tight",
                  !active && "text-muted-foreground",
                )}
              >
                {active ? active.label : placeholder}
              </span>
              {active?.caption && (
                <span className="truncate text-xs leading-tight text-muted-foreground">
                  {active.caption}
                </span>
              )}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
          </>
        )}
      </button>
    </PopoverTrigger>
  );
}

type TenantSwitcherContentProps = React.ComponentProps<
  typeof PopoverContent
> & {
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Pinned below the scrolling list, e.g. a <TenantSwitcherCreate>. */
  footer?: React.ReactNode;
  children?: React.ReactNode;
};

function TenantSwitcherContent({
  className,
  searchable = true,
  searchPlaceholder = "Find workspace…",
  emptyMessage = "No workspaces found.",
  footer,
  children,
  ...props
}: TenantSwitcherContentProps) {
  const ctx = useTenantSwitcher();

  const groups = React.useMemo(() => {
    const map = new Map<string | undefined, Tenant[]>();
    for (const t of ctx.tenants) {
      const key = t.group;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries());
  }, [ctx.tenants]);

  return (
    <PopoverContent
      align="start"
      sideOffset={6}
      data-slot="tenant-switcher-content"
      className={cn(
        "w-(--radix-popover-trigger-width) min-w-[15rem] p-0",
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
                {items.map((t) => (
                  <TenantSwitcherItem key={t.value} tenant={t} />
                ))}
              </CommandGroup>
            ))}
        </CommandList>
        {footer && (
          <>
            <CommandSeparator />
            <div className="p-1">{footer}</div>
          </>
        )}
      </Command>
    </PopoverContent>
  );
}

type TenantSwitcherItemProps = Omit<
  React.ComponentProps<typeof CommandItem>,
  "value" | "onSelect" | "children"
> & {
  tenant: Tenant;
  children?: React.ReactNode;
};

function TenantSwitcherItem({
  tenant,
  children,
  className,
  ...props
}: TenantSwitcherItemProps) {
  const ctx = useTenantSwitcher();
  const selected = ctx.value === tenant.value;

  return (
    <CommandItem
      value={`${tenant.label} ${tenant.value}`}
      disabled={tenant.disabled}
      onSelect={() => {
        ctx.setValue(tenant.value);
        ctx.setOpen(false);
      }}
      data-slot="tenant-switcher-item"
      className={cn("gap-2.5", className)}
      {...props}
    >
      <TenantLogo tenant={tenant} className="size-6 text-[10px]" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate leading-tight">
          {children ?? tenant.label}
        </span>
        {tenant.caption && (
          <span className="truncate text-xs leading-tight text-muted-foreground">
            {tenant.caption}
          </span>
        )}
      </span>
      {selected && <Check className="size-4 text-foreground" strokeWidth={3} />}
    </CommandItem>
  );
}

type TenantSwitcherCreateProps = React.ComponentProps<"button"> & {
  children?: React.ReactNode;
};

function TenantSwitcherCreate({
  className,
  children = "Create workspace",
  ...props
}: TenantSwitcherCreateProps) {
  return (
    <button
      type="button"
      data-slot="tenant-switcher-create"
      className={cn(
        "flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-start text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
        className,
      )}
      {...props}
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-dashed border-input text-muted-foreground">
        <Plus className="size-4" />
      </span>
      <span className="truncate">{children}</span>
    </button>
  );
}

export {
  TenantSwitcher,
  TenantSwitcherTrigger,
  TenantSwitcherContent,
  TenantSwitcherItem,
  TenantSwitcherCreate,
};

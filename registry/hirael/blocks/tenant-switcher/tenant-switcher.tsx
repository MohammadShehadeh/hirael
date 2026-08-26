"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";
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

export interface Tenant {
  value: string;
  label: string;
  /** Logo image URL. Falls back to the label's initials. */
  image?: string;
  /** Secondary line under the name, e.g. a plan or role. */
  caption?: string;
  /** Group heading, e.g. "Personal" vs "Teams". */
  group?: string;
  disabled?: boolean;
}

const useControllableState = <T,>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
) => {
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
};

interface TenantSwitcherContextValue {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  active: Tenant | undefined;
  tenants: Tenant[];
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
}

const TenantSwitcherContext =
  React.createContext<TenantSwitcherContextValue | null>(null);

const useTenantSwitcher = () => {
  const context = React.useContext(TenantSwitcherContext);
  if (!context) {
    throw new Error(
      "TenantSwitcher parts must be used within <TenantSwitcher>",
    );
  }
  return context;
};

const initials = (label: string) => {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
};

const TenantLogo = ({
  tenant,
  className,
}: {
  tenant?: Tenant;
  className?: string;
}) => {
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
};

export interface TenantSwitcherProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  tenants?: Tenant[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const TenantSwitcher = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  tenants = [],
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled,
  children,
}: TenantSwitcherProps) => {
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
  const active = tenants.find((tenant) => tenant.value === value);

  const context = React.useMemo<TenantSwitcherContextValue>(
    () => ({ value, setValue, active, tenants, open, setOpen, disabled }),
    [value, setValue, active, tenants, open, setOpen, disabled],
  );

  return (
    <TenantSwitcherContext.Provider value={context}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </TenantSwitcherContext.Provider>
  );
};

const TenantSwitcherTrigger = ({
  placeholder = "Select workspace",
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & {
  placeholder?: string;
  children?: React.ReactNode;
}) => {
  const { active, open, disabled } = useTenantSwitcher();

  return (
    <PopoverTrigger asChild>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        data-slot="tenant-switcher-trigger"
        data-state={open ? "open" : "closed"}
        className={cn(
          "group h-12 w-full justify-start gap-2.5 px-2.5 text-start font-normal data-[state=open]:border-ring",
          className,
        )}
        {...props}
      >
        {children ?? (
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
      </Button>
    </PopoverTrigger>
  );
};

const TenantSwitcherContent = ({
  className,
  searchable = true,
  searchPlaceholder = "Find workspace…",
  emptyMessage = "No workspaces found.",
  footer,
  children,
  ...props
}: React.ComponentProps<typeof PopoverContent> & {
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Pinned below the scrolling list, e.g. a <TenantSwitcherCreate>. */
  footer?: React.ReactNode;
}) => {
  const { tenants } = useTenantSwitcher();
  const groups = useGroupedTenants(tenants);

  return (
    <PopoverContent
      align="start"
      sideOffset={6}
      data-slot="tenant-switcher-content"
      className={cn(
        "w-(--radix-popover-trigger-width) min-w-[15rem] p-0",
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
                {items.map((tenant) => (
                  <TenantSwitcherItem key={tenant.value} tenant={tenant} />
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
};

const TenantSwitcherItem = ({
  tenant,
  children,
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof CommandItem>,
  "value" | "onSelect" | "children"
> & {
  tenant: Tenant;
  children?: React.ReactNode;
}) => {
  const { value, setValue, setOpen } = useTenantSwitcher();
  const selected = value === tenant.value;

  return (
    <CommandItem
      value={`${tenant.label} ${tenant.value}`}
      disabled={tenant.disabled}
      onSelect={() => {
        setValue(tenant.value);
        setOpen(false);
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
};

const TenantSwitcherCreate = ({
  className,
  children = "Create workspace",
  ...props
}: React.ComponentProps<"button">) => {
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
};

/** Bucket tenants by their `group`, preserving first-seen order. */
const useGroupedTenants = (tenants: Tenant[]) => {
  return React.useMemo(() => {
    const groups = new Map<string | undefined, Tenant[]>();
    for (const tenant of tenants) {
      const bucket = groups.get(tenant.group) ?? [];
      bucket.push(tenant);
      groups.set(tenant.group, bucket);
    }
    return [...groups];
  }, [tenants]);
};

export {
  TenantSwitcher,
  TenantSwitcherTrigger,
  TenantSwitcherContent,
  TenantSwitcherItem,
  TenantSwitcherCreate,
};

const TENANT_WORKSPACES: Tenant[] = [
  { value: "personal", label: "Personal", caption: "Free", group: "Personal" },
  { value: "acme", label: "Acme Inc", caption: "Pro plan", group: "Teams" },
  { value: "globex", label: "Globex", caption: "Enterprise", group: "Teams" },
  { value: "initech", label: "Initech", caption: "Pro plan", group: "Teams" },
];

const TenantSwitcherBlock = () => {
  const [workspace, setWorkspace] = React.useState<string | undefined>("acme");

  return (
    <section
      data-slot="tenant-switcher-block"
      className="flex w-full justify-center bg-background p-6 sm:p-10"
    >
      <div className="grid w-full max-w-sm gap-2">
        <span className="text-sm font-medium text-foreground">Workspace</span>
        <TenantSwitcher
          tenants={TENANT_WORKSPACES}
          value={workspace}
          onValueChange={setWorkspace}
        >
          <TenantSwitcherTrigger />
          <TenantSwitcherContent
            footer={
              <TenantSwitcherCreate onClick={() => setWorkspace("personal")}>
                Create workspace
              </TenantSwitcherCreate>
            }
          />
        </TenantSwitcher>
      </div>
    </section>
  );
};

export default TenantSwitcherBlock;

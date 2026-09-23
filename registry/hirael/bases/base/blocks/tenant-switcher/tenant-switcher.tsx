'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/registry/hirael/bases/base/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/registry/hirael/bases/base/ui/field';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/registry/hirael/bases/base/ui/command';

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

const useControllableState = <T,>(controlled: T | undefined, defaultValue: T, onChange?: (value: T) => void) => {
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

const TenantSwitcherContext = React.createContext<TenantSwitcherContextValue | null>(null);

const useTenantSwitcher = () => {
  const context = React.useContext(TenantSwitcherContext);
  if (!context) {
    throw new Error('TenantSwitcher parts must be used within <TenantSwitcher>');
  }

  return context;
};

const initials = (label: string) => {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
};

interface TenantLogoProps {
  tenant?: Tenant;
  className?: string;
}

const TenantLogo = ({ tenant, className }: TenantLogoProps) => {
  return (
    <span
      data-slot="tenant-switcher-logo"
      className={cn(
        'flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-muted text-[11px] font-medium text-foreground',
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
  const [value, setValue] = useControllableState(valueProp, defaultValue, onValueChange);
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
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

interface TenantSwitcherTriggerProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  placeholder?: string;
  children?: React.ReactNode;
}

const TenantSwitcherTrigger = ({
  placeholder = 'Select workspace',
  className,
  children,
  ...props
}: TenantSwitcherTriggerProps) => {
  const { active, open, disabled } = useTenantSwitcher();

  return (
    <PopoverTrigger
      render={
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled}
          data-slot="tenant-switcher-trigger"
          data-state={open ? 'open' : 'closed'}
          className={cn('group h-12 w-full justify-start text-start', className)}
          {...props}
        />
      }
    >
      {children ?? (
        <>
          <TenantLogo tenant={active} />
          <span
            key={active?.value ?? 'placeholder'}
            className="flex min-w-0 flex-1 animate-in flex-col duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both fade-in slide-in-from-bottom-1 motion-reduce:animate-none"
          >
            <span className={cn('truncate leading-tight font-medium', !active && 'text-muted-foreground')}>
              {active ? active.label : placeholder}
            </span>
            {active?.caption && (
              <span className="truncate text-xs leading-tight text-muted-foreground">{active.caption}</span>
            )}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </>
      )}
    </PopoverTrigger>
  );
};

const TenantSwitcherContent = ({
  className,
  searchable = true,
  searchPlaceholder = 'Find workspace…',
  emptyMessage = 'No workspaces found.',
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
      className={cn('w-(--anchor-width) min-w-60 p-0', className)}
      initialFocus={false}
      {...props}
    >
      <Command loop>
        {searchable && <CommandInput placeholder={searchPlaceholder} />}
        <CommandList>
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          {children ??
            groups.map(([group, items]) => (
              <CommandGroup key={group ?? '__ungrouped'} heading={group}>
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
}: Omit<React.ComponentProps<typeof CommandItem>, 'value' | 'onSelect' | 'children'> & {
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
      className={className}
      {...props}
    >
      <TenantLogo tenant={tenant} className="size-6 text-[10px]" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate leading-tight">{children ?? tenant.label}</span>
        {tenant.caption && (
          <span className="truncate text-xs leading-tight text-muted-foreground">{tenant.caption}</span>
        )}
      </span>
      {selected && <Check className="size-4 text-foreground" strokeWidth={3} />}
    </CommandItem>
  );
};

const TenantSwitcherCreate = ({
  className,
  children = 'Create workspace',
  ...props
}: React.ComponentProps<'button'>) => {
  return (
    <button
      type="button"
      data-slot="tenant-switcher-create"
      className={cn(
        'flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-start text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
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

export { TenantSwitcher, TenantSwitcherTrigger, TenantSwitcherContent, TenantSwitcherItem, TenantSwitcherCreate };

const TENANT_WORKSPACES: Tenant[] = [
  { value: 'personal', label: 'Personal', caption: 'Free', group: 'Personal' },
  { value: 'fieldnote', label: 'Fieldnote Labs', caption: 'Pro plan', group: 'Teams' },
  { value: 'kestrel', label: 'Kestrel Health', caption: 'Enterprise', group: 'Teams' },
  { value: 'harbor', label: 'Harbor Analytics', caption: 'Pro plan', group: 'Teams' },
];

const TenantSwitcherBlock = () => {
  const [tenants, setTenants] = React.useState(TENANT_WORKSPACES);
  const [workspace, setWorkspace] = React.useState<string | undefined>('fieldnote');
  const [open, setOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();

  const onCreatingChange = (next: boolean) => {
    setCreating(next);
    if (!next) {
      setName('');
      setError(undefined);
    }
  };

  const createWorkspace = (event: React.FormEvent) => {
    event.preventDefault();
    const label = name.trim();
    if (!label) {
      setError('Give the workspace a name.');

      return;
    }
    if (tenants.some((tenant) => tenant.label.toLowerCase() === label.toLowerCase())) {
      setError('You already have a workspace with that name.');

      return;
    }
    const value = `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${tenants.length}`;
    setTenants((prev) => [...prev, { value, label, caption: 'Free', group: 'Teams' }]);
    setWorkspace(value);
    onCreatingChange(false);
  };

  return (
    <section data-slot="tenant-switcher-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <div className="grid w-full max-w-sm animate-in gap-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none">
        <span className="text-sm font-medium text-foreground">Workspace</span>
        <TenantSwitcher
          tenants={tenants}
          value={workspace}
          onValueChange={setWorkspace}
          open={open}
          onOpenChange={setOpen}
        >
          <TenantSwitcherTrigger />
          <TenantSwitcherContent
            footer={
              <TenantSwitcherCreate
                onClick={() => {
                  setOpen(false);
                  setCreating(true);
                }}
              >
                Create workspace
              </TenantSwitcherCreate>
            }
          />
        </TenantSwitcher>
      </div>

      <Dialog open={creating} onOpenChange={onCreatingChange}>
        <DialogContent className="sm:max-w-sm">
          <form noValidate onSubmit={createWorkspace} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Create workspace</DialogTitle>
              <DialogDescription>Name it after your team or project. You can rename it later.</DialogDescription>
            </DialogHeader>
            <Field data-invalid={Boolean(error) || undefined}>
              <FieldLabel htmlFor="tenant-switcher-name">Workspace name</FieldLabel>
              <Input
                id="tenant-switcher-name"
                value={name}
                placeholder="Acme Studio"
                autoComplete="off"
                onChange={(event) => {
                  setName(event.target.value);
                  setError(undefined);
                }}
                aria-invalid={Boolean(error) || undefined}
                aria-describedby={error ? 'tenant-switcher-name-error' : undefined}
              />
              <FieldError id="tenant-switcher-name-error">{error}</FieldError>
            </Field>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TenantSwitcherBlock;

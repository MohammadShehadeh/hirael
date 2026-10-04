'use client';

import * as React from 'react';
import { Check, ChevronDown, ChevronRight, Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Checkbox } from '@/registry/hirael/bases/base/ui/checkbox';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/base/ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

export interface TreeSelectNode {
  value: string;
  label: string;
  children?: TreeSelectNode[];
  disabled?: boolean;
}

interface FlatNode {
  node: TreeSelectNode;
  depth: number;
  /** Labels from the root down to this node, for the trigger and search. */
  path: string[];
  parent: string | null;
  /** Selectable leaf values under this node, or the node itself when it is a leaf. */
  leaves: string[];
}

const flatten = (nodes: TreeSelectNode[], depth = 0, path: string[] = [], parent: string | null = null) => {
  const out: FlatNode[] = [];
  for (const node of nodes) {
    const nodePath = [...path, node.label];
    const children = node.children?.length ? flatten(node.children, depth + 1, nodePath, node.value) : [];
    const leaves = node.children?.length
      ? children.filter((c) => c.parent === node.value).flatMap((c) => c.leaves)
      : node.disabled
        ? []
        : [node.value];
    out.push({ node, depth, path: nodePath, parent, leaves }, ...children);
  }

  return out;
};

interface TreeSelectContextValue {
  multiple: boolean;
  selected: Set<string>;
  byValue: Map<string, FlatNode>;
  flat: FlatNode[];
  toggle: (flatNode: FlatNode) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
  selectParents: boolean;
}

const TreeSelectContext = React.createContext<TreeSelectContextValue | null>(null);

const useTreeSelect = () => {
  const ctx = React.useContext(TreeSelectContext);
  if (!ctx) {
    throw new Error('TreeSelect compound parts must be used inside <TreeSelect>');
  }

  return ctx;
};

interface TreeSelectBaseProps {
  options: TreeSelectNode[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface TreeSelectSingleProps extends TreeSelectBaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Let a branch be picked, not only its leaves. */
  selectParents?: boolean;
}

export interface TreeSelectMultipleProps extends TreeSelectBaseProps {
  /** Check any number of leaves. Checking a branch checks every leaf under it. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  selectParents?: never;
}

export type TreeSelectProps = TreeSelectSingleProps | TreeSelectMultipleProps;

const TreeSelect = (props: TreeSelectProps) => {
  const { options, open: openProp, defaultOpen = false, onOpenChange, disabled, children } = props;
  const multiple = props.multiple === true;
  const selectParents = !multiple && props.selectParents === true;

  const [open, setOpen] = useControllableState({ prop: openProp, defaultProp: defaultOpen, onChange: onOpenChange });
  const [value, setValue] = useControllableState<string[]>({
    prop:
      props.value === undefined
        ? undefined
        : multiple
          ? (props.value as string[])
          : props.value
            ? [props.value as string]
            : [],
    defaultProp: multiple
      ? ((props.defaultValue as string[] | undefined) ?? [])
      : props.defaultValue
        ? [props.defaultValue as string]
        : [],
    onChange: (next) => {
      if (props.multiple) props.onValueChange?.(next);
      else props.onValueChange?.(next[0] ?? null);
    },
  });

  const flat = React.useMemo(() => flatten(options), [options]);
  const byValue = React.useMemo(() => new Map(flat.map((f) => [f.node.value, f])), [flat]);
  const selected = React.useMemo(() => new Set(value), [value]);

  const toggle = React.useCallback(
    (flatNode: FlatNode) => {
      if (flatNode.node.disabled) return;
      if (!multiple) {
        setValue([flatNode.node.value]);
        setOpen(false);

        return;
      }
      const all = flatNode.leaves.every((leaf) => selected.has(leaf));
      const next = new Set(selected);
      for (const leaf of flatNode.leaves) {
        if (all) next.delete(leaf);
        else next.add(leaf);
      }
      // Keep the options' order rather than the order of clicks.
      setValue(flat.filter((f) => next.has(f.node.value)).map((f) => f.node.value));
    },
    [multiple, selected, setValue, setOpen, flat],
  );

  const clear = React.useCallback(() => setValue([]), [setValue]);

  const ctx = React.useMemo<TreeSelectContextValue>(
    () => ({ multiple, selected, byValue, flat, toggle, clear, open, setOpen, disabled, selectParents }),
    [multiple, selected, byValue, flat, toggle, clear, open, setOpen, disabled, selectParents],
  );

  return (
    <TreeSelectContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </TreeSelectContext.Provider>
  );
};

export interface TreeSelectTriggerProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  placeholder?: string;
  /** Show the full path, like "Europe / Germany / Berlin", for a single value. */
  showPath?: boolean;
  /** Chips shown before collapsing the rest into "+N", for multiple values. */
  maxChips?: number;
}

const TreeSelectTrigger = ({
  placeholder = 'Select an option',
  showPath = true,
  maxChips = 2,
  className,
  ...props
}: TreeSelectTriggerProps) => {
  const { multiple, selected, byValue, disabled } = useTreeSelect();
  const values = [...selected];
  const first = byValue.get(values[0]);

  return (
    <PopoverTrigger
      render={
        <Button
          type="button"
          variant="outline"
          role="combobox"
          disabled={disabled}
          data-slot="tree-select-trigger"
          data-empty={values.length === 0 || undefined}
          className={cn(
            'h-auto min-h-9 w-full justify-between font-normal data-empty:text-muted-foreground',
            className,
          )}
          {...props}
        />
      }
    >
      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1 text-start">
        {values.length === 0 ? (
          placeholder
        ) : multiple ? (
          <>
            {values.slice(0, maxChips).map((v) => (
              <Badge key={v} variant="secondary">
                {byValue.get(v)?.node.label ?? v}
              </Badge>
            ))}
            {values.length > maxChips && <Badge variant="outline">+{values.length - maxChips}</Badge>}
          </>
        ) : (
          <span className="truncate">
            {showPath && first ? (
              <>
                {first.path.slice(0, -1).map((segment) => (
                  <span key={segment} className="text-muted-foreground">
                    {segment} /{' '}
                  </span>
                ))}
                {first.node.label}
              </>
            ) : (
              first?.node.label
            )}
          </span>
        )}
      </span>
      <ChevronDown aria-hidden className="text-muted-foreground" />
    </PopoverTrigger>
  );
};

export interface TreeSelectContentProps extends Omit<React.ComponentProps<typeof PopoverContent>, 'children'> {
  /** Placeholder for the search field. Leave out to hide the field. */
  searchPlaceholder?: string;
  /** Shown when the search matches nothing. */
  emptyMessage?: React.ReactNode;
  /** Branches open when the popover first opens. Pass `true` to open all of them. */
  defaultExpanded?: string[] | true;
  /** Accessible name for the tree. */
  label?: string;
}

const TreeSelectContent = ({
  searchPlaceholder = 'Search',
  emptyMessage = 'No results',
  defaultExpanded,
  label = 'Options',
  align = 'start',
  className,
  ...props
}: TreeSelectContentProps) => {
  const { flat, byValue, selected, multiple, toggle, selectParents } = useTreeSelect();
  const [query, setQuery] = React.useState('');
  const [expanded, setExpanded] = React.useState<Set<string>>(() => {
    if (defaultExpanded === true) return new Set(flat.filter((f) => f.node.children?.length).map((f) => f.node.value));
    const open = new Set(defaultExpanded ?? []);
    // Reveal the current selection.
    for (const v of selected) {
      let parent = byValue.get(v)?.parent;
      while (parent) {
        open.add(parent);
        parent = byValue.get(parent)?.parent ?? null;
      }
    }

    return open;
  });
  const [focused, setFocused] = React.useState<string | null>(null);
  const treeRef = React.useRef<HTMLUListElement>(null);

  const needle = query.trim().toLocaleLowerCase();
  // While searching, show matches with their ancestors, all expanded.
  const matches = React.useMemo(() => {
    if (!needle) return null;
    const keep = new Set<string>();
    for (const f of flat) {
      if (!f.node.label.toLocaleLowerCase().includes(needle)) continue;
      keep.add(f.node.value);
      let parent = f.parent;
      while (parent) {
        keep.add(parent);
        parent = byValue.get(parent)?.parent ?? null;
      }
    }

    return keep;
  }, [needle, flat, byValue]);

  const visible = flat.filter((f) => {
    if (matches) return matches.has(f.node.value);
    let parent = f.parent;
    while (parent) {
      if (!expanded.has(parent)) return false;
      parent = byValue.get(parent)?.parent ?? null;
    }

    return true;
  });

  const activeValue = focused && visible.some((f) => f.node.value === focused) ? focused : visible[0]?.node.value;

  const focusItem = (value: string | undefined) => {
    if (!value) return;
    setFocused(value);
    treeRef.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(value)}"]`)?.focus();
  };

  const setBranch = (value: string, open: boolean) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (open) next.add(value);
      else next.delete(value);

      return next;
    });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, f: FlatNode) => {
    const index = visible.indexOf(f);
    const branch = Boolean(f.node.children?.length);
    const isOpen = matches !== null || expanded.has(f.node.value);
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const inward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const outward = rtl ? 'ArrowRight' : 'ArrowLeft';

    if (event.key === 'ArrowDown') focusItem(visible[index + 1]?.node.value);
    else if (event.key === 'ArrowUp') focusItem(visible[index - 1]?.node.value);
    else if (event.key === 'Home') focusItem(visible[0]?.node.value);
    else if (event.key === 'End') focusItem(visible.at(-1)?.node.value);
    else if (event.key === inward) {
      if (branch && !isOpen) setBranch(f.node.value, true);
      else if (branch) focusItem(visible[index + 1]?.node.value);
    } else if (event.key === outward) {
      if (branch && isOpen && !matches) setBranch(f.node.value, false);
      else focusItem(f.parent ?? undefined);
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (branch && !multiple && !selectParents) setBranch(f.node.value, !isOpen);
      else toggle(f);
    } else return;
    event.preventDefault();
  };

  return (
    <PopoverContent
      align={align}
      data-slot="tree-select-content"
      className={cn('w-(--anchor-width) min-w-64 p-0', className)}
      {...props}
    >
      {searchPlaceholder && (
        <div className="border-b border-border p-2">
          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  focusItem(visible[0]?.node.value);
                }
              }}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
            />
          </InputGroup>
        </div>
      )}
      {visible.length === 0 ? (
        <p className="p-4 text-center text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul
          ref={treeRef}
          role="tree"
          aria-label={label}
          aria-multiselectable={multiple || undefined}
          data-slot="tree-select-tree"
          className="max-h-72 overflow-y-auto overscroll-contain p-1"
        >
          {visible.map((f) => {
            const branch = Boolean(f.node.children?.length);
            const isOpen = matches !== null || expanded.has(f.node.value);
            const checkedLeaves = f.leaves.filter((leaf) => selected.has(leaf)).length;
            const state =
              f.leaves.length > 0 && checkedLeaves === f.leaves.length ? true : checkedLeaves > 0 ? 'mixed' : false;
            const isSelected = multiple ? state === true : selected.has(f.node.value);
            const pickable = multiple || !branch || selectParents;

            return (
              <li
                key={f.node.value}
                role="treeitem"
                aria-level={f.depth + 1}
                aria-expanded={branch ? isOpen : undefined}
                aria-selected={multiple ? undefined : isSelected}
                aria-checked={multiple ? state : undefined}
                aria-disabled={f.node.disabled || undefined}
                data-value={f.node.value}
                data-slot="tree-select-item"
                tabIndex={f.node.value === activeValue ? 0 : -1}
                onFocus={() => setFocused(f.node.value)}
                onKeyDown={(event) => handleKeyDown(event, f)}
                onClick={() => (pickable ? toggle(f) : setBranch(f.node.value, !isOpen))}
                style={{ paddingInlineStart: `${f.depth * 1.25 + 0.25}rem` }}
                className={cn(
                  'flex cursor-default items-center gap-1.5 rounded-sm py-1.5 pe-2 text-sm outline-none select-none',
                  'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
                  'aria-disabled:pointer-events-none aria-disabled:opacity-50',
                )}
              >
                <span
                  aria-hidden
                  onClick={(event) => {
                    if (!branch) return;
                    event.stopPropagation();
                    setBranch(f.node.value, !isOpen);
                  }}
                  className="flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted"
                >
                  {branch && (
                    <ChevronRight
                      className={cn('size-4 transition-transform', isOpen ? 'rotate-90' : 'rtl:rotate-180')}
                    />
                  )}
                </span>
                {multiple && (
                  <Checkbox
                    tabIndex={-1}
                    aria-hidden
                    checked={state === true}
                    indeterminate={state === 'mixed'}
                    disabled={f.node.disabled || f.leaves.length === 0}
                    className="pointer-events-none"
                  />
                )}
                <span className="flex-1 truncate">
                  {needle ? <Highlight text={f.node.label} needle={needle} /> : f.node.label}
                </span>
                {!multiple && isSelected && <Check aria-hidden className="size-4 shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </PopoverContent>
  );
};

const Highlight = ({ text, needle }: { text: string; needle: string }) => {
  const index = text.toLocaleLowerCase().indexOf(needle);
  if (index < 0) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-xs bg-primary/15 text-foreground">{text.slice(index, index + needle.length)}</mark>
      {text.slice(index + needle.length)}
    </>
  );
};

export { TreeSelect, TreeSelectTrigger, TreeSelectContent, useTreeSelect };

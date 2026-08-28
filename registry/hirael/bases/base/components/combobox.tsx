'use client';

import * as React from 'react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { InputGroup, InputGroupAddon } from '@/registry/hirael/bases/base/ui/input-group';

/**
 * Base UI styles className as `string | ((state) => string)`. The wrappers
 * here only ever pass strings through `cn`, so narrow it back to a string.
 */
type WithClassName<T> = Omit<T, 'className'> & { className?: string };

const Combobox = <Value, Multiple extends boolean | undefined = false>(
  props: ComboboxPrimitive.Root.Props<Value, Multiple>,
) => {
  return <ComboboxPrimitive.Root {...props} />;
};

const ComboboxValue = (props: ComboboxPrimitive.Value.Props) => {
  return <ComboboxPrimitive.Value {...props} />;
};

/**
 * Anchor the popup to a custom element (e.g. a <ComboboxChips> container)
 * rather than the input. Pass the returned ref to that element and to
 * <ComboboxContent anchor={…}>.
 */
const useComboboxAnchor = () => {
  return React.useRef<HTMLDivElement>(null);
};

const ComboboxInput = ({
  className,
  children,
  showClear = false,
  ...props
}: WithClassName<ComboboxPrimitive.Input.Props> & { showClear?: boolean }) => {
  return (
    <InputGroup
      className={cn(
        'has-[[data-slot=combobox-input]:focus-visible]:border-ring has-[[data-slot=combobox-input]:focus-visible]:ring-[3px] has-[[data-slot=combobox-input]:focus-visible]:ring-ring/50',
        className,
      )}
    >
      {children}
      <ComboboxPrimitive.Input
        data-slot="combobox-input"
        className="flex-1 rounded-none border-0 bg-transparent px-2 text-sm shadow-none outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showClear && <ComboboxClear />}
        <ComboboxPrimitive.Trigger
          aria-label="Toggle"
          className="flex size-6 shrink-0 items-center justify-center rounded-[calc(var(--radius)-5px)] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronsUpDownIcon className="size-3.5" />
        </ComboboxPrimitive.Trigger>
      </InputGroupAddon>
    </InputGroup>
  );
};

const ComboboxClear = ({ className, children, ...props }: WithClassName<ComboboxPrimitive.Clear.Props>) => {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      aria-label="Clear"
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-[calc(var(--radius)-5px)] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children ?? <XIcon className="size-3.5" />}
    </ComboboxPrimitive.Clear>
  );
};

const ComboboxChips = ({
  className,
  ref,
  ...props
}: WithClassName<ComboboxPrimitive.Chips.Props> & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  return (
    <ComboboxPrimitive.Chips
      ref={ref}
      data-slot="combobox-chips"
      className={cn(
        'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-1.5 py-1 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 dark:bg-input/30',
        className,
      )}
      {...props}
    />
  );
};

const ComboboxChip = ({ className, children, ...props }: WithClassName<ComboboxPrimitive.Chip.Props>) => {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        'flex items-center gap-1 rounded-sm bg-secondary py-0.5 ps-2 pe-1 text-xs font-medium text-secondary-foreground',
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ChipRemove
        aria-label="Remove"
        className="flex size-3.5 items-center justify-center rounded-[3px] text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
      >
        <XIcon className="size-3" />
      </ComboboxPrimitive.ChipRemove>
    </ComboboxPrimitive.Chip>
  );
};

const ComboboxChipsInput = ({ className, ...props }: WithClassName<ComboboxPrimitive.Input.Props>) => {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chips-input"
      className={cn(
        'h-6 min-w-16 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
};

const ComboboxContent = ({
  className,
  sideOffset = 6,
  align = 'start',
  alignOffset,
  anchor,
  children,
  ...props
}: WithClassName<ComboboxPrimitive.Popup.Props> & {
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  anchor?: ComboboxPrimitive.Positioner.Props['anchor'];
}) => {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        className="z-50 outline-none"
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            'max-h-[min(var(--available-height),20rem)] w-[var(--anchor-width)] min-w-[12rem] origin-[var(--transform-origin)] overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden',
            'data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-95 data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95',
            className,
          )}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
};

const ComboboxEmpty = ({ className, ...props }: WithClassName<ComboboxPrimitive.Empty.Props>) => {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn('py-6 text-center text-sm text-muted-foreground empty:py-0', className)}
      {...props}
    />
  );
};

const ComboboxList = ({ className, ...props }: WithClassName<ComboboxPrimitive.List.Props>) => {
  return <ComboboxPrimitive.List data-slot="combobox-list" className={cn('scroll-py-1', className)} {...props} />;
};

const ComboboxGroup = ({ className, ...props }: WithClassName<ComboboxPrimitive.Group.Props>) => {
  return <ComboboxPrimitive.Group data-slot="combobox-group" className={className} {...props} />;
};

const ComboboxLabel = ({ className, ...props }: WithClassName<ComboboxPrimitive.GroupLabel.Props>) => {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', className)}
      {...props}
    />
  );
};

const ComboboxCollection = (props: ComboboxPrimitive.Collection.Props) => {
  return <ComboboxPrimitive.Collection {...props} />;
};

const ComboboxItem = ({ className, children, ...props }: WithClassName<ComboboxPrimitive.Item.Props>) => {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none',
        'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <ComboboxPrimitive.ItemIndicator className="flex shrink-0 items-center">
        <CheckIcon className="size-4" strokeWidth={3} />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
};

const ComboboxSeparator = ({ className, ...props }: WithClassName<ComboboxPrimitive.Separator.Props>) => {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
};

export {
  Combobox,
  ComboboxValue,
  ComboboxInput,
  ComboboxClear,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxItem,
  ComboboxSeparator,
  useComboboxAnchor,
};

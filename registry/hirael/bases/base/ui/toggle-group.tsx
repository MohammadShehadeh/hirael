'use client';

import * as React from 'react';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { toggleVariants } from '@/registry/hirael/bases/base/ui/toggle';

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
  }
>({
  size: 'default',
  variant: 'default',
  spacing: 0,
});

type ToggleGroupType = 'single' | 'multiple' | undefined;

/**
 * Base UI always works with arrays. `type="single"` keeps the Radix-style API
 * (a single string value, `""` when nothing is pressed); `type="multiple"` or
 * omitting `type` (optionally with `multiple`) uses arrays.
 */
type ToggleGroupValueProps<Type extends ToggleGroupType> = Type extends 'single'
  ? {
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string, eventDetails: ToggleGroupPrimitive.ChangeEventDetails) => void;
    }
  : {
      value?: readonly string[];
      defaultValue?: readonly string[];
      onValueChange?: (value: string[], eventDetails: ToggleGroupPrimitive.ChangeEventDetails) => void;
    };

type ToggleGroupProps<Type extends ToggleGroupType> = Omit<
  ToggleGroupPrimitive.Props,
  'value' | 'defaultValue' | 'onValueChange'
> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    type?: Type;
  } & ToggleGroupValueProps<Type>;

function toValueArray(value: string | readonly string[] | undefined): readonly string[] | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'string') return value ? [value] : [];
  return value;
}

function ToggleGroup<Type extends ToggleGroupType = undefined>({
  className,
  variant,
  size,
  spacing = 0,
  children,
  type,
  multiple,
  value,
  defaultValue,
  onValueChange,
  ...props
}: ToggleGroupProps<Type>) {
  const isSingle = type === 'single';
  const handleValueChange = onValueChange as
    ((value: string | string[], eventDetails: ToggleGroupPrimitive.ChangeEventDetails) => void) | undefined;

  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      style={{ '--gap': spacing } as React.CSSProperties}
      className={cn(
        'group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs',
        className,
      )}
      multiple={type ? type === 'multiple' : multiple}
      value={toValueArray(value)}
      defaultValue={toValueArray(defaultValue)}
      onValueChange={(next, eventDetails) => {
        handleValueChange?.(isSingle ? (next[0] ?? '') : next, eventDetails);
      }}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, spacing }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        'w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10',
        'data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-s-md data-[spacing=0]:last:rounded-e-md data-[spacing=0]:data-[variant=outline]:border-s-0 data-[spacing=0]:data-[variant=outline]:first:border-s',
        className,
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}

export { ToggleGroup, ToggleGroupItem };

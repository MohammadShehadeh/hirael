'use client';

import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

interface BottomNavContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
}

const BottomNavContext = React.createContext<BottomNavContextValue | null>(null);

const useBottomNav = () => {
  const ctx = React.useContext(BottomNavContext);
  if (!ctx) {
    throw new Error('BottomNav compound parts must be used inside <BottomNav>');
  }

  return ctx;
};

export interface BottomNavProps extends Omit<React.ComponentProps<'nav'>, 'defaultValue'> {
  /** The active item. With links, set it from the current route. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Pin to the bottom of the screen, clear of the home indicator on phones. */
  fixed?: boolean;
}

/** A mobile tab bar: three to five destinations with icons, labels and badges. */
const BottomNav = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  fixed = false,
  className,
  children,
  ...props
}: BottomNavProps) => {
  const [value, setValue] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: (next) => next !== undefined && onValueChange?.(next),
  });
  const ctx = React.useMemo<BottomNavContextValue>(() => ({ value, setValue }), [value, setValue]);

  return (
    <BottomNavContext.Provider value={ctx}>
      <nav
        data-slot="bottom-nav"
        data-fixed={fixed || undefined}
        className={cn(
          'border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80',
          fixed && 'fixed inset-x-0 bottom-0 z-40',
          className,
        )}
        {...props}
      >
        <ul className="mx-auto flex max-w-lg items-stretch">{children}</ul>
      </nav>
    </BottomNavContext.Provider>
  );
};

export interface BottomNavItemProps extends Omit<React.ComponentProps<'button'>, 'value'> {
  value: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  /** Count or dot on the icon. `true` shows a dot, a number shows the count, 0 hides it. */
  badge?: number | boolean;
  /** Render your link as the item, keeping its href: `<BottomNavItem asChild><a href="/" /></BottomNavItem>`. */
  asChild?: boolean;
}

const BottomNavItem = ({
  value,
  icon,
  label,
  badge,
  asChild = false,
  className,
  children,
  onClick,
  ...props
}: BottomNavItemProps) => {
  const ctx = useBottomNav();
  const active = ctx.value === value;
  const Comp = asChild ? Slot : 'button';

  const content = (
    <>
      <span
        aria-hidden
        className="relative flex h-7 w-14 items-center justify-center rounded-full transition-colors group-data-active/item:bg-primary/12 [&_svg]:size-5"
      >
        {icon}
        {badge !== undefined && badge !== false && badge !== 0 && (
          <span
            className={cn(
              'absolute end-2 top-0 flex items-center justify-center rounded-full bg-primary text-[10px] leading-none font-medium text-primary-foreground ring-2 ring-background',
              badge === true
                ? 'size-2'
                : 'h-4 min-w-4 translate-x-1/2 -translate-y-1 px-1 tabular-nums rtl:-translate-x-1/2',
            )}
          >
            {badge === true ? null : badge > 99 ? '99+' : badge}
          </span>
        )}
      </span>
      <span className="truncate text-[11px] leading-none">{label}</span>
      {typeof badge === 'number' && badge > 0 && <span className="sr-only">, {badge}</span>}
    </>
  );

  return (
    <li className="flex min-w-0 flex-1">
      <Comp
        type={asChild ? undefined : 'button'}
        aria-current={active ? 'page' : undefined}
        data-slot="bottom-nav-item"
        data-active={active || undefined}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          if (!event.defaultPrevented) ctx.setValue(value);
        }}
        className={cn(
          'group/item flex min-w-0 flex-1 flex-col items-center gap-1 pt-2 pb-1.5 text-muted-foreground transition-colors outline-none select-none [-webkit-tap-highlight-color:transparent]',
          'hover:text-foreground focus-visible:text-foreground data-active:text-primary',
          'focus-visible:[&>span:first-child]:ring-2 focus-visible:[&>span:first-child]:ring-ring/50',
          className,
        )}
        {...props}
      >
        {asChild && <Slottable>{children}</Slottable>}
        {content}
      </Comp>
    </li>
  );
};

export { BottomNav, BottomNavItem, useBottomNav };

'use client';

import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/base/ui/dropdown-menu';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeLabels {
  light: string;
  dark: string;
  system: string;
  /** Accessible name of the toggle and the menu trigger. */
  toggle: string;
}

const DEFAULT_LABELS: ThemeLabels = { light: 'Light', dark: 'Dark', system: 'System', toggle: 'Toggle theme' };

const MODES: { value: ThemeMode; icon: typeof Sun }[] = [
  { value: 'light', icon: Sun },
  { value: 'system', icon: Monitor },
  { value: 'dark', icon: Moon },
];

const noopSubscribe = () => () => {};

// The theme is only known in the browser, so selection renders after hydration to avoid a mismatch.
const useMounted = () =>
  React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

// Both icons render and CSS picks one, so the button is correct before hydration too.
const ThemeIcon = () => {
  return (
    <>
      <Sun aria-hidden className="scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90" />
      <Moon
        aria-hidden
        className="absolute scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0"
      />
    </>
  );
};

export interface ThemeToggleProps extends Omit<React.ComponentProps<typeof Button>, 'children' | 'onClick'> {
  labels?: Partial<ThemeLabels>;
}

/** One button that flips between light and dark, starting from whatever is showing now. */
const ThemeToggle = ({ labels, variant = 'ghost', size = 'icon', className, ...props }: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const text = { ...DEFAULT_LABELS, ...labels };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      aria-label={text.toggle}
      data-slot="theme-toggle"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={cn('relative', className)}
      {...props}
    >
      <ThemeIcon />
    </Button>
  );
};

export interface ThemeSelectProps extends Omit<React.ComponentProps<typeof Button>, 'children'> {
  labels?: Partial<ThemeLabels>;
  /** Menu alignment against the trigger. */
  align?: 'start' | 'center' | 'end';
}

/** An icon button that opens a Light / Dark / System menu. */
const ThemeSelect = ({
  labels,
  align = 'end',
  variant = 'outline',
  size = 'icon',
  className,
  ...props
}: ThemeSelectProps) => {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const text = { ...DEFAULT_LABELS, ...labels };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant={variant}
            size={size}
            aria-label={text.toggle}
            data-slot="theme-select-trigger"
            className={cn('relative', className)}
            {...props}
          />
        }
      >
        <ThemeIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} data-slot="theme-select-content">
        <DropdownMenuRadioGroup value={mounted ? theme : undefined} onValueChange={(value) => setTheme(value)}>
          {MODES.map(({ value, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value} data-slot="theme-select-item">
              <Icon aria-hidden />
              {text[value]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export interface ThemeSwitcherProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  labels?: Partial<ThemeLabels>;
}

/** Three icon buttons side by side, with the current mode pressed. */
const ThemeSwitcher = ({ labels, className, ...props }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const text = { ...DEFAULT_LABELS, ...labels };
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const current = mounted ? (theme ?? 'system') : undefined;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    const step =
      event.key === forward || event.key === 'ArrowDown'
        ? 1
        : event.key === backward || event.key === 'ArrowUp'
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + MODES.length) % MODES.length;
    setTheme(MODES[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={text.toggle}
      data-slot="theme-switcher"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-border bg-background p-0.5',
        className,
      )}
      {...props}
    >
      {MODES.map(({ value, icon: Icon }, index) => {
        const checked = current === value;

        return (
          <button
            key={value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={text[value]}
            title={text[value]}
            tabIndex={checked || (current === undefined && value === 'system') ? 0 : -1}
            data-slot="theme-switcher-item"
            data-state={checked ? 'checked' : 'unchecked'}
            onClick={() => setTheme(value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none',
              'hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50',
              'data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground',
              '[&_svg]:size-4',
            )}
          >
            <Icon aria-hidden />
          </button>
        );
      })}
    </div>
  );
};

export { ThemeToggle, ThemeSelect, ThemeSwitcher };

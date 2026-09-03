'use client';

import * as React from 'react';
import { Menu, X } from 'lucide-react';
import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';

interface NavLink {
  label: string;
  href: string;
}

const NAV: readonly NavLink[] = [
  { label: 'Components', href: '#' },
  { label: 'Blocks', href: '#' },
  { label: 'Templates', href: '#' },
  { label: 'Changelog', href: '#' },
];

/** Scroll distance, in px, after which the bar shrinks into a pill. */
const SHRINK_AT = 100;

const SPRING = { type: 'spring', stiffness: 220, damping: 40 } as const;

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const BrandMark = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn('size-6 text-primary', className)}
    >
      <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
      <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
      <path d="M22 86 H58" opacity="0.7" />
      <path d="M28 92 H52" opacity="0.45" />
      <path d="M34 96 H46" opacity="0.25" />
    </svg>
  );
};

interface HeaderContextValue {
  isShrunk: boolean;
  reduce: boolean;
}

const HeaderContext = React.createContext<HeaderContextValue | null>(null);

const useHeader = () => {
  const context = React.useContext(HeaderContext);
  if (context === null) {
    throw new Error('Header parts must be used within <Header>');
  }
  return context;
};

export interface HeaderProps extends HTMLMotionProps<'header'> {
  /**
   * Scroll container to watch. Defaults to the window; pass a ref when the
   * header lives inside its own scrolling element.
   */
  scrollRef?: React.RefObject<HTMLElement | null>;
  /** Scroll offset, in px, after which the bar shrinks. */
  shrinkAt?: number;
}

const Header = ({ scrollRef, shrinkAt = SHRINK_AT, className, children, ...props }: HeaderProps) => {
  const reduce = useReducedMotion() ?? false;
  const [isShrunk, setIsShrunk] = React.useState(false);
  const { scrollY } = useScroll(scrollRef ? { container: scrollRef } : {});

  useMotionValueEvent(scrollY, 'change', (y) => {
    setIsShrunk(y > shrinkAt);
  });

  const value = React.useMemo(() => ({ isShrunk, reduce }), [isShrunk, reduce]);

  return (
    <HeaderContext.Provider value={value}>
      <motion.header
        data-slot="header"
        data-state={isShrunk ? 'shrunk' : 'expanded'}
        initial={false}
        className={cn('sticky inset-x-0 top-2 z-50 w-full px-2', className)}
        {...props}
      >
        {children}
      </motion.header>
    </HeaderContext.Provider>
  );
};

const HeaderBar = ({ className, ...props }: HTMLMotionProps<'div'>) => {
  const { isShrunk, reduce } = useHeader();
  return (
    <motion.div
      data-slot="header-bar"
      animate={{
        width: isShrunk ? '44%' : '100%',
        y: isShrunk ? 12 : 0,
      }}
      transition={reduce ? { duration: 0 } : SPRING}
      className={cn(
        'relative mx-auto hidden min-w-[720px] max-w-none items-center justify-between rounded-full border px-3 py-2 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 lg:flex',
        isShrunk
          ? 'border-border bg-card/80 shadow-[0_8px_32px_-12px_color-mix(in_oklch,var(--foreground)_25%,transparent)]'
          : 'border-transparent bg-transparent',
        className,
      )}
      {...props}
    />
  );
};

interface HeaderNavProps extends React.ComponentProps<'nav'> {
  items: readonly NavLink[];
  onItemClick?: () => void;
}

const HeaderNav = ({ items, onItemClick, className, ...props }: HeaderNavProps) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const { reduce } = useHeader();

  return (
    <nav
      data-slot="header-nav"
      onMouseLeave={() => setHoveredIndex(null)}
      className={cn('flex flex-1 items-center justify-center text-sm font-medium', className)}
      {...props}
    >
      {items.map((item, i) => (
        <a
          key={item.label}
          href={item.href}
          onMouseEnter={() => setHoveredIndex(i)}
          onFocus={() => setHoveredIndex(i)}
          onClick={onItemClick}
          className={cn(
            'relative rounded-full px-3.5 py-2 text-muted-foreground transition-colors hover:text-foreground',
            focusRing,
          )}
        >
          {hoveredIndex === i ? (
            <motion.span
              aria-hidden
              layoutId="header-02-hover"
              transition={reduce ? { duration: 0 } : SPRING}
              className="absolute inset-0 rounded-full bg-muted"
            />
          ) : null}
          <span className="relative z-10 whitespace-nowrap">{item.label}</span>
        </a>
      ))}
    </nav>
  );
};

const HeaderMobile = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { isShrunk } = useHeader();
  return (
    <div
      data-slot="header-mobile"
      className={cn(
        'mx-auto flex w-full flex-col rounded-3xl border px-3 py-2 backdrop-blur-md transition-[background-color,border-color] duration-300 lg:hidden',
        isShrunk ? 'border-border bg-card/80' : 'border-transparent',
        className,
      )}
      {...props}
    />
  );
};

interface HeaderMobileMenuProps extends React.ComponentProps<'div'> {
  open: boolean;
}

const HeaderMobileMenu = ({ open, className, children, ...props }: HeaderMobileMenuProps) => {
  const { reduce } = useHeader();
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          data-slot="header-mobile-menu"
          initial={reduce ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={reduce ? undefined : { opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className={cn('flex flex-col gap-1 px-1 pt-3 pb-2', className)} {...props}>
            {children}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

const Brand = () => {
  return (
    <a
      href="#"
      className={cn(
        'inline-flex items-center gap-2 ps-1 text-sm font-semibold tracking-tight text-foreground',
        focusRing,
      )}
    >
      <BrandMark className="size-5" />
      Hirael
    </a>
  );
};

const Header02 = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <div
      ref={scrollRef}
      data-slot="header-02-block"
      className="relative h-[640px] w-full overflow-y-auto bg-background"
    >
      <Header scrollRef={scrollRef}>
        <HeaderBar>
          <Brand />
          <HeaderNav items={NAV} />
          <div className="flex items-center gap-1.5">
            <Button render={<a href="#" />} nativeButton={false} variant="ghost" size="sm" className="rounded-full">
              Sign in
            </Button>
            <Button render={<a href="#" />} nativeButton={false} size="sm" className="rounded-full">
              Get started
            </Button>
          </div>
        </HeaderBar>

        <HeaderMobile>
          <div className="flex items-center justify-between">
            <Brand />
            <Button
              variant="ghost"
              size="icon"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="rounded-full"
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
          <HeaderMobileMenu open={open}>
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  focusRing,
                )}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2">
              <Button render={<a href="#" />} nativeButton={false} variant="outline" className="flex-1 rounded-full">
                Sign in
              </Button>
              <Button render={<a href="#" />} nativeButton={false} className="flex-1 rounded-full">
                Get started
              </Button>
            </div>
          </HeaderMobileMenu>
        </HeaderMobile>
      </Header>

      <div className="container flex flex-col gap-6 py-20 md:py-28">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Scroll to see the bar shrink
        </span>
        <h1 className="max-w-2xl font-serif text-4xl font-medium leading-[1.04] tracking-tight text-foreground sm:text-5xl">
          A nav that gets out of the way once you start reading.
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Full width at the top of the page, a floating pill after the first hundred pixels. The links keep a sliding
          hover state either way.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} aria-hidden className="h-40 rounded-lg border border-border bg-card" />
          ))}
        </div>
      </div>
    </div>
  );
};

export { Header, HeaderBar, HeaderNav, HeaderMobile, HeaderMobileMenu };

export default Header02;

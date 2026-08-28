'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

type ThrottledFn = (() => void) & { cancel: () => void };

const throttle = (fn: () => void, limit: number): ThrottledFn => {
  let lastRan = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const throttled = (() => {
    const now = Date.now();
    const remaining = limit - (now - lastRan);

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastRan = now;
      fn();
    } else if (!timer) {
      timer = setTimeout(() => {
        lastRan = Date.now();
        timer = null;
        fn();
      }, remaining);
    }
  }) as ThrottledFn;

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return throttled;
};

const flattenTocItems = (items: TocItem[]): TocItem[] => {
  const out: TocItem[] = [];
  const walk = (list: TocItem[]) => {
    for (const item of list) {
      out.push(item);
      if (item.children) walk(item.children);
    }
  };
  walk(items);
  return out;
};

const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const TOP_OFFSET = 56;

const useActiveHeading = (items: TocItem[]) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const headings = flattenTocItems(items);

    const update = () => {
      if (window.scrollY === 0) {
        setActiveId(null);
        return;
      }

      const boxes = headings
        .map(({ id }) => {
          const el = document.getElementById(id);
          if (!el) return null;
          return { id, box: el.getBoundingClientRect() };
        })
        .filter((entry): entry is { id: string; box: DOMRect } => entry !== null);

      let current = boxes.find(({ box }) => box.bottom > TOP_OFFSET && box.top < window.innerHeight);

      if (!current) {
        current = [...boxes].reverse().find(({ box }) => box.bottom < TOP_OFFSET);
      }

      setActiveId(current ? current.id : null);
    };

    const onScroll = throttle(update, 200);

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      onScroll.cancel();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  return activeId;
};

interface TocContextValue {
  activeId: string | null;
}

const TocContext = React.createContext<TocContextValue | null>(null);

const useTocContext = (component: string) => {
  const ctx = React.useContext(TocContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <TableOfContents>.`);
  }
  return ctx;
};

interface TableOfContentsProps extends Omit<React.ComponentProps<'nav'>, 'children'> {
  items?: TocItem[];
  activeId?: string | null;
  label?: React.ReactNode;
  children?: React.ReactNode;
}

const TableOfContents = ({
  items,
  activeId: controlledActiveId,
  label = 'On this page',
  className,
  children,
  'aria-label': ariaLabel,
  ...props
}: TableOfContentsProps) => {
  const trackedActiveId = useActiveHeading(controlledActiveId ? [] : (items ?? []));
  const activeId = controlledActiveId !== undefined ? controlledActiveId : trackedActiveId;

  const content =
    children ??
    (items && items.length > 0 ? (
      <>
        {label ? <TableOfContentsLabel>{label}</TableOfContentsLabel> : null}
        <TableOfContentsList items={items} />
      </>
    ) : null);

  if (!content) return null;

  return (
    <TocContext.Provider value={{ activeId }}>
      <nav
        data-slot="toc"
        aria-label={ariaLabel ?? 'On this page'}
        className={cn('flex flex-col gap-3', className)}
        {...props}
      >
        {content}
      </nav>
    </TocContext.Provider>
  );
};

type TableOfContentsLabelProps = React.ComponentProps<'p'>;

const TableOfContentsLabel = ({ className, ...props }: TableOfContentsLabelProps) => {
  return (
    <p
      data-slot="toc-label"
      className={cn('font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground', className)}
      {...props}
    />
  );
};

interface TableOfContentsListProps extends Omit<React.ComponentProps<'ul'>, 'children'> {
  items?: TocItem[];
  level?: number;
  children?: React.ReactNode;
}

const TableOfContentsList = ({ items, level = 0, className, children, ...props }: TableOfContentsListProps) => {
  if (children === undefined && (!items || items.length === 0)) return null;

  return (
    <ul
      data-slot="toc-list"
      data-level={level}
      className={cn('flex flex-col gap-1', level === 0 ? 'border-s border-border' : 'ms-4 mt-1', className)}
      {...props}
    >
      {children ?? items?.map((item) => <TableOfContentsItem key={item.id} item={item} level={level} />)}
    </ul>
  );
};

interface TableOfContentsItemProps extends Omit<React.ComponentProps<'li'>, 'children'> {
  item: TocItem;
  level?: number;
}

const TableOfContentsItem = ({ item, level = 0, className, ...props }: TableOfContentsItemProps) => {
  return (
    <li data-slot="toc-item" className={className} {...props}>
      <TableOfContentsLink href={`#${item.id}`} level={item.level}>
        {item.text}
      </TableOfContentsLink>
      {item.children && item.children.length > 0 ? (
        <TableOfContentsList items={item.children} level={level + 1} />
      ) : null}
    </li>
  );
};

interface TableOfContentsLinkProps extends React.ComponentProps<'a'> {
  level?: number;
}

const TableOfContentsLink = ({
  href = '',
  level = 2,
  className,
  onClick,
  children,
  ...props
}: TableOfContentsLinkProps) => {
  const { activeId } = useTocContext('TableOfContentsLink');
  const id = href.startsWith('#') ? href.slice(1) : href;
  const isActive = id.length > 0 && activeId === id;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (!id || !href.startsWith('#')) return;

    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <a
      data-slot="toc-link"
      data-active={isActive ? '' : undefined}
      href={href}
      aria-current={isActive ? 'true' : undefined}
      onClick={handleClick}
      className={cn(
        '-ms-px block border-s py-1 ps-4 text-sm transition-colors duration-150 ease-out',
        isActive
          ? 'border-foreground font-medium text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground',
        level >= 4 && 'text-xs',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export { TableOfContents, TableOfContentsLabel, TableOfContentsList, TableOfContentsItem, TableOfContentsLink };

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

const TOP_OFFSET = 56;

/** Fraction of the viewport height a heading must scroll past to become active. */
const ACTIVATION_RATIO = 0.25;

const useActiveHeading = (idsKey: string, enabled: boolean) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!enabled) return;
    const ids = idsKey ? idsKey.split(' ') : [];

    const update = () => {
      if (window.scrollY === 0) {
        setActiveId(null);

        return;
      }

      const boxes = ids
        .flatMap((id) => {
          const el = document.getElementById(id);

          return el ? [{ id, top: el.getBoundingClientRect().top }] : [];
        })
        .sort((a, b) => a.top - b.top);

      const { scrollHeight } = document.documentElement;
      const atBottom = scrollHeight > window.innerHeight && window.innerHeight + window.scrollY >= scrollHeight - 1;
      // At the bottom of the page the last headings can never reach the line, so the lowest visible one wins.
      const line = atBottom ? window.innerHeight : Math.max(TOP_OFFSET, window.innerHeight * ACTIVATION_RATIO);

      let current: string | null = null;
      for (const box of boxes) {
        if (box.top > line) break;
        current = box.id;
      }

      setActiveId(current);
    };

    let frame = 0;
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), update()));
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [idsKey, enabled]);

  return activeId;
};

interface TocContextValue {
  activeId: string | null;
  registerHeading: (id: string) => () => void;
}

const TocContext = React.createContext<TocContextValue | null>(null);

const useTocContext = (component: string) => {
  const ctx = React.useContext(TocContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <TableOfContents>.`);
  }

  return ctx;
};

export interface TableOfContentsProps extends Omit<React.ComponentProps<'nav'>, 'children'> {
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
  const headingCounts = React.useRef(new Map<string, number>());
  const [idsKey, setIdsKey] = React.useState('');

  // Every link registers its target, so the items and compound forms both track the active heading.
  const registerHeading = React.useCallback((id: string) => {
    const counts = headingCounts.current;
    counts.set(id, (counts.get(id) ?? 0) + 1);
    setIdsKey([...counts.keys()].join(' '));

    return () => {
      const next = (counts.get(id) ?? 1) - 1;
      if (next > 0) counts.set(id, next);
      else counts.delete(id);
      setIdsKey([...counts.keys()].join(' '));
    };
  }, []);

  const trackedActiveId = useActiveHeading(idsKey, controlledActiveId === undefined);
  const activeId = controlledActiveId !== undefined ? controlledActiveId : trackedActiveId;
  const contextValue = React.useMemo(() => ({ activeId, registerHeading }), [activeId, registerHeading]);

  const content =
    children ??
    (items && items.length > 0 ? (
      <>
        {label && <TableOfContentsLabel>{label}</TableOfContentsLabel>}
        <TableOfContentsList items={items} />
      </>
    ) : null);

  if (!content) return null;

  return (
    <TocContext.Provider value={contextValue}>
      <nav
        data-slot="toc"
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : 'On this page')}
        className={cn('flex flex-col gap-3', className)}
        {...props}
      >
        {content}
      </nav>
    </TocContext.Provider>
  );
};

export type TableOfContentsLabelProps = React.ComponentProps<'p'>;

const TableOfContentsLabel = ({ className, ...props }: TableOfContentsLabelProps) => {
  return <p data-slot="toc-label" className={cn('text-xs text-muted-foreground uppercase', className)} {...props} />;
};

export interface TableOfContentsListProps extends Omit<React.ComponentProps<'ul'>, 'children'> {
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

export interface TableOfContentsItemProps extends Omit<React.ComponentProps<'li'>, 'children'> {
  item: TocItem;
  level?: number;
}

const TableOfContentsItem = ({ item, level = 0, className, ...props }: TableOfContentsItemProps) => {
  return (
    <li data-slot="toc-item" className={className} {...props}>
      <TableOfContentsLink href={`#${item.id}`} level={item.level}>
        {item.text}
      </TableOfContentsLink>
      {!!item.children?.length && <TableOfContentsList items={item.children} level={level + 1} />}
    </li>
  );
};

export interface TableOfContentsLinkProps extends React.ComponentProps<'a'> {
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
  const { activeId, registerHeading } = useTocContext('TableOfContentsLink');
  const id = href.startsWith('#') ? href.slice(1) : href;
  const isActive = id.length > 0 && activeId === id;
  const isHash = href.startsWith('#') && id.length > 0;

  React.useEffect(() => (isHash ? registerHeading(id) : undefined), [isHash, id, registerHeading]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    const target = isHash && !event.defaultPrevented ? document.getElementById(id) : null;
    if (!target) return;
    event.preventDefault();
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <a
      data-slot="toc-link"
      data-active={isActive ? '' : undefined}
      href={href}
      aria-current={isActive ? 'location' : undefined}
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

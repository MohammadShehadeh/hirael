'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/site';

export const DocsTabsBar = () => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="sticky top-0 z-30 h-11 w-full border-b border-border bg-background/70 backdrop-blur-xl">
      <nav
        aria-label="Sections"
        className="mx-auto flex h-full w-full max-w-(--docs-layout-width) [scrollbar-width:none] items-stretch overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden"
      >
        {/* Scrolls sideways on narrow screens rather than widening the page. */}
        <div className="-ms-3 flex shrink-0 items-stretch gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex shrink-0 items-center px-3 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:text-foreground',
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
                {active && (
                  <span aria-hidden className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-foreground" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

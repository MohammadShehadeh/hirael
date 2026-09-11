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
      <nav aria-label="Sections" className="mx-auto flex h-full w-full max-w-(--docs-layout-width) items-stretch px-4">
        <div className="-ms-3 flex items-stretch gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex items-center px-3 text-sm font-medium transition-colors outline-none focus-visible:text-foreground',
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

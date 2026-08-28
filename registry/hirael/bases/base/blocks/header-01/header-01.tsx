'use client';

import * as React from 'react';
import { ChevronDown, Menu } from 'lucide-react';

import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/base/ui/dropdown-menu';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/registry/hirael/bases/base/ui/drawer';

interface NavLink {
  label: string;
  href: string;
}
type NavItem = NavLink | { label: string; items: NavLink[] };

const NAV: NavItem[] = [
  {
    label: 'Product',
    items: [
      { label: 'Overview', href: '#' },
      { label: 'Features', href: '#' },
      { label: 'Integrations', href: '#' },
    ],
  },
  { label: 'Pricing', href: '#' },
  { label: 'Docs', href: '#' },
  { label: 'Changelog', href: '#' },
];

const navLink =
  'block rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

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
      className={className}
    >
      <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
      <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
      <path d="M22 86 H58" opacity="0.7" />
      <path d="M28 92 H52" opacity="0.45" />
      <path d="M34 96 H46" opacity="0.25" />
    </svg>
  );
};

const Header01 = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="container w-full">
        <div className="flex h-14 items-center justify-between">
          <a
            href="#"
            className="inline-flex items-center font-mono text-sm font-semibold tracking-[-0.02em] text-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BrandMark className="me-1.5 size-5" />
            Hirael
          </a>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {NAV.map((n) =>
                'items' in n ? (
                  <li key={n.label}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <button
                            type="button"
                            className="group inline-flex items-center gap-1 rounded-sm px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-open:text-foreground"
                          />
                        }
                      >
                        {n.label}
                        <ChevronDown className="size-3.5 transition-transform duration-200 group-data-open:rotate-180" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44">
                        {n.items.map((item) => (
                          <DropdownMenuItem key={item.label} render={<a href={item.href} />}>
                            {item.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                ) : (
                  <li key={n.label}>
                    <a
                      href={n.href}
                      className="rounded-sm px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {n.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button render={<a href="#" />} variant="ghost" size="sm" className="rounded-full">
              Sign in
            </Button>
            <Button render={<a href="#" />} variant="default" size="sm" className="rounded-full">
              Get started
            </Button>
          </div>

          <Drawer>
            <DrawerTrigger
              render={<Button variant="outline" size="icon" aria-label="Open menu" className="rounded-sm md:hidden" />}
            >
              <Menu className="size-4" />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-start">
                <DrawerTitle className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  Menu
                </DrawerTitle>
              </DrawerHeader>
              <nav className="px-4">
                <ul className="flex flex-col gap-0.5">
                  {NAV.map((n) =>
                    'items' in n ? (
                      <li key={n.label}>
                        <span className="block px-3 pt-2 pb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {n.label}
                        </span>
                        <ul className="flex flex-col">
                          {n.items.map((item) => (
                            <li key={item.label}>
                              <DrawerClose render={<a href={item.href} className={navLink} />}>
                                {item.label}
                              </DrawerClose>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : (
                      <li key={n.label}>
                        <DrawerClose render={<a href={n.href} className={navLink} />}>{n.label}</DrawerClose>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
              <DrawerFooter className="gap-2">
                <Button render={<a href="#" />} variant="ghost" className="w-full justify-center rounded-full">
                  Sign in
                </Button>
                <Button render={<a href="#" />} variant="default" className="w-full justify-center rounded-full">
                  Get started
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
};

export default Header01;

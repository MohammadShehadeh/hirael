"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/site";
import { CommandMenu } from "@/components/showcase/command-menu";
import { BrandLockup } from "@/components/showcase/logo";
import { ThemeToggle } from "@/components/showcase/theme-toggle";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/hirael/ui/drawer";

export function SiteHeader({
  className,
  withSidebarTrigger,
}: {
  className?: string;
  withSidebarTrigger?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Condense the bar into a tighter glass pill once the page leaves the top.
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn("sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="size-full bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-background/70 dark:bg-background/30" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-border/60" />
      </div>
      <div
        className={cn(
          "mx-auto w-full transition-[max-width,padding] duration-300 ease-out",
          scrolled ? "max-w-4xl pt-3" : "max-w-6xl pt-4",
        )}
      >
        <div
          className={cn(
            "relative flex h-14 items-center justify-between gap-3 rounded-full ps-4 pe-2 transition-all duration-300 ease-out sm:ps-5",
            scrolled
              ? "glass-panel-strong"
              : "border border-transparent bg-transparent",
          )}
        >
          <div className="flex shrink-0 items-center gap-2">
            {withSidebarTrigger}
            <Link
              href="/"
              aria-label={`${SITE.name} | home`}
              className="group flex shrink-0 items-center gap-2 rounded-full py-1 transition-opacity hover:opacity-80"
            >
              <BrandLockup logoClassName="h-8" />
            </Link>
          </div>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[13px] tracking-tight transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <CommandMenu />
            <ThemeToggle />
            <Drawer
              direction="bottom"
              open={mobileOpen}
              onOpenChange={setMobileOpen}
            >
              <DrawerTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card/60 text-foreground transition-colors hover:border-foreground/40 hover:bg-accent md:hidden"
                >
                  <Menu className="size-3.5" />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="flex flex-row items-center justify-between border-b border-border text-start">
                  <DrawerTitle className="flex items-center">
                    <BrandLockup logoClassName="h-8" />
                    <span className="sr-only">Navigation</span>
                  </DrawerTitle>
                  <DrawerClose asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-foreground/40 hover:bg-accent"
                    >
                      <X className="size-3.5" />
                    </button>
                  </DrawerClose>
                </DrawerHeader>
                <nav className="flex flex-col gap-0.5 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                  {NAV_LINKS.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "rounded-xl px-3 py-2.5 text-sm transition-colors",
                          active
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Star, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/site";
import { CommandMenu } from "@/components/command-menu";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/registry/hirael/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/hirael/ui/drawer";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

// Compact star count: 1234 -> "1.2k", 12345 -> "12k".
function formatStars(n: number): string {
  if (n < 1000) return `${n}`;
  return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
}

export function SiteHeader({
  className,
  withSidebarTrigger,
  stars,
}: {
  className?: string;
  withSidebarTrigger?: React.ReactNode;
  /** Build-time GitHub star count; omit or pass null to hide the badge. */
  stars?: number | null;
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
    <header className={cn("fixed top-3 z-40 w-full", className)}>
      <div className="container w-full">
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
              <Logo className="h-8" />
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
            {stars ? (
              <a
                href={SITE.githubRepoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Star ${SITE.name} on GitHub, ${stars.toLocaleString()} stars`}
                className="hidden items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-[13px] tracking-tight text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground sm:inline-flex"
              >
                <GithubIcon className="size-3.5" />
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Star className="size-3 fill-current" />
                  {formatStars(stars)}
                </span>
              </a>
            ) : null}
            <CommandMenu />
            <ThemeToggle />
            <Drawer
              direction="bottom"
              open={mobileOpen}
              onOpenChange={setMobileOpen}
            >
              <DrawerTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="rounded-full border border-border bg-card/60 text-foreground hover:border-foreground/40 md:hidden"
                >
                  <Menu className="size-3.5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="flex flex-row items-center justify-between border-b border-border text-start">
                  <DrawerTitle className="flex items-center">
                    <Logo className="h-8" />
                    <span className="sr-only">Navigation</span>
                  </DrawerTitle>
                  <DrawerClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Close menu"
                      className="rounded-full border border-border bg-card text-foreground hover:border-foreground/40"
                    >
                      <X className="size-3.5" />
                    </Button>
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

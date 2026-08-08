"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/site";
import { CommandMenu } from "@/components/showcase/command-menu";
import { Logo } from "@/components/showcase/logo";
import { ThemeToggle } from "@/components/showcase/theme-toggle";
import { Separator } from "@/registry/hirael/ui/separator";
import { SidebarTrigger } from "@/registry/hirael/ui/sidebar";

export function ShowcaseTopbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur-md sm:px-4">
      <SidebarTrigger className="-ml-1 md:hidden" />
      <Separator orientation="vertical" className="mx-1 h-5 md:hidden" />
      <Link
        href="/"
        className="flex items-center gap-2 rounded-sm py-1 transition-colors md:hidden"
        aria-label="Hirael | home"
      >
        <Logo className="h-8" />
      </Link>

      <nav className="hidden flex-1 items-center gap-1 md:flex">
        {NAV_LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-1.5 text-[13px] tracking-tight transition-colors",
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

      <div className="ml-auto flex items-center gap-1.5">
        <CommandMenu />
        <ThemeToggle />
      </div>
    </header>
  );
}

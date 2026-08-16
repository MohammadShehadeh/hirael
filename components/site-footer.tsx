import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { Logo } from "@/components/logo";

const FOOTER_LINKS: {
  label: string;
  links: { href: string; label: string; external?: boolean }[];
}[] = [
  {
    label: "Library",
    links: [
      { href: "/components", label: "Components" },
      { href: "/blocks", label: "Blocks" },
      { href: "/templates", label: "Templates" },
      { href: "/theme", label: "Theme playground" },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: "/changelog", label: "Changelog" },
      {
        href: "https://ui.shadcn.com",
        label: "shadcn/ui",
        external: true,
      },
    ],
  },
  {
    label: "Author",
    links: [
      { href: SITE.authorUrl, label: "Portfolio", external: true },
      { href: SITE.githubUrl, label: "GitHub", external: true },
    ],
  },
];

export function SiteFooter({ className }: { className?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("mt-auto pb-4 sm:pb-6", className)}>
      <div className="container w-full">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-elevated sm:rounded-[2rem]">
          {/* Texture: a soft halo and a masked dot grid, contained in the panel. */}
          <div aria-hidden className="ambient-halo opacity-70" />
          <div
            aria-hidden
            className="bg-dot-grid pointer-events-none absolute inset-0 opacity-30 mask-[radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent_80%)]"
          />

          <div className="relative px-6 pt-12 sm:px-10 sm:pt-14 lg:px-14">
            {/* Top row: brand + tagline, and a primary call to action. */}
            <div className="flex flex-col gap-8 border-b border-border/70 pb-10 md:flex-row md:items-end md:justify-between">
              <div className="flex max-w-sm flex-col gap-4">
                <Link
                  href="/"
                  aria-label={`${SITE.name} | home`}
                  className="inline-flex w-fit transition-opacity hover:opacity-80"
                >
                  <Logo className="h-10" />
                </Link>
                <p className="text-display text-xl leading-snug text-foreground/90 sm:text-2xl">
                  {SITE.description}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {SITE.longDescription}
                </p>
              </div>

              <Link
                href="/components"
                className="group inline-flex h-11 w-fit items-center gap-2 self-start rounded-full bg-primary ps-6 pe-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:self-auto"
              >
                Browse components
                <span className="flex size-7 items-center justify-center rounded-full bg-background/15 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </span>
              </Link>
            </div>

            {/* Link columns. */}
            <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-3">
              {FOOTER_LINKS.map((group) => (
                <div key={group.label} className="flex flex-col gap-3.5">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/70">
                    {group.label}
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        {link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Oversized serif wordmark, clipped by the panel as a backdrop for
              the legal bar. */}
          <div className="relative">
            <span
              aria-hidden
              className="wordmark-cutout pointer-events-none absolute inset-x-0 -bottom-4 text-center text-[18vw] leading-none sm:-bottom-8 lg:text-[12rem]"
            >
              Hirael
            </span>
            <div className="relative flex flex-col items-start justify-between gap-3 border-t border-border/70 px-6 py-6 sm:flex-row sm:items-center sm:px-10 lg:px-14">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                © {year} {SITE.author} · built on shadcn
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                zero runtime deps
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

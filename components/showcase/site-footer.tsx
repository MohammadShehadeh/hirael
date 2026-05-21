import Link from "next/link"
import { Github } from "lucide-react"

import { cn } from "@/lib/utils"
import { SITE } from "@/lib/site"
import { BrandLockup } from "@/components/showcase/logo"

const FOOTER_LINKS: {
  label: string
  links: { href: string; label: string; external?: boolean }[]
}[] = [
  {
    label: "Library",
    links: [
      { href: "/components", label: "Components" },
      { href: "/blocks", label: "Blocks" },
      { href: "/theme", label: "Theme playground" },
    ],
  },
  {
    label: "Resources",
    links: [
      {
        href: "https://ui.shadcn.com",
        label: "shadcn/ui",
        external: true,
      },
      {
        href: `${SITE.githubUrl}#readme`,
        label: "README",
        external: true,
      },
      {
        href: `${SITE.githubUrl}/issues`,
        label: "Issues",
        external: true,
      },
    ],
  },
  {
    label: "Author",
    links: [
      { href: SITE.authorUrl, label: "Portfolio", external: true },
      { href: SITE.githubUrl, label: "GitHub", external: true },
      { href: SITE.twitterUrl, label: "Twitter / X", external: true },
    ],
  },
]

export function SiteFooter({ className }: { className?: string }) {
  const year = new Date().getFullYear()

  return (
    <footer
      className={cn(
        "mt-auto border-t border-border bg-background",
        className
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-3">
            <Link
              href="/"
              aria-label={`${SITE.name} — home`}
              className="inline-flex items-center"
            >
              <BrandLockup logoClassName="size-12" textClassName="text-2xl" />
            </Link>
            <p className="max-w-xs text-xs text-muted-foreground">
              {SITE.longDescription}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <a
                href={SITE.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-accent hover:text-foreground"
              >
                <Github className="size-3.5" />
              </a>
            </div>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.label} className="flex flex-col gap-3">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
                {group.label}
              </h3>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
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

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            © {year} {SITE.author} · MIT licensed · built on shadcn
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            v{SITE.version} · zero runtime deps
          </p>
        </div>
      </div>
    </footer>
  )
}

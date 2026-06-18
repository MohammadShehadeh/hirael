import { Logo, StatusPill } from "./primitives";

const COLUMNS = [
  {
    heading: "Product",
    links: ["Compute", "Storage", "Bandwidth", "Pricing"],
  },
  {
    heading: "Developers",
    links: ["Docs", "SDKs", "CLI", "Status"],
  },
  {
    heading: "Protocol",
    links: ["Token", "Operators", "Governance", "Audits"],
  },
  {
    heading: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
];

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M19.27 5.33A16.3 16.3 0 0 0 15.2 4l-.24.46c1.4.34 2.65.92 3.8 1.72a13.2 13.2 0 0 0-9.52 0c1.15-.8 2.4-1.38 3.8-1.72L12.8 4a16.3 16.3 0 0 0-4.07 1.33C4.34 8.21 3.5 11.93 3.7 15.6a16.4 16.4 0 0 0 4.99 2.52l.65-.92c-.71-.27-1.4-.6-2.04-1.02l.5-.37a11.7 11.7 0 0 0 9.92 0l.5.37c-.64.42-1.33.75-2.04 1.02l.65.92a16.4 16.4 0 0 0 4.98-2.52c.25-4.26-.88-7.95-2.23-10.27ZM9.43 13.78c-.79 0-1.43-.73-1.43-1.62 0-.9.63-1.63 1.43-1.63.8 0 1.45.74 1.43 1.63 0 .89-.64 1.62-1.43 1.62Zm5.14 0c-.79 0-1.43-.73-1.43-1.62 0-.9.63-1.63 1.43-1.63.8 0 1.45.74 1.43 1.63 0 .89-.63 1.62-1.43 1.62Z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "GitHub", href: "#", icon: GithubIcon },
  { label: "Discord", href: "#", icon: DiscordIcon },
];

export function Footer() {
  return (
    <footer
      data-slot="footer"
      className="border-t border-border px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Logo className="size-6" />
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Infrazen
              </span>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              A permissionless protocol for compute, storage, and bandwidth.
            </p>
            <StatusPill className="w-fit" />
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="zen-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {column.heading}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="zen-mono text-xs text-muted-foreground">
            © 2026 Infrazen Labs · Built on open infrastructure
          </p>
          <div className="flex items-center gap-2">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-[var(--zen-line)] hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

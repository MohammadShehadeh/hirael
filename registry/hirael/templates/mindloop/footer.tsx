const FOOTER_LINKS = ["Privacy", "Terms", "Contact"]

export function Footer() {
  return (
    <footer className="border-t border-border/30 px-8 py-12 md:px-28">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; 2026 Mindloop. All rights reserved.
        </p>
        <nav className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

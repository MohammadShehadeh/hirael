import { NAV_LINKS } from './navbar';
import { Wordmark } from './primitives';

export const Footer = () => {
  return (
    <footer data-slot="footer" className="border-t border-border bg-[var(--akor-ink)] px-8 py-10 lg:px-16">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <Wordmark />
        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="mt-10 text-xs text-muted-foreground/60">&copy; 2026 AKOR. All rights reserved.</p>
    </footer>
  );
};

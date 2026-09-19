const FOOTER_LINKS = ['Privacy', 'Terms', 'Contact'] as const;

export const Footer = () => {
  return (
    <footer
      data-slot="footer"
      className="mt-32 flex flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-8 text-xs text-foreground/40 sm:flex-row"
    >
      <p>&copy; 2026 Prism. All rights reserved.</p>
      <nav className="flex items-center gap-6">
        {FOOTER_LINKS.map((link) => (
          <a key={link} href="#" className="transition-colors hover:text-foreground">
            {link}
          </a>
        ))}
      </nav>
    </footer>
  );
};

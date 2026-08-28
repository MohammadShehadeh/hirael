'use client';

const COLUMNS = [
  {
    title: 'Product',
    links: ['Features', 'Pipeline', 'Pricing', 'Changelog', 'Status'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API reference', 'CLI', 'Community'],
  },
  {
    title: 'Company',
    links: ['About', 'Terms', 'Privacy'],
  },
];

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

const Footer05 = () => {
  return (
    <div className="bg-background p-2">
      <footer data-slot="footer" className="rounded-md border border-border bg-muted/10">
        <div className="mx-auto max-w-6xl px-6 pb-2 pt-12 md:pb-12">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            <div data-slot="footer-brand" className="flex flex-col gap-4 lg:col-span-2">
              <a href="#" className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-sm border border-border bg-background text-foreground">
                  <BrandMark className="size-5" />
                </span>
                <span className="text-base font-semibold tracking-tight">Hirael Flow</span>
              </a>
              <p className="max-w-xs text-balance text-sm text-muted-foreground">
                The pipeline editor for teams who want to see their CI, not scroll it.
              </p>
            </div>

            {COLUMNS.map((col) => (
              <div key={col.title} data-slot="footer-column" className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
                <ul className="flex flex-col gap-2 text-sm">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            data-slot="footer-legal"
            className="flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row"
          >
            <p>© 2026 Hirael Flow. All rights reserved.</p>
            <p>Built for teams who read graphs faster than logs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer05;

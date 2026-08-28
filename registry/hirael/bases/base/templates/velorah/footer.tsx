import { Button } from '@/registry/hirael/bases/base/ui/button';

import { Wordmark } from './primitives';

const FOOTER_LINKS = ['product', 'app', 'company', 'community', 'press', 'preorder'];

export const Footer = () => {
  return (
    <footer className="mx-auto max-w-7xl border-t border-border bg-[hsl(0,0%,0%)] px-6 py-16 md:px-12">
      <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-3">
        <h2 className="text-2xl leading-tight text-foreground [font-family:var(--font-velorah-serif)] sm:text-3xl">
          Where home
          <br />
          meets the road.
        </h2>

        <nav className="flex flex-col items-start gap-3">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm capitalize text-muted-foreground transition-colors hover:text-foreground"
            >
              {link}
            </a>
          ))}
        </nav>

        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            Subscribe for the latest
            <br />
            Velorah updates.
          </p>
          <Button
            type="button"
            variant="ghost"
            className="liquid-glass h-auto rounded-full px-6 py-2.5 font-normal text-foreground transition-transform hover:scale-[1.03]"
          >
            Subscribe
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
        <Wordmark className="text-xl" />
        <div className="flex items-center gap-6">
          <a href="#" className="transition-colors hover:text-foreground">
            Privacy Policy
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Terms &amp; Conditions
          </a>
        </div>
      </div>
    </footer>
  );
};

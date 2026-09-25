import * as React from 'react';
import { Mail } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/registry/hirael/bases/radix/components/copy-button';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number): React.CSSProperties => ({ animationDelay: `${index * 70}ms` });

const EMAIL = 'hello@mohammadshehadeh.com';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
};

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z"
      />
    </svg>
  );
};

const socials = [
  { label: 'GitHub', href: 'https://github.com/mohammadshehadeh', icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/mohammadshhadeh', icon: LinkedinIcon },
];

const Cta04 = () => {
  return (
    <section data-slot="cta" className="relative z-0 overflow-hidden bg-background">
      <div
        data-slot="cta-body"
        className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-6 py-20 text-center md:px-10 md:py-28"
      >
        <span
          data-slot="cta-eyebrow"
          className={cn(
            ENTER,
            'inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground uppercase',
          )}
        >
          Booking projects for Q4
        </span>

        <h2
          data-slot="cta-title"
          style={stagger(1)}
          className={cn(
            ENTER,
            'mt-6 font-serif text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl md:text-6xl',
          )}
        >
          Let&apos;s work <span className="text-foreground italic">together</span>.
        </h2>

        <p
          data-slot="cta-description"
          style={stagger(2)}
          className={cn(ENTER, 'mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base')}
        >
          I build fast, accessible, and considered interfaces for the web. Whether you have a project in mind or just
          want to compare notes, I would like to hear from you.
        </p>

        <div data-slot="cta-actions" style={stagger(3)} className={cn(ENTER, 'mt-7 flex flex-col items-center gap-2')}>
          <Button asChild size="lg">
            <a href={`mailto:${EMAIL}`}>
              <Mail className="size-4" />
              Get in touch
            </a>
          </Button>

          <p
            data-slot="cta-direct"
            className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground"
          >
            <span>or copy my address</span>
            <CopyButton value={EMAIL}>{EMAIL}</CopyButton>
          </p>
        </div>

        <div
          data-slot="cta-socials"
          style={stagger(4)}
          className={cn(ENTER, 'mt-3 flex items-center justify-center gap-3')}
        >
          {socials.map((social) => (
            <Button key={social.label} asChild variant="outline" size="icon" className="size-11">
              <a href={social.href} aria-label={social.label}>
                <social.icon className="size-5" />
              </a>
            </Button>
          ))}
        </div>
      </div>

      <div
        data-slot="cta-glow"
        aria-hidden
        className="relative -z-10 -mt-24 h-64 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] md:-mt-32"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,color-mix(in_oklch,var(--primary)_35%,transparent),transparent_70%)] opacity-50 blur-3xl" />
        <div className="absolute inset-s-1/2 top-1/2 aspect-[1/0.7] w-[200%] -translate-x-1/2 rounded-[100%] border-t border-border bg-background rtl:translate-x-1/2" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-[radial-gradient(1px_1px_at_20%_30%,color-mix(in_oklch,var(--foreground)_40%,transparent),transparent),radial-gradient(1px_1px_at_70%_20%,color-mix(in_oklch,var(--foreground)_30%,transparent),transparent),radial-gradient(1px_1px_at_40%_60%,color-mix(in_oklch,var(--foreground)_35%,transparent),transparent),radial-gradient(1px_1px_at_85%_50%,color-mix(in_oklch,var(--foreground)_25%,transparent),transparent),radial-gradient(1px_1px_at_55%_40%,color-mix(in_oklch,var(--foreground)_30%,transparent),transparent)] [mask-image:radial-gradient(50%_50%,white,transparent_85%)]" />
      </div>
    </section>
  );
};

export default Cta04;

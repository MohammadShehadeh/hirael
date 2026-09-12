'use client';

import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { Separator } from '@/registry/hirael/bases/base/ui/separator';
import { FooterBeams } from './footer-04-beams';

const BRAND = {
  name: 'Hirael',
  blurb: "Components, blocks and full pages that shadcn/ui doesn't ship. Install the source, keep the source.",
  copyright: `© ${new Date().getFullYear()} Hirael. All rights reserved.`,
};

const CONTACT = {
  phone: '+971 50 000 0000',
  email: 'hello@hirael.com',
  location: 'Dubai, UAE',
};

const PLACEHOLDERS = ['you@company.com', 'Get release notes by email', 'One email per release, no noise'];

const EASE = 'easeOut' as const;

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

/** Digits only, ready for a wa.me link. */
const digits = (phone: string) => phone.replace(/\D/g, '');

const BrandMark = ({ className }: { className?: string }) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn('size-6 text-primary', className)}>
      <path d="M2.3 12h2.4v10.95h6.2V14.6h4.6v8.35h6.2V12h-2.4V1.05h-6.2V9.4H8.5V1.05H2.3Z" />
    </svg>
  );
};

interface RevealProps extends React.ComponentProps<'div'> {
  /** Milliseconds to wait before the reveal starts. */
  delay?: number;
}

const Reveal = ({ delay = 0, className, style, ...props }: RevealProps) => {
  return (
    <div
      className={cn(
        'animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out fill-mode-both motion-reduce:animate-none',
        className,
      )}
      style={{ animationDelay: `${delay}ms`, ...style }}
      {...props}
    />
  );
};

interface FooterColumnProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  title: string;
  children?: React.ReactNode;
  /** Milliseconds to wait before the column reveals. */
  delay?: number;
}

const FooterColumn = ({ title, delay = 0, className, children, ...props }: FooterColumnProps) => {
  return (
    <Reveal data-slot="footer-column" delay={delay} className={cn('flex flex-col gap-4', className)} {...props}>
      <h4 data-slot="footer-column-title" className="text-xs uppercase text-muted-foreground">
        {title}
      </h4>
      {children}
    </Reveal>
  );
};

interface FooterLinksProps extends React.ComponentProps<'ul'> {
  links: readonly { label: string; href: string; external?: boolean }[];
  /** Milliseconds to wait before the first link reveals. */
  delay?: number;
}

const FooterLinks = ({ links, delay = 0, className, ...props }: FooterLinksProps) => {
  return (
    <ul data-slot="footer-links" className={cn('flex flex-col gap-2', className)} {...props}>
      {links.map((link, i) => (
        <li
          key={link.label}
          className="animate-in fade-in slide-in-from-bottom-3 duration-350 ease-out fill-mode-both motion-reduce:animate-none"
          style={{ animationDelay: `${delay + i * 120}ms` }}
        >
          <a
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noreferrer' : undefined}
            className={cn('text-sm text-muted-foreground transition-colors hover:text-foreground', focusRing)}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
};

export interface FooterSubscribeProps extends Omit<React.ComponentProps<'form'>, 'onSubmit'> {
  /** Placeholders to cycle through, one every `interval` ms. */
  placeholders?: readonly string[];
  interval?: number;
  /** Called with the email on submit. Preview never submits anywhere. */
  onSubscribe?: (email: string) => void;
}

const FooterSubscribe = ({
  placeholders = PLACEHOLDERS,
  interval = 3000,
  onSubscribe,
  className,
  ...props
}: FooterSubscribeProps) => {
  const reduce = useReducedMotion();
  const id = React.useId();
  const [email, setEmail] = React.useState('');
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (placeholders.length < 2) return;
    let timer: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      timer = setInterval(() => {
        setIndex((i) => (i + 1) % placeholders.length);
      }, interval);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        stop();
        start();
      } else {
        stop();
      }
    };

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [placeholders, interval]);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!email.trim()) return;
      onSubscribe?.(email.trim());
      setEmail('');
    },
    [email, onSubscribe],
  );

  return (
    <form
      data-slot="footer-subscribe"
      noValidate
      onSubmit={handleSubmit}
      className={cn('flex w-full gap-2', className)}
      {...props}
    >
      <div className="relative flex-1">
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <Input
          id={id}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder=""
          className="h-10 rounded-full bg-background/60 px-4"
        />
        {email === '' ? (
          <div
            aria-hidden
            data-slot="footer-subscribe-placeholder"
            className="pointer-events-none absolute inset-y-0 start-4 flex items-center overflow-hidden text-sm text-muted-foreground"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={placeholders[index]}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="block truncate"
              >
                {placeholders[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        ) : null}
      </div>
      <Button type="submit" size="icon" aria-label="Subscribe" className="size-10 shrink-0 rounded-full">
        <ArrowRight className="rtl:rotate-180" />
      </Button>
    </form>
  );
};

const Footer04 = () => {
  return (
    <footer data-slot="footer" className="relative w-full text-foreground">
      <FooterBeams>
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            <Reveal data-slot="footer-brand" className="col-span-2 flex flex-col gap-4 lg:col-span-1">
              <a
                href="#"
                className={cn(
                  'inline-flex w-fit items-center gap-2 text-base font-semibold tracking-tight text-foreground',
                  focusRing,
                )}
              >
                <BrandMark />
                {BRAND.name}
              </a>
              <p className="max-w-xs text-sm text-muted-foreground">{BRAND.blurb}</p>
            </Reveal>

            <FooterColumn title="Contact" delay={100}>
              <FooterLinks
                delay={300}
                links={[
                  {
                    label: CONTACT.phone,
                    href: `https://wa.me/${digits(CONTACT.phone)}`,
                    external: true,
                  },
                  { label: CONTACT.email, href: `mailto:${CONTACT.email}` },
                ]}
              />
            </FooterColumn>

            <FooterColumn title="Location" delay={200}>
              <p className="text-sm text-muted-foreground">{CONTACT.location}</p>
            </FooterColumn>

            <FooterColumn title="Subscribe for updates" delay={300} className="col-span-2 lg:col-span-1">
              <FooterSubscribe />
              <p className="text-xs uppercase text-muted-foreground">Preview only, nothing is submitted.</p>
            </FooterColumn>
          </div>

          <Separator className="my-8 bg-border" />

          <Reveal
            data-slot="footer-bottom"
            delay={100}
            className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-start"
          >
            <p className="text-sm text-muted-foreground">{BRAND.copyright}</p>
            <a
              href="https://github.com/MohammadShehadeh/hirael"
              target="_blank"
              rel="noreferrer"
              className={cn('text-sm text-muted-foreground transition-colors hover:text-foreground', focusRing)}
            >
              GitHub
            </a>
          </Reveal>
        </div>
      </FooterBeams>
    </footer>
  );
};

export { FooterBeams, FooterColumn, FooterLinks, FooterSubscribe };

export default Footer04;

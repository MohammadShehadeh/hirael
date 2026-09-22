'use client';

import * as React from 'react';
import { Check, Copy, Mail, Phone } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';

/** Entrance: fade and rise on the house curve, skipped under reduced motion. */
const RISE =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in zoom-in-95 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const CONTACT = {
  email: 'hello@hirael.com',
  phone: '+971 50 000 0000',
};

const HEADLINE = 'Tell us what you are building';

/** Digits only, ready for a wa.me link. */
const digits = (phone: string) => phone.replace(/\D/g, '');

const GLOW =
  'radial-gradient(100% 100% at 50% 0%, transparent 0%, transparent 55%, color-mix(in oklch, var(--primary) 18%, transparent) 82%, color-mix(in oklch, var(--primary) 40%, transparent) 100%)';

/**
 * Rounded panel whose bottom glow widens as the section scrolls through the
 * viewport. The glow is its own layer and only its transform changes, once
 * per frame at most; under reduced motion it stays still.
 */
const ContactPanel = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const glowRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const panel = ref.current;
    const glow = glowRef.current;
    if (!panel || !glow) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const paint = () => {
      frame = 0;
      if (reduce.matches) {
        glow.style.transform = 'scale(1.3, 1.4)';
        return;
      }
      const rect = panel.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)));
      glow.style.transform = `scale(${1 + progress * 0.6}, ${1 + progress * 0.8})`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduce.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduce.removeEventListener('change', schedule);
    };
  }, []);

  return (
    <div ref={ref} data-slot="contact-panel-outer">
      <div
        data-slot="contact-panel"
        className={cn(
          'relative isolate overflow-hidden rounded-3xl border border-border bg-card pt-16 pb-24 md:pt-20 md:pb-32',
          RISE,
          className,
        )}
        {...props}
      >
        <div
          ref={glowRef}
          aria-hidden
          data-slot="contact-panel-glow"
          style={{ backgroundImage: GLOW }}
          className="pointer-events-none absolute inset-0 -z-10 origin-top will-change-transform"
        />
        {children}
      </div>
    </div>
  );
};

const ContactBadge = ({ className, ...props }: React.ComponentProps<typeof Badge>) => {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none">
      <Badge data-slot="contact-badge" variant="outline" className={className} {...props} />
    </div>
  );
};

interface ContactTitleProps extends Omit<React.ComponentProps<'h2'>, 'children'> {
  children: string;
}

const ContactTitle = ({ children, className, ...props }: ContactTitleProps) => {
  const words = children.split(' ');
  const half = Math.floor(words.length / 2);

  return (
    <h2
      data-slot="contact-title"
      className={cn(
        'mx-auto max-w-3xl text-balance font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl',
        className,
      )}
      {...props}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={cn(
            'inline-block',
            i < words.length - 1 && 'me-[0.25em]',
            RISE,
            i < half ? 'text-muted-foreground' : 'text-foreground',
          )}
          style={{ animationDelay: `${60 + i * 40}ms` }}
        >
          {word}
        </span>
      ))}
    </h2>
  );
};

const ContactDescription = ({ className, ...props }: React.ComponentProps<'p'>) => {
  return (
    <p
      data-slot="contact-description"
      className={cn('mx-auto max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg', className)}
      {...props}
    />
  );
};

interface ContactActionProps extends React.ComponentProps<'div'> {
  /** Shown under the button, e.g. the address or number it opens. */
  detail: React.ReactNode;
}

const ContactAction = ({ detail, className, children, ...props }: ContactActionProps) => {
  return (
    <div data-slot="contact-action" className={cn('flex flex-col items-center gap-2', className)} {...props}>
      {children}
      <div className="flex min-h-6 items-center gap-1 text-xs text-muted-foreground">{detail}</div>
    </div>
  );
};

interface ContactCopyProps extends Omit<React.ComponentProps<typeof Button>, 'value' | 'children'> {
  /** Text written to the clipboard. */
  value: string;
  /** Read by screen readers, e.g. "Copy email address". */
  label?: string;
}

const ContactCopy = ({ value, label = 'Copy to clipboard', className, ...props }: ContactCopyProps) => {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      data-slot="contact-copy"
      data-state={copied ? 'copied' : 'idle'}
      aria-label={copied ? 'Copied' : label}
      onClick={copy}
      className={className}
      {...props}
    >
      <span key={copied ? 'copied' : 'idle'} className={cn(SWAP, 'inline-flex items-center gap-1')}>
        {copied ? <Check aria-hidden className="size-3" /> : <Copy aria-hidden className="size-3" />}
        {copied ? 'Copied' : 'Copy'}
      </span>
    </Button>
  );
};

const Contact03 = () => {
  return (
    <section data-slot="contact" className="bg-background py-16 md:py-24">
      <div className="container">
        <ContactPanel>
          <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
            <ContactBadge>Contact</ContactBadge>

            <ContactTitle>{HEADLINE}</ContactTitle>

            <div className={cn('flex flex-col gap-3', RISE)} style={{ animationDelay: '320ms' }}>
              <ContactDescription>
                Send a short note about the product and where you are stuck. We read every message and reply within a
                working day.
              </ContactDescription>
              <ContactDescription className="text-sm sm:text-base">
                Prefer to talk? The number below opens a chat, no call needed.
              </ContactDescription>
            </div>

            <div
              className={cn('mt-4 grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-2', RISE)}
              style={{ animationDelay: '400ms' }}
            >
              <ContactAction
                detail={
                  <>
                    <span>{CONTACT.email}</span>
                    <ContactCopy value={CONTACT.email} label="Copy email address" />
                  </>
                }
              >
                <Button
                  render={<a href={`mailto:${CONTACT.email}`} />}
                  nativeButton={false}
                  size="lg"
                  className="w-full"
                >
                  <Mail />
                  Send an email
                </Button>
              </ContactAction>
              <ContactAction detail={<span dir="ltr">{CONTACT.phone}</span>}>
                <Button
                  render={<a href={`https://wa.me/${digits(CONTACT.phone)}`} target="_blank" rel="noreferrer" />}
                  nativeButton={false}
                  size="lg"
                  variant="outline"
                  className="w-full"
                >
                  <Phone />
                  Call or chat
                </Button>
              </ContactAction>
            </div>
          </div>
        </ContactPanel>
      </div>
    </section>
  );
};

export { ContactPanel, ContactBadge, ContactTitle, ContactDescription, ContactAction, ContactCopy };

export default Contact03;

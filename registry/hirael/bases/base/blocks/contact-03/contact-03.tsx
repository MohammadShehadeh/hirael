'use client';

import * as React from 'react';
import { Mail, Phone } from 'lucide-react';
import {
  type HTMLMotionProps,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const CONTACT = {
  email: 'hello@hirael.com',
  phone: '+971 50 000 0000',
};

const HEADLINE = 'Tell us what you are building';

/** Digits only, ready for a wa.me link. */
const digits = (phone: string) => phone.replace(/\D/g, '');

/**
 * Rounded panel whose bottom glow grows as the section scrolls through the
 * viewport. Wrap the section content in it.
 */
const ContactPanel = ({ className, style, children, ...props }: HTMLMotionProps<'div'>) => {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const width = useTransform(scrollYProgress, [0, 1], [100, 160]);
  const height = useTransform(scrollYProgress, [0, 1], [100, 180]);
  const background = useMotionTemplate`radial-gradient(${width}% ${height}% at 50% 0%, transparent 0%, transparent 55%, color-mix(in oklch, var(--primary) 18%, transparent) 82%, color-mix(in oklch, var(--primary) 40%, transparent) 100%)`;

  return (
    <div ref={ref} data-slot="contact-panel-outer">
      <motion.div
        data-slot="contact-panel"
        style={{
          background: reduce
            ? 'radial-gradient(130% 140% at 50% 0%, transparent 0%, transparent 55%, color-mix(in oklch, var(--primary) 18%, transparent) 82%, color-mix(in oklch, var(--primary) 40%, transparent) 100%)'
            : background,
          ...style,
        }}
        className={cn(
          'relative overflow-hidden rounded-3xl border border-border bg-card pt-16 pb-24 md:pt-20 md:pb-32 animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out fill-mode-both motion-reduce:animate-none',
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
};

const ContactBadge = ({ className, ...props }: React.ComponentProps<typeof Badge>) => {
  return (
    <div className="animate-in fade-in zoom-in-90 duration-500 ease-out fill-mode-both motion-reduce:animate-none delay-200">
      <Badge
        data-slot="contact-badge"
        variant="outline"
        className={cn(
          'rounded-full bg-card/70 px-4 py-1.5 text-xs uppercase text-muted-foreground backdrop-blur-sm',
          className,
        )}
        {...props}
      />
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
            'inline-block animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both motion-reduce:animate-none',
            i < half ? 'text-muted-foreground' : 'text-foreground',
          )}
          style={{ animationDelay: `${200 + i * 80}ms` }}
        >
          {word}
          {i < words.length - 1 ? ' ' : null}
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
  /** Text shown under the button, e.g. the address or number it opens. */
  detail: string;
}

const ContactAction = ({ detail, className, children, ...props }: ContactActionProps) => {
  return (
    <div data-slot="contact-action" className={cn('flex flex-col items-center gap-2', className)} {...props}>
      {children}
      <p className="font-mono text-xs text-muted-foreground">{detail}</p>
    </div>
  );
};

const Contact03 = () => {
  return (
    <section data-slot="contact" className="bg-background py-16 md:py-24">
      <div className="container">
        <ContactPanel>
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
            <ContactBadge>Contact</ContactBadge>

            <ContactTitle>{HEADLINE}</ContactTitle>

            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out fill-mode-both motion-reduce:animate-none delay-400">
              <ContactDescription>
                Send a short note about the product and where you are stuck. We read every message and reply within a
                working day.
              </ContactDescription>
              <ContactDescription className="text-sm sm:text-base">
                Prefer to talk? The number below opens a chat, no call needed.
              </ContactDescription>
            </div>

            <div className="mt-4 grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out fill-mode-both motion-reduce:animate-none delay-600">
              <ContactAction detail={CONTACT.email}>
                <Button
                  render={<a href={`mailto:${CONTACT.email}`} />}
                  nativeButton={false}
                  size="lg"
                  className="w-full rounded-full"
                >
                  <Mail />
                  Send an email
                </Button>
              </ContactAction>
              <ContactAction detail={CONTACT.phone}>
                <Button
                  render={<a href={`https://wa.me/${digits(CONTACT.phone)}`} target="_blank" rel="noreferrer" />}
                  nativeButton={false}
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full"
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

export { ContactPanel, ContactBadge, ContactTitle, ContactDescription, ContactAction };

export default Contact03;

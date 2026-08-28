'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

/**
 * Tracks whether the page has scrolled past a threshold, for the navbar's
 * pill-shrink transition. Reads once on mount so a deep-linked load starts
 * in the correct state.
 */
export const useScrolled = (threshold = 20) => {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
};

/** Gradient-stroked ring brand mark for the navbar wordmark. */
export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden className={cn('shrink-0', className)}>
      <defs>
        <linearGradient id="nexacore-logo" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(28, 78, 255)" />
          <stop offset="0.5" stopColor="rgb(172, 36, 255)" />
          <stop offset="1" stopColor="rgb(254, 136, 27)" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="11" stroke="url(#nexacore-logo)" strokeWidth="2.5" />
    </svg>
  );
};

/** Small concentric mark used inside the delivery-pillar chips. */
export const BrandMark = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn('shrink-0', className)} style={style}>
      <defs>
        <linearGradient id="nexacore-mark" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(28, 78, 255)" />
          <stop offset="0.5" stopColor="rgb(172, 36, 255)" />
          <stop offset="1" stopColor="rgb(254, 136, 27)" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="8.5" stroke="url(#nexacore-mark)" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.2" fill="url(#nexacore-mark)" />
    </svg>
  );
};

/** Headline highlight set in the brand sunrise gradient (Gradient B). */
export const GradientText = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <span data-slot="gradient-text" className={cn('nexa-grad-text', className)} style={style}>
      {children}
    </span>
  );
};

/**
 * Gradient-bordered pill. The inner face holds a solid blue that fades to
 * transparent on hover, revealing the gradient border fill underneath.
 */
export const ContactButton = ({
  label = 'Contact',
  href = '#',
  className,
}: {
  label?: string;
  href?: string;
  className?: string;
}) => {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn('nexa-grad-a-bg group relative h-auto rounded-xl p-px font-normal', className)}
    >
      <a href={href} data-slot="contact-button">
        <span className="w-full rounded-[11px] bg-primary px-7 py-3 text-center text-base text-primary-foreground transition-colors duration-300 group-hover:bg-transparent">
          {label}
        </span>
      </a>
    </Button>
  );
};

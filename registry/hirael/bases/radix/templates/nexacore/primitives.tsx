'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

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

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
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

interface BrandMarkProps {
  className?: string;
  style?: React.CSSProperties;
}

export const BrandMark = ({ className, style }: BrandMarkProps) => {
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

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const GradientText = ({ children, className, style }: GradientTextProps) => {
  return (
    <span data-slot="gradient-text" className={cn('nexa-grad-text', className)} style={style}>
      {children}
    </span>
  );
};

interface ContactButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export const ContactButton = ({ label = 'Contact', href = '#', className }: ContactButtonProps) => {
  return (
    <a
      href={href}
      data-slot="contact-button"
      className={cn(
        'nexa-grad-a-bg group relative inline-flex items-center justify-center rounded-xl p-px outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        className,
      )}
    >
      <span className="w-full rounded-[11px] bg-primary px-7 py-3 text-center text-base text-primary-foreground transition-colors duration-300 group-hover:bg-transparent">
        {label}
      </span>
    </a>
  );
};

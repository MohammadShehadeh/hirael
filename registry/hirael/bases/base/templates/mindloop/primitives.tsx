'use client';

import * as React from 'react';
import { useReducedMotion, type MotionProps, type Transition } from 'motion/react';

import { cn } from '@/lib/utils';

const FADE_EASE: Transition['ease'] = 'easeOut';

export const useFadeUp = () => {
  const reduce = useReducedMotion();

  // `fade: false` keeps a headline at full opacity so it counts as painted for Largest Contentful Paint.
  return (delay = 0, { fade = true } = {}): MotionProps => ({
    initial: reduce ? { opacity: 1, y: 0 } : { opacity: fade ? 0 : 1, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: reduce ? { duration: 0 } : { duration: 0.6, delay, ease: FADE_EASE },
  });
};

interface SerifProps {
  children: React.ReactNode;
  className?: string;
}

export const Serif = ({ children, className }: SerifProps) => {
  return (
    <span className={cn('[font-family:var(--font-mindloop-serif)] font-normal italic', className)}>{children}</span>
  );
};

type LogoSize = 'sm' | 'lg';

interface LogoProps {
  size?: LogoSize;
}

export const Logo = ({ size = 'sm' }: LogoProps) => {
  return (
    <span
      aria-hidden
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full border-2 border-foreground/60',
        size === 'lg' ? 'size-10' : 'size-7',
      )}
    >
      <span className={cn('rounded-full border border-foreground/60', size === 'lg' ? 'size-5' : 'size-3')} />
    </span>
  );
};

interface IconProps {
  className?: string;
}

export const InstagramIcon = ({ className }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
};

export const LinkedinIcon = ({ className }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.25 8.5h3.4V21h-3.4V8.5Zm5.6 0h3.26v1.71h.05c.45-.86 1.56-1.77 3.21-1.77 3.43 0 4.07 2.26 4.07 5.2V21h-3.4v-5.45c0-1.3-.02-2.97-1.81-2.97-1.81 0-2.09 1.42-2.09 2.88V21h-3.39V8.5Z" />
    </svg>
  );
};

export const TwitterIcon = ({ className }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 5.92c-.74.33-1.53.55-2.36.65a4.12 4.12 0 0 0 1.8-2.27c-.79.47-1.67.81-2.6 1a4.1 4.1 0 0 0-7 3.74 11.65 11.65 0 0 1-8.46-4.29 4.1 4.1 0 0 0 1.27 5.48c-.65-.02-1.27-.2-1.81-.5v.05a4.1 4.1 0 0 0 3.29 4.02c-.6.16-1.23.18-1.84.07a4.11 4.11 0 0 0 3.83 2.85A8.23 8.23 0 0 1 2 18.4a11.62 11.62 0 0 0 6.29 1.84c7.55 0 11.68-6.25 11.68-11.67l-.01-.53A8.3 8.3 0 0 0 22 5.92Z" />
    </svg>
  );
};

export const ChatGptIcon = ({ className }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.1} className={className} aria-hidden>
      <ellipse cx="12" cy="12" rx="4.4" ry="9.4" />
      <ellipse cx="12" cy="12" rx="4.4" ry="9.4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="4.4" ry="9.4" transform="rotate(120 12 12)" />
    </svg>
  );
};

export const PerplexityIcon = ({ className }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="5" y="5" width="14" height="14" rx="2.5" />
      <rect x="5" y="5" width="14" height="14" rx="2.5" transform="rotate(45 12 12)" />
      <path d="M12 3.5v17" />
    </svg>
  );
};

export const GoogleAiIcon = ({ className }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c.4 5.3 2.7 7.6 8 8-5.3.4-7.6 2.7-8 8-.4-5.3-2.7-7.6-8-8 5.3-.4 7.6-2.7 8-8Z" />
    </svg>
  );
};

const AVATAR_TONES = [
  { from: '#dcdcdc', to: '#8f8f8f' },
  { from: '#bfbfbf', to: '#6f6f6f' },
  { from: '#a6a6a6', to: '#545454' },
];

interface AvatarProps {
  tone?: number;
  className?: string;
}

export const Avatar = ({ tone = 0, className }: AvatarProps) => {
  const t = AVATAR_TONES[tone % AVATAR_TONES.length];
  const id = `mindloop-avatar-${tone}`;

  return (
    <span className={cn('inline-flex size-8 overflow-hidden rounded-full border-2 border-background', className)}>
      <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.from} />
            <stop offset="100%" stopColor={t.to} />
          </linearGradient>
        </defs>
        <rect width="32" height="32" fill={`url(#${id})`} />
        <circle cx="16" cy="13" r="5" fill="#0a0a0a" opacity="0.28" />
        <path d="M6 30c0-5.5 4.5-9 10-9s10 3.5 10 9Z" fill="#0a0a0a" opacity="0.28" />
      </svg>
    </span>
  );
};

interface AvatarRowProps {
  className?: string;
}

export const AvatarRow = ({ className }: AvatarRowProps) => {
  return (
    <div className={cn('flex -space-x-2', className)}>
      <Avatar tone={0} />
      <Avatar tone={1} />
      <Avatar tone={2} />
    </div>
  );
};

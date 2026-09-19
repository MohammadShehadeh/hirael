'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

interface WordmarkProps {
  className?: string;
}

export const Wordmark = ({ className }: WordmarkProps) => {
  return <span className={cn('text-lg font-medium tracking-tight text-foreground', className)}>Prism</span>;
};

interface GlassPillProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassPill = ({ children, className }: GlassPillProps) => {
  return (
    <span
      className={cn(
        'liquid-glass inline-block rounded-full px-3.5 py-1 text-xs font-medium text-foreground',
        className,
      )}
    >
      {children}
    </span>
  );
};

type GlassButtonProps = React.ComponentProps<typeof Button>;

export const GlassButton = ({ className, ...props }: GlassButtonProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        'liquid-glass-strong h-auto rounded-full px-5 py-2.5 text-sm font-medium text-foreground hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
};

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export const Heading = ({ children, className }: HeadingProps) => {
  return (
    <h2
      className={cn(
        'text-4xl italic leading-[0.9] tracking-tight text-foreground [font-family:var(--font-prism-serif)] md:text-5xl lg:text-6xl',
        className,
      )}
    >
      {children}
    </h2>
  );
};

interface SectionIntroProps {
  kicker: string;
  title: string;
}

export const SectionIntro = ({ kicker, title }: SectionIntroProps) => {
  return (
    <div className="rise flex flex-col items-center text-center">
      <GlassPill className="mb-4">{kicker}</GlassPill>
      <Heading>{title}</Heading>
    </div>
  );
};

const WORD_DELAY_MS = 100;

interface BlurTextProps {
  text: string;
}

export const BlurText = ({ text }: BlurTextProps) => {
  return (
    <span dir="auto" className="inline-flex flex-wrap justify-center gap-x-[0.25em]">
      {text.split(' ').map((word, index) => (
        <span key={`${word}-${index}`} className="blur-in" style={{ animationDelay: `${index * WORD_DELAY_MS}ms` }}>
          {word}
        </span>
      ))}
    </span>
  );
};

interface VideoBackdropProps {
  src: string;
  posterSrc?: string;
  fadeTop?: boolean;
  fadeBottom?: boolean;
  className?: string;
}

export const VideoBackdrop = ({
  src,
  posterSrc,
  fadeTop = false,
  fadeBottom = true,
  className,
}: VideoBackdropProps) => {
  const [hasFailed, setHasFailed] = React.useState(false);

  return (
    <>
      {hasFailed ? (
        <div
          aria-hidden
          className="absolute inset-0 z-0 bg-gradient-to-b from-muted via-background to-background bg-cover bg-center"
          style={posterSrc ? { backgroundImage: `url(${posterSrc})` } : undefined}
        />
      ) : (
        <video
          className={cn('absolute inset-0 z-0 h-full w-full object-cover', className)}
          src={src}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
          tabIndex={-1}
          onError={() => setHasFailed(true)}
        />
      )}
      {fadeTop ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[200px] bg-gradient-to-b from-background to-transparent"
        />
      ) : null}
      {fadeBottom ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[200px] bg-gradient-to-t from-background to-transparent"
        />
      ) : null}
    </>
  );
};

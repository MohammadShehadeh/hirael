import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/lib/utils';

const avatarStackVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: "[&>[data-slot='avatar-stack-item']]:size-6 [&>[data-slot='avatar-stack-item']]:text-[10px]",
      md: "[&>[data-slot='avatar-stack-item']]:size-8 [&>[data-slot='avatar-stack-item']]:text-xs",
      lg: "[&>[data-slot='avatar-stack-item']]:size-10 [&>[data-slot='avatar-stack-item']]:text-sm",
    },
    spacing: {
      tight: "[&>[data-slot='avatar-stack-item']:not(:first-child)]:-ms-3",
      normal: "[&>[data-slot='avatar-stack-item']:not(:first-child)]:-ms-2",
      loose: "[&>[data-slot='avatar-stack-item']:not(:first-child)]:-ms-1",
    },
  },
  defaultVariants: {
    size: 'md',
    spacing: 'normal',
  },
});

type AvatarStackProps = React.ComponentProps<'div'> & VariantProps<typeof avatarStackVariants>;

const AvatarStack = ({ className, size = 'md', spacing = 'normal', ...props }: AvatarStackProps) => {
  return (
    <div
      data-slot="avatar-stack"
      data-size={size}
      className={cn(avatarStackVariants({ size, spacing }), className)}
      {...props}
    />
  );
};

interface AvatarStackItemProps extends Omit<useRender.ComponentProps<'span'>, 'children'> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  /** Replace the span with another element (e.g. `render={<a href="/u/1" />}`) to make the item interactive. */
  children?: React.ReactNode;
}

const AvatarStackItem = ({ className, src, alt, fallback, render, children, ...props }: AvatarStackItemProps) => {
  const content = src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt ?? ''} loading="lazy" className="absolute inset-0 size-full object-cover" />
  ) : (
    (fallback ?? children)
  );

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(
      {
        className: cn(
          'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-mono font-medium text-foreground ring-2 ring-background',
          render &&
            'transition-transform duration-150 ease-out hover:z-10 hover:scale-105 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-ring',
          className,
        ),
        children: content,
      },
      props,
    ),
    state: { slot: 'avatar-stack-item' },
  });
};

interface AvatarStackOverflowProps extends Omit<useRender.ComponentProps<'span'>, 'children'> {
  count: number;
  prefix?: string;
  /** Replace the span with another element (e.g. `render={<button type="button" />}`) to make the count interactive. */
  children?: React.ReactNode;
}

const AvatarStackOverflow = ({
  className,
  count,
  prefix = '+',
  render,
  children,
  ...props
}: AvatarStackOverflowProps) => {
  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(
      {
        className: cn(
          'relative inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono font-medium tabular-nums text-muted-foreground ring-2 ring-background',
          render &&
            'transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className,
        ),
        children: children ?? (
          <>
            {prefix}
            {count}
          </>
        ),
      },
      props,
    ),
    state: { slot: 'avatar-stack-item', overflow: true },
  });
};

export { AvatarStack, AvatarStackItem, AvatarStackOverflow };

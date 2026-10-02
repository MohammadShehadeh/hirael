import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarGroupCount, AvatarImage } from '@/registry/hirael/bases/base/ui/avatar';

const avatarStackVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: '**:data-[slot=avatar-fallback]:text-[10px] *:data-[slot=avatar-stack-item]:size-6 *:data-[slot=avatar-stack-overflow]:size-6 *:data-[slot=avatar-stack-overflow]:text-[10px]',
      md: '**:data-[slot=avatar-fallback]:text-xs *:data-[slot=avatar-stack-item]:size-8 *:data-[slot=avatar-stack-overflow]:size-8 *:data-[slot=avatar-stack-overflow]:text-xs',
      lg: '**:data-[slot=avatar-fallback]:text-sm *:data-[slot=avatar-stack-item]:size-10 *:data-[slot=avatar-stack-overflow]:size-10 *:data-[slot=avatar-stack-overflow]:text-sm',
    },
    spacing: {
      tight: '*:data-[slot=avatar-stack-item]:not-first:-ms-3 *:data-[slot=avatar-stack-overflow]:not-first:-ms-3',
      normal: '*:data-[slot=avatar-stack-item]:not-first:-ms-2 *:data-[slot=avatar-stack-overflow]:not-first:-ms-2',
      loose: '*:data-[slot=avatar-stack-item]:not-first:-ms-1 *:data-[slot=avatar-stack-overflow]:not-first:-ms-1',
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

interface AvatarStackItemProps extends Omit<React.ComponentProps<typeof Avatar>, 'children' | 'size'> {
  src?: string;
  alt?: string;
  /** Shown while the image loads, if it fails, or when there is no `src`. */
  fallback?: React.ReactNode;
  /** Replace the span with another element (e.g. `render={<a href="/u/1" />}`) to make the item interactive. */
  children?: React.ReactNode;
}

const AvatarStackItem = ({ className, src, alt, fallback, render, children, ...props }: AvatarStackItemProps) => {
  return (
    <Avatar
      render={render}
      data-slot="avatar-stack-item"
      className={cn(
        'ring-2 ring-background',
        render &&
          'transition-transform duration-150 ease-out hover:z-10 hover:scale-105 focus-visible:z-10 focus-visible:ring-ring focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {src && <AvatarImage src={src} alt={alt ?? ''} loading="lazy" />}
      <AvatarFallback>{fallback ?? children}</AvatarFallback>
    </Avatar>
  );
};

interface AvatarStackOverflowProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  count: number;
  prefix?: string;
  /** Render the count as another element (e.g. `render={<button type="button" />}`) inside the count circle. */
  render?: useRender.RenderProp;
  children?: React.ReactNode;
}

interface AvatarStackOverflowCountProps {
  render: useRender.RenderProp;
  children: React.ReactNode;
}

const AvatarStackOverflowCount = ({ render, children }: AvatarStackOverflowCountProps) =>
  useRender({
    defaultTagName: 'span',
    render,
    props: {
      className:
        'flex size-full items-center justify-center rounded-full transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
      children,
    },
  });

const AvatarStackOverflow = ({
  className,
  count,
  prefix = '+',
  render,
  children,
  ...props
}: AvatarStackOverflowProps) => {
  const content = children ?? (
    <>
      {prefix}
      {count}
    </>
  );

  return (
    <AvatarGroupCount
      data-slot="avatar-stack-overflow"
      data-overflow=""
      className={cn('tabular-nums', className)}
      {...props}
    >
      {render ? <AvatarStackOverflowCount render={render}>{content}</AvatarStackOverflowCount> : content}
    </AvatarGroupCount>
  );
};

export { AvatarStack, AvatarStackItem, AvatarStackOverflow };

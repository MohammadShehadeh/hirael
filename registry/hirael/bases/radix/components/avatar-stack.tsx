import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

const avatarStackVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: '*:data-[slot=avatar-stack-item]:size-6 *:data-[slot=avatar-stack-item]:text-[10px] *:data-[slot=avatar-stack-overflow]:size-6 *:data-[slot=avatar-stack-overflow]:text-[10px]',
      md: '*:data-[slot=avatar-stack-item]:size-8 *:data-[slot=avatar-stack-item]:text-xs *:data-[slot=avatar-stack-overflow]:size-8 *:data-[slot=avatar-stack-overflow]:text-xs',
      lg: '*:data-[slot=avatar-stack-item]:size-10 *:data-[slot=avatar-stack-item]:text-sm *:data-[slot=avatar-stack-overflow]:size-10 *:data-[slot=avatar-stack-overflow]:text-sm',
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

const withSlotContent = (child: React.ReactNode, renderInner: (inner: React.ReactNode) => React.ReactNode) => {
  if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return renderInner(child);

  return React.cloneElement(child, undefined, renderInner(child.props.children));
};

interface AvatarStackItemProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  /** Render as the child element (e.g. an anchor or button); `src` and `fallback` still fill it. */
  asChild?: boolean;
  children?: React.ReactNode;
}

const AvatarStackItem = ({
  className,
  src,
  alt,
  fallback,
  asChild = false,
  children,
  ...props
}: AvatarStackItemProps) => {
  const Comp = asChild ? Slot : 'span';
  const renderContent = (inner: React.ReactNode) =>
    src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? ''} loading="lazy" className="absolute inset-0 size-full object-cover" />
    ) : (
      (fallback ?? inner)
    );

  return (
    <Comp
      data-slot="avatar-stack-item"
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-mono font-medium text-foreground ring-2 ring-background',
        asChild &&
          'transition-transform duration-150 ease-out hover:z-10 hover:scale-105 focus-visible:z-10 focus-visible:ring-ring focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {asChild ? withSlotContent(children, renderContent) : renderContent(children)}
    </Comp>
  );
};

interface AvatarStackOverflowProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  count: number;
  prefix?: string;
  asChild?: boolean;
  children?: React.ReactNode;
}

const AvatarStackOverflow = ({
  className,
  count,
  prefix = '+',
  asChild = false,
  children,
  ...props
}: AvatarStackOverflowProps) => {
  const Comp = asChild ? Slot : 'span';
  const renderCount = (inner: React.ReactNode) =>
    inner ?? (
      <>
        {prefix}
        {count}
      </>
    );

  return (
    <Comp
      data-slot="avatar-stack-overflow"
      data-overflow=""
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono font-medium text-muted-foreground tabular-nums ring-2 ring-background',
        asChild &&
          'transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {asChild ? withSlotContent(children, renderCount) : renderCount(children)}
    </Comp>
  );
};

export { AvatarStack, AvatarStackItem, AvatarStackOverflow };

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarGroupCount, AvatarImage } from '@/registry/hirael/bases/radix/ui/avatar';

const avatarStackVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: '**:data-[slot=avatar-fallback]:text-xs *:data-[slot=avatar-stack-item]:size-6 *:data-[slot=avatar-stack-overflow]:size-6 *:data-[slot=avatar-stack-overflow]:text-xs',
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

const withSlotContent = (child: React.ReactNode, renderInner: (inner: React.ReactNode) => React.ReactNode) => {
  if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return renderInner(child);

  return React.cloneElement(child, undefined, renderInner(child.props.children));
};

interface AvatarStackItemProps extends Omit<React.ComponentProps<typeof Avatar>, 'children' | 'size'> {
  src?: string;
  alt?: string;
  /** Shown while the image loads, if it fails, or when there is no `src`. */
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
  const renderContent = (inner: React.ReactNode) => (
    <>
      {src && <AvatarImage src={src} alt={alt ?? ''} loading="lazy" className="object-cover" />}
      <AvatarFallback>{fallback ?? inner}</AvatarFallback>
    </>
  );

  return (
    <Avatar
      asChild={asChild}
      data-slot="avatar-stack-item"
      className={cn(
        'ring-2 ring-background',
        asChild &&
          'transition-transform duration-150 ease-out hover:z-10 hover:scale-105 focus-visible:z-10 focus-visible:ring-ring focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {asChild ? withSlotContent(children, renderContent) : renderContent(children)}
    </Avatar>
  );
};

interface AvatarStackOverflowProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  count: number;
  prefix?: string;
  /** Render the count as the child element (e.g. a button) inside the count circle. */
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
  const renderCount = (inner: React.ReactNode) =>
    inner ?? (
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
      {asChild ? (
        <Slot className="flex size-full items-center justify-center rounded-full transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
          {withSlotContent(children, renderCount)}
        </Slot>
      ) : (
        renderCount(children)
      )}
    </AvatarGroupCount>
  );
};

export { AvatarStack, AvatarStackItem, AvatarStackOverflow };

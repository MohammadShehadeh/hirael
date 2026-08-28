'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';

import { cn } from '@/lib/utils';

type DrawerDirection = 'top' | 'bottom' | 'left' | 'right';
type DrawerSwipeDirection = NonNullable<DrawerPrimitive.Root.Props['swipeDirection']>;

// `direction` is the edge the drawer sits on; Base UI wants the direction the
// user swipes to dismiss it, which is the same edge.
const SWIPE_DIRECTION: Record<DrawerDirection, DrawerSwipeDirection> = {
  top: 'up',
  bottom: 'down',
  left: 'left',
  right: 'right',
};

type DrawerContextProps = {
  modal: DrawerPrimitive.Root.Props['modal'];
};

const DrawerContext = React.createContext<DrawerContextProps | null>(null);

function useDrawer() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a Drawer.');
  }
  return context;
}

function Drawer({
  direction = 'bottom',
  swipeDirection,
  modal = true,
  ...props
}: DrawerPrimitive.Root.Props & {
  direction?: DrawerDirection;
}) {
  const contextValue = React.useMemo(() => ({ modal }), [modal]);

  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        swipeDirection={swipeDirection ?? SWIPE_DIRECTION[direction]}
        {...props}
      />
    </DrawerContext.Provider>
  );
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({ className, ...props }: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/50 opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*400ms)] data-starting-style:opacity-0 data-swiping:duration-0',
        className,
      )}
      {...props}
    />
  );
}

function DrawerContent({ className, children, ...props }: DrawerPrimitive.Popup.Props) {
  const { modal } = useDrawer();

  return (
    <DrawerPortal data-slot="drawer-portal">
      {modal === true && <DrawerOverlay />}
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        data-modal={modal}
        className="pointer-events-none fixed inset-0 z-50 select-none data-[modal=true]:pointer-events-auto"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-content"
          className={cn(
            'group/drawer-content pointer-events-auto fixed z-50 flex h-auto flex-col bg-background transition-[translate] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none select-none',
            'data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*400ms)] data-swiping:duration-0',
            'data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:mb-24 data-[swipe-direction=up]:max-h-[80vh] data-[swipe-direction=up]:translate-y-[calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px))] data-[swipe-direction=up]:rounded-b-lg data-[swipe-direction=up]:border-b data-[swipe-direction=up]:data-ending-style:-translate-y-full data-[swipe-direction=up]:data-starting-style:-translate-y-full',
            'data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:mt-24 data-[swipe-direction=down]:max-h-[80vh] data-[swipe-direction=down]:translate-y-[calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px))] data-[swipe-direction=down]:rounded-t-lg data-[swipe-direction=down]:border-t data-[swipe-direction=down]:data-ending-style:translate-y-full data-[swipe-direction=down]:data-starting-style:translate-y-full',
            'data-[swipe-direction=right]:inset-y-0 data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:w-3/4 data-[swipe-direction=right]:translate-x-[calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-x,0px))] data-[swipe-direction=right]:border-l data-[swipe-direction=right]:data-ending-style:translate-x-full data-[swipe-direction=right]:data-starting-style:translate-x-full data-[swipe-direction=right]:sm:max-w-sm',
            'data-[swipe-direction=left]:inset-y-0 data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:w-3/4 data-[swipe-direction=left]:translate-x-[calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-x,0px))] data-[swipe-direction=left]:border-r data-[swipe-direction=left]:data-ending-style:-translate-x-full data-[swipe-direction=left]:data-starting-style:-translate-x-full data-[swipe-direction=left]:sm:max-w-sm',
            className,
          )}
          {...props}
        >
          <div
            data-slot="drawer-handle"
            aria-hidden="true"
            className="mx-auto mt-4 hidden h-2 w-[100px] shrink-0 cursor-grab rounded-full bg-muted group-data-[swipe-direction=down]/drawer-content:block active:cursor-grabbing"
          />
          <DrawerPrimitive.Content
            data-slot="drawer-content-inner"
            className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain rounded-[inherit] select-text group-data-swiping/drawer-content:select-none"
          >
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        'flex flex-col gap-0.5 p-4 group-data-[swipe-direction=down]/drawer-content:text-center group-data-[swipe-direction=up]/drawer-content:text-center md:gap-1.5 md:text-start',
        className,
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="drawer-footer" className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />;
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn('font-semibold text-foreground', className)}
      {...props}
    />
  );
}

function DrawerDescription({ className, ...props }: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};

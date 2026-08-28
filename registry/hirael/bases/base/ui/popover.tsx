'use client';

import * as React from 'react';
import { useDirection } from '@base-ui/react/direction-provider';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/lib/utils';

type PopoverAnchorContextValue = {
  anchor: Element | null;
  setAnchor: (element: Element | null) => void;
};

const PopoverAnchorContext = React.createContext<PopoverAnchorContextValue | null>(null);

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  const [anchor, setAnchor] = React.useState<Element | null>(null);
  const context = React.useMemo(() => ({ anchor, setAnchor }), [anchor]);
  return (
    <PopoverAnchorContext.Provider value={context}>
      <PopoverPrimitive.Root data-slot="popover" {...props} />
    </PopoverAnchorContext.Provider>
  );
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = 'center',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  anchor,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<PopoverPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset' | 'anchor'>) {
  const direction = useDirection();
  const anchorContext = React.useContext(PopoverAnchorContext);
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        anchor={anchor ?? anchorContext?.anchor ?? undefined}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          dir={direction === 'rtl' ? 'rtl' : undefined}
          className={cn(
            'z-50 w-72 origin-(--transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

/**
 * Base UI has no Anchor part; the popup is anchored to the trigger unless the
 * Positioner gets an explicit `anchor`. This renders a plain element,
 * registers it on the surrounding `Popover`, and `PopoverContent` positions
 * against it when present, so the Radix `PopoverAnchor` pattern keeps working.
 * Use `render` to anchor to an existing element.
 */
function PopoverAnchor({ render, ref, ...props }: useRender.ComponentProps<'div'>) {
  const anchorContext = React.useContext(PopoverAnchorContext);
  return useRender({
    defaultTagName: 'div',
    ref: [ref ?? null, anchorContext?.setAnchor ?? null],
    props,
    render,
    state: { slot: 'popover-anchor' },
  });
}

function PopoverHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="popover-header" className={cn('flex flex-col gap-1 text-sm', className)} {...props} />;
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return <PopoverPrimitive.Title data-slot="popover-title" className={cn('font-medium', className)} {...props} />;
}

function PopoverDescription({ className, ...props }: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverHeader, PopoverTitle, PopoverDescription };

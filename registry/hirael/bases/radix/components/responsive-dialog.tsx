'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/hirael/bases/radix/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/registry/hirael/bases/radix/ui/drawer';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';
import { useMediaQuery } from '@/registry/hirael/hooks/use-media-query';

const ResponsiveDialogContext = React.createContext<{ desktop: boolean } | null>(null);

const useResponsiveDialog = () => {
  const ctx = React.useContext(ResponsiveDialogContext);
  if (!ctx) {
    throw new Error('ResponsiveDialog compound parts must be used inside <ResponsiveDialog>');
  }

  return ctx;
};

export interface ResponsiveDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Media query that switches from a bottom drawer to a centered dialog. */
  query?: string;
  children?: React.ReactNode;
}

/** A centered Dialog on wide screens and a bottom Drawer on phones, with one set of parts for both. */
const ResponsiveDialog = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  query = '(min-width: 768px)',
  children,
}: ResponsiveDialogProps) => {
  // Open state lives here, not in Dialog or Drawer, so it survives a resize across the breakpoint.
  const [open, setOpen] = useControllableState({ prop: openProp, defaultProp: defaultOpen, onChange: onOpenChange });
  const desktop = useMediaQuery(query, true);
  const ctx = React.useMemo(() => ({ desktop }), [desktop]);
  const Root = desktop ? Dialog : Drawer;

  return (
    <ResponsiveDialogContext.Provider value={ctx}>
      <Root open={open} onOpenChange={setOpen}>
        {children}
      </Root>
    </ResponsiveDialogContext.Provider>
  );
};

const ResponsiveDialogTrigger = (props: React.ComponentProps<typeof DialogTrigger>) => {
  const { desktop } = useResponsiveDialog();

  return desktop ? (
    <DialogTrigger data-slot="responsive-dialog-trigger" {...props} />
  ) : (
    <DrawerTrigger data-slot="responsive-dialog-trigger" {...(props as React.ComponentProps<typeof DrawerTrigger>)} />
  );
};

const ResponsiveDialogClose = (props: React.ComponentProps<typeof DialogClose>) => {
  const { desktop } = useResponsiveDialog();

  return desktop ? (
    <DialogClose data-slot="responsive-dialog-close" {...props} />
  ) : (
    <DrawerClose data-slot="responsive-dialog-close" {...(props as React.ComponentProps<typeof DrawerClose>)} />
  );
};

const ResponsiveDialogContent = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  const { desktop } = useResponsiveDialog();

  return desktop ? (
    <DialogContent data-slot="responsive-dialog-content" className={className} {...props}>
      {children}
    </DialogContent>
  ) : (
    <DrawerContent data-slot="responsive-dialog-content" className={className} {...props}>
      {children}
    </DrawerContent>
  );
};

const ResponsiveDialogHeader = (props: React.ComponentProps<'div'>) => {
  const { desktop } = useResponsiveDialog();
  const Header = desktop ? DialogHeader : DrawerHeader;

  return <Header data-slot="responsive-dialog-header" {...props} />;
};

const ResponsiveDialogTitle = (props: React.ComponentProps<typeof DialogTitle>) => {
  const { desktop } = useResponsiveDialog();
  const Title = desktop ? DialogTitle : DrawerTitle;

  return <Title data-slot="responsive-dialog-title" {...props} />;
};

const ResponsiveDialogDescription = (props: React.ComponentProps<typeof DialogDescription>) => {
  const { desktop } = useResponsiveDialog();
  const Description = desktop ? DialogDescription : DrawerDescription;

  return <Description data-slot="responsive-dialog-description" {...props} />;
};

/** The main content. Gets side padding inside the drawer, which has none of its own. */
const ResponsiveDialogBody = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { desktop } = useResponsiveDialog();

  return <div data-slot="responsive-dialog-body" className={cn(!desktop && 'px-4', className)} {...props} />;
};

const ResponsiveDialogFooter = (props: React.ComponentProps<'div'>) => {
  const { desktop } = useResponsiveDialog();
  const Footer = desktop ? DialogFooter : DrawerFooter;

  return <Footer data-slot="responsive-dialog-footer" {...props} />;
};

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogBody,
  ResponsiveDialogFooter,
  useResponsiveDialog,
};

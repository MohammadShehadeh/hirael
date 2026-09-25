import * as React from 'react';

import { cn } from '@/lib/utils';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/registry/hirael/bases/base/ui/resizable';

const SplitView = ({ className, ...props }: React.ComponentProps<typeof ResizablePanelGroup>) => {
  return (
    <ResizablePanelGroup
      data-slot="split-view"
      className={cn('overflow-hidden rounded-lg border border-border bg-card', className)}
      {...props}
    />
  );
};

const SplitViewPanel = ({ className, ...props }: React.ComponentProps<typeof ResizablePanel>) => {
  return (
    <ResizablePanel
      data-slot="split-view-panel"
      className={cn('min-h-0 min-w-0 overflow-auto', className)}
      {...props}
    />
  );
};

const SplitViewResizer = (props: React.ComponentProps<typeof ResizableHandle>) => {
  return <ResizableHandle data-slot="split-view-resizer" withHandle {...props} />;
};

export { SplitView, SplitViewPanel, SplitViewResizer };

'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/hirael/bases/base/ui/collapsible';

type InspectorPanelProps = React.ComponentProps<'aside'>;

const InspectorPanel = ({ className, ...props }: InspectorPanelProps) => {
  return (
    <aside
      data-slot="inspector-panel"
      className={cn(
        'flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground',
        className,
      )}
      {...props}
    />
  );
};

type InspectorPanelHeaderProps = React.ComponentProps<'div'>;

const InspectorPanelHeader = ({ className, ...props }: InspectorPanelHeaderProps) => {
  return (
    <div
      data-slot="inspector-panel-header"
      className={cn('flex items-center justify-between gap-2 border-b border-border px-3 py-2.5', className)}
      {...props}
    />
  );
};

type InspectorPanelTitleProps = React.ComponentProps<'p'>;

const InspectorPanelTitle = ({ className, ...props }: InspectorPanelTitleProps) => {
  return (
    <p
      data-slot="inspector-panel-title"
      className={cn('font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground', className)}
      {...props}
    />
  );
};

interface InspectorPanelSectionProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: React.ReactNode;
  defaultOpen?: boolean;
}

const InspectorPanelSection = ({
  title,
  defaultOpen = true,
  className,
  children,
  ...props
}: InspectorPanelSectionProps) => {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      data-slot="inspector-panel-section"
      className={cn('border-b border-border last:border-b-0', className)}
      {...props}
    >
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 px-3 py-2 text-start transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
        <span className="text-xs font-medium text-foreground">{title}</span>
        <ChevronDown
          aria-hidden
          className="size-3.5 text-muted-foreground transition-transform duration-200 group-data-open:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2 px-3 pb-3 pt-1">{children}</CollapsibleContent>
    </Collapsible>
  );
};

interface InspectorPanelRowProps extends React.ComponentProps<'div'> {
  label: React.ReactNode;
}

const InspectorPanelRow = ({ label, className, children, ...props }: InspectorPanelRowProps) => {
  return (
    <div
      data-slot="inspector-panel-row"
      className={cn('grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-2', className)}
      {...props}
    >
      <span className="truncate text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center justify-end gap-1.5">{children}</div>
    </div>
  );
};

export { InspectorPanel, InspectorPanelHeader, InspectorPanelTitle, InspectorPanelSection, InspectorPanelRow };

const InspectorField = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <span
      className={cn(
        'inline-flex h-7 w-full items-center rounded-md border border-border bg-background px-2 font-mono text-xs text-foreground',
        className,
      )}
    >
      {children}
    </span>
  );
};

const InspectorPanelBlock = () => {
  return (
    <section data-slot="inspector-panel-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <InspectorPanel>
        <InspectorPanelHeader>
          <InspectorPanelTitle>Inspector</InspectorPanelTitle>
          <span className="text-xs text-muted-foreground">Frame 12</span>
        </InspectorPanelHeader>

        <InspectorPanelSection title="Layout">
          <InspectorPanelRow label="Width">
            <InspectorField>320</InspectorField>
          </InspectorPanelRow>
          <InspectorPanelRow label="Height">
            <InspectorField>192</InspectorField>
          </InspectorPanelRow>
          <InspectorPanelRow label="Radius">
            <InspectorField>12</InspectorField>
          </InspectorPanelRow>
        </InspectorPanelSection>

        <InspectorPanelSection title="Appearance">
          <InspectorPanelRow label="Fill">
            <span className="relative w-full">
              <span
                aria-hidden
                className="absolute start-2 top-1/2 size-4 -translate-y-1/2 rounded-sm border border-border bg-foreground/80"
              />
              <InspectorField className="ps-8">#18181B</InspectorField>
            </span>
          </InspectorPanelRow>
          <InspectorPanelRow label="Opacity">
            <InspectorField>100%</InspectorField>
          </InspectorPanelRow>
        </InspectorPanelSection>

        <InspectorPanelSection title="Typography" defaultOpen={false}>
          <InspectorPanelRow label="Size">
            <InspectorField>14</InspectorField>
          </InspectorPanelRow>
          <InspectorPanelRow label="Weight">
            <InspectorField>Medium</InspectorField>
          </InspectorPanelRow>
        </InspectorPanelSection>
      </InspectorPanel>
    </section>
  );
};

export default InspectorPanelBlock;

'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';

import { cn } from '@/lib/utils';

type AccordionCommonProps = Omit<
  AccordionPrimitive.Root.Props<string>,
  'value' | 'defaultValue' | 'onValueChange' | 'multiple'
>;

type AccordionSingleProps = AccordionCommonProps & {
  /** One item open at a time. Values are plain strings. */
  type?: 'single';
  /** Whether the open item can be closed again by pressing its trigger. */
  collapsible?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, eventDetails: AccordionPrimitive.Root.ChangeEventDetails) => void;
};

type AccordionMultipleProps = AccordionCommonProps & {
  /** Any number of items open. Values are string arrays. */
  type: 'multiple';
  collapsible?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], eventDetails: AccordionPrimitive.Root.ChangeEventDetails) => void;
};

type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

function toArray(value: string | string[] | undefined) {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value;
  return value === '' ? [] : [value];
}

function Accordion({
  type = 'single',
  collapsible = false,
  value,
  defaultValue,
  onValueChange,
  ...props
}: AccordionProps) {
  const multiple = type === 'multiple';
  const handleValueChange = onValueChange as
    ((value: string | string[], eventDetails: AccordionPrimitive.Root.ChangeEventDetails) => void) | undefined;

  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      multiple={multiple}
      value={toArray(value)}
      defaultValue={toArray(defaultValue)}
      onValueChange={(next, eventDetails) => {
        if (!multiple && !collapsible && next.length === 0) {
          eventDetails.cancel();
          return;
        }
        handleValueChange?.(multiple ? next : (next[0] ?? ''), eventDetails);
      }}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-b last:border-b-0', className)}
      {...props}
    />
  );
}

function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-start text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&[data-panel-open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Calendar } from '@/registry/hirael/bases/radix/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/radix/ui/popover';

interface DatePickerContextValue {
  value: Date | undefined;
  setValue: (value: Date | undefined) => void;
  setOpen: (open: boolean) => void;
  locale: string;
  disabled?: boolean;
}

const DatePickerContext = React.createContext<DatePickerContextValue | null>(null);

const useDatePicker = () => {
  const ctx = React.useContext(DatePickerContext);
  if (!ctx) {
    throw new Error('DatePicker compound parts must be used inside <DatePicker>');
  }

  return ctx;
};

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** BCP 47 tag for the trigger label. Defaults to `en-US` so server and client render the same text. */
  locale?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const DatePicker = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  locale = 'en-US',
  disabled,
  children,
}: DatePickerProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = valueProp ?? internalValue;
  const setValue = React.useCallback(
    (next: Date | undefined) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const ctx = React.useMemo<DatePickerContextValue>(
    () => ({ value, setValue, setOpen, locale, disabled }),
    [value, setValue, setOpen, locale, disabled],
  );

  return (
    <DatePickerContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </DatePickerContext.Provider>
  );
};

interface DatePickerTriggerProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  placeholder?: string;
  children?: React.ReactNode;
}

const DatePickerTrigger = ({ placeholder = 'Pick a date', className, children, ...props }: DatePickerTriggerProps) => {
  const ctx = useDatePicker();
  const fmt = React.useMemo(() => new Intl.DateTimeFormat(ctx.locale, { dateStyle: 'medium' }), [ctx.locale]);

  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        disabled={ctx.disabled}
        data-slot="date-picker-trigger"
        className={cn(
          'inline-flex h-9 w-full items-center gap-2 rounded-sm border border-input bg-transparent px-3 text-start text-sm tabular-nums transition-colors outline-none',
          'hover:border-ring/60 focus-visible:border-ring data-[state=open]:border-ring',
          !ctx.value && 'text-muted-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span data-slot="date-picker-trigger-label" className="flex-1 truncate">
          {children ?? (ctx.value ? fmt.format(ctx.value) : placeholder)}
        </span>
      </button>
    </PopoverTrigger>
  );
};

type DatePickerContentProps = Omit<
  React.ComponentProps<typeof Calendar>,
  'mode' | 'selected' | 'onSelect' | 'required'
> &
  Pick<React.ComponentProps<typeof PopoverContent>, 'align'>;

/** Takes the calendar's props (`disabled`, `startMonth`, `weekStartsOn`, …) and closes on pick. */
const DatePickerContent = ({ align = 'start', ...props }: DatePickerContentProps) => {
  const ctx = useDatePicker();

  return (
    <PopoverContent align={align} data-slot="date-picker-content" className="w-auto p-0">
      <Calendar
        mode="single"
        selected={ctx.value}
        defaultMonth={ctx.value}
        onSelect={(date) => {
          ctx.setValue(date);
          ctx.setOpen(false);
        }}
        {...props}
      />
    </PopoverContent>
  );
};

export { DatePicker, DatePickerTrigger, DatePickerContent };

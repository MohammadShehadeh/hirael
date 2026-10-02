'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Calendar } from '@/registry/hirael/bases/base/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

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
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

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
    <PopoverTrigger
      render={
        <Button
          type="button"
          variant="outline"
          disabled={ctx.disabled}
          data-slot="date-picker-trigger"
          data-empty={!ctx.value || undefined}
          className={cn('w-full justify-start font-normal tabular-nums data-empty:text-muted-foreground', className)}
          {...props}
        />
      }
    >
      <CalendarIcon className="text-muted-foreground" />
      <span data-slot="date-picker-trigger-label" className="flex-1 truncate text-start">
        {children ?? (ctx.value ? fmt.format(ctx.value) : placeholder)}
      </span>
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

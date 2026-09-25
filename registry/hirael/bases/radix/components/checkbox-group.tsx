'use client';

import * as React from 'react';
import { MinusIcon, SearchIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Checkbox } from '@/registry/hirael/bases/radix/ui/checkbox';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/registry/hirael/bases/radix/ui/input-group';
import { Label } from '@/registry/hirael/bases/radix/ui/label';

interface ItemEntry {
  value: string;
  text: string;
  disabled: boolean;
  subId?: string;
}

interface SubEntry {
  id: string;
  text: string;
}

export type CheckboxGroupCheckedState = boolean | 'indeterminate';

export interface CheckboxGroupScope {
  /** Checked when every visible, enabled option is checked; indeterminate when only some are. */
  state: CheckboxGroupCheckedState;
  /** No visible option can change, or checking them all would pass `max`. */
  disabled: boolean;
  /** Checks every visible option, or unchecks them when that's the only possible move. */
  toggle: () => void;
}

export interface CheckboxGroupMessageState {
  count: number;
  min?: number;
  max?: number;
  /** The selection has hit `max`; unchecked options are disabled. */
  atMax: boolean;
  /** Fewer than `min` are checked. */
  belowMin: boolean;
  /** The selection has changed since mount. */
  touched: boolean;
}

interface CheckboxGroupContextValue extends CheckboxGroupMessageState {
  value: string[];
  query: string;
  setQuery: (query: string) => void;
  toggle: (value: string, checked: boolean) => void;
  registerItem: (entry: ItemEntry) => () => void;
  registerSub: (entry: SubEntry) => () => void;
  isItemVisible: (text: string, subId?: string) => boolean;
  isSubVisible: (id: string, text: string) => boolean;
  getScope: (subId?: string) => CheckboxGroupScope;
  visibleCount: number;
  disabled: boolean;
  invalid: boolean;
  labelId: string;
  messageId: string;
  setHasLabel: (has: boolean) => void;
  setHasMessage: (has: boolean) => void;
}

const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue | null>(null);
const CheckboxGroupSubContext = React.createContext<string | undefined>(undefined);

export const useCheckboxGroup = () => {
  const ctx = React.useContext(CheckboxGroupContext);
  if (!ctx) {
    throw new Error('CheckboxGroup compound parts must be used inside <CheckboxGroup>');
  }

  return ctx;
};

const textOf = (node: React.ReactNode, fallback: string) => {
  return typeof node === 'string' || typeof node === 'number' ? String(node) : fallback;
};

export interface CheckboxGroupProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** The checked option values. */
  value?: string[];
  /** Initial checked values when uncontrolled. */
  defaultValue?: string[];
  /** Called with the new list of checked values. */
  onValueChange?: (value: string[]) => void;
  /** Fewest options to check. Below it, the message part reports an error once the user has made a change. */
  min?: number;
  /** Most options to check. At the limit, the unchecked options are disabled. */
  max?: number;
  disabled?: boolean;
  /** Submits one form entry per checked value under this name. */
  name?: string;
}

const CheckboxGroup = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  min,
  max,
  disabled = false,
  name,
  className,
  children,
  'aria-invalid': ariaInvalid,
  ...props
}: CheckboxGroupProps) => {
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue ?? []);
  const value = valueProp ?? internalValue;
  const [touched, setTouched] = React.useState(false);

  const setValue = React.useCallback(
    (next: string[]) => {
      setTouched(true);
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [items, setItems] = React.useState<Map<string, ItemEntry>>(() => new Map());
  const [subs, setSubs] = React.useState<Map<string, SubEntry>>(() => new Map());
  const [query, setQuery] = React.useState('');
  const [hasLabel, setHasLabel] = React.useState(false);
  const [hasMessage, setHasMessage] = React.useState(false);

  const id = React.useId();
  const labelId = `${id}-label`;
  const messageId = `${id}-message`;

  const registerItem = React.useCallback((entry: ItemEntry) => {
    setItems((prev) => {
      const current = prev.get(entry.value);
      if (
        current &&
        current.text === entry.text &&
        current.disabled === entry.disabled &&
        current.subId === entry.subId
      ) {
        return prev;
      }

      return new Map(prev).set(entry.value, entry);
    });

    return () =>
      setItems((prev) => {
        if (!prev.has(entry.value)) return prev;
        const next = new Map(prev);
        next.delete(entry.value);

        return next;
      });
  }, []);

  const registerSub = React.useCallback((entry: SubEntry) => {
    setSubs((prev) => (prev.get(entry.id)?.text === entry.text ? prev : new Map(prev).set(entry.id, entry)));

    return () =>
      setSubs((prev) => {
        if (!prev.has(entry.id)) return prev;
        const next = new Map(prev);
        next.delete(entry.id);

        return next;
      });
  }, []);

  const needle = query.trim().toLowerCase();

  const isItemVisible = React.useCallback(
    (text: string, subId?: string) => {
      if (!needle || text.toLowerCase().includes(needle)) return true;
      const subText = subId ? subs.get(subId)?.text : undefined;

      return !!subText && subText.toLowerCase().includes(needle);
    },
    [needle, subs],
  );

  const isSubVisible = React.useCallback(
    (subId: string, text: string) => {
      if (!needle || text.toLowerCase().includes(needle)) return true;
      for (const item of items.values()) {
        if (item.subId === subId && item.text.toLowerCase().includes(needle)) return true;
      }

      return false;
    },
    [needle, items],
  );

  const toggle = React.useCallback(
    (option: string, checked: boolean) => {
      if (!checked) {
        setValue(value.filter((v) => v !== option));

        return;
      }
      if (value.includes(option) || (max !== undefined && value.length >= max)) return;
      setValue([...value, option]);
    },
    [value, setValue, max],
  );

  const getScope = React.useCallback(
    (subId?: string): CheckboxGroupScope => {
      const checkedSet = new Set(value);
      const visible = [...items.values()].filter(
        (item) => (subId === undefined || item.subId === subId) && isItemVisible(item.text, item.subId),
      );
      const selectable = visible.filter((item) => !item.disabled);
      const allChecked = selectable.length > 0 && selectable.every((item) => checkedSet.has(item.value));
      const noneChecked = visible.every((item) => !checkedSet.has(item.value));
      const additions = selectable.filter((item) => !checkedSet.has(item.value)).map((item) => item.value);
      const fits = max === undefined || value.length + additions.length <= max;
      const anySelectableChecked = selectable.some((item) => checkedSet.has(item.value));

      return {
        state: allChecked ? true : noneChecked ? false : 'indeterminate',
        disabled: disabled || selectable.length === 0 || (!allChecked && !fits && !anySelectableChecked),
        toggle: () => {
          if (allChecked || !fits) {
            const drop = new Set(selectable.map((item) => item.value));
            setValue(value.filter((v) => !drop.has(v)));
          } else {
            setValue([...value, ...additions]);
          }
        },
      };
    },
    [value, items, isItemVisible, max, disabled, setValue],
  );

  const visibleCount = React.useMemo(() => {
    let count = 0;
    for (const item of items.values()) if (isItemVisible(item.text, item.subId)) count++;

    return count;
  }, [items, isItemVisible]);

  const count = value.length;
  const atMax = max !== undefined && count >= max;
  const belowMin = min !== undefined && count < min;
  const invalid = ariaInvalid === true || ariaInvalid === 'true' || (touched && belowMin);

  const ctx = React.useMemo<CheckboxGroupContextValue>(
    () => ({
      value,
      query,
      setQuery,
      toggle,
      registerItem,
      registerSub,
      isItemVisible,
      isSubVisible,
      getScope,
      visibleCount,
      disabled,
      invalid,
      labelId,
      messageId,
      setHasLabel,
      setHasMessage,
      count,
      min,
      max,
      atMax,
      belowMin,
      touched,
    }),
    [
      value,
      query,
      toggle,
      registerItem,
      registerSub,
      isItemVisible,
      isSubVisible,
      getScope,
      visibleCount,
      disabled,
      invalid,
      labelId,
      messageId,
      count,
      min,
      max,
      atMax,
      belowMin,
      touched,
    ],
  );

  return (
    <CheckboxGroupContext.Provider value={ctx}>
      <div
        role="group"
        aria-labelledby={hasLabel ? labelId : undefined}
        aria-describedby={hasMessage ? messageId : undefined}
        aria-disabled={disabled || undefined}
        data-slot="checkbox-group"
        data-disabled={disabled || undefined}
        className={cn('flex flex-col gap-3', className)}
        {...props}
      >
        {children}
        {name && value.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
      </div>
    </CheckboxGroupContext.Provider>
  );
};

const CheckboxGroupLabel = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { labelId, setHasLabel } = useCheckboxGroup();

  React.useLayoutEffect(() => {
    setHasLabel(true);

    return () => setHasLabel(false);
  }, [setHasLabel]);

  return (
    <div id={labelId} data-slot="checkbox-group-label" className={cn('text-base font-medium', className)} {...props} />
  );
};

interface CheckboxRowProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled: boolean;
  invalid: boolean;
  control: React.ReactNode;
  labelClassName?: string;
}

const CheckboxRow = ({
  id,
  label,
  description,
  disabled,
  invalid,
  control,
  labelClassName,
  className,
  ...props
}: CheckboxRowProps) => {
  return (
    <div
      data-disabled={disabled ? 'true' : undefined}
      data-invalid={invalid || undefined}
      className={cn('group flex items-start gap-3', className)}
      {...props}
    >
      {control}
      <div className="grid min-w-0 flex-1 gap-1.5 pt-px">
        <Label id={`${id}-label`} htmlFor={id} className={labelClassName}>
          {label}
        </Label>
        {description && (
          <p id={`${id}-description`} className="text-sm text-muted-foreground group-data-[disabled=true]:opacity-50">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

interface TriStateCheckboxProps {
  id: string;
  scope: CheckboxGroupScope;
  invalid: boolean;
  describedBy?: string;
  controls?: string;
}

const TriStateCheckbox = ({ id, scope, invalid, describedBy, controls }: TriStateCheckboxProps) => {
  return (
    <span className="relative flex shrink-0">
      <Checkbox
        id={id}
        checked={scope.state}
        disabled={scope.disabled}
        onCheckedChange={() => scope.toggle()}
        aria-labelledby={`${id}-label`}
        aria-describedby={describedBy}
        aria-controls={controls}
        aria-invalid={invalid || undefined}
        // shadcn's checkbox draws a check for the mixed state too; this fills it and swaps in a dash.
        className="data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-primary data-[state=indeterminate]:[&_svg]:invisible"
      />
      {scope.state === 'indeterminate' && (
        <MinusIcon
          data-slot="checkbox-group-indeterminate"
          className="pointer-events-none absolute inset-0 m-auto size-3.5 text-primary-foreground"
        />
      )}
    </span>
  );
};

interface CheckboxGroupSelectAllProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The label. */
  children?: React.ReactNode;
  description?: React.ReactNode;
}

/** A parent checkbox for every visible option, so a filter narrows what it selects. */
const CheckboxGroupSelectAll = ({ children = 'Select all', description, ...props }: CheckboxGroupSelectAllProps) => {
  const { getScope, invalid } = useCheckboxGroup();
  const id = React.useId();
  const scope = getScope();

  return (
    <CheckboxRow
      id={id}
      data-slot="checkbox-group-select-all"
      label={children}
      description={description}
      disabled={scope.disabled}
      invalid={invalid}
      control={
        <TriStateCheckbox
          id={id}
          scope={scope}
          invalid={invalid}
          describedBy={description ? `${id}-description` : undefined}
        />
      }
      {...props}
    />
  );
};

interface CheckboxGroupSubProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The parent option's label. */
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Text matched by the search box when `label` isn't a plain string. */
  textValue?: string;
  children?: React.ReactNode;
}

/** A nested group whose parent checkbox reflects and sets its children. */
const CheckboxGroupSub = ({ label, description, textValue, className, children, ...props }: CheckboxGroupSubProps) => {
  const { registerSub, getScope, isSubVisible, invalid } = useCheckboxGroup();
  const id = React.useId();
  const text = textValue ?? textOf(label, '');
  const scope = getScope(id);

  React.useLayoutEffect(() => registerSub({ id, text }), [registerSub, id, text]);

  return (
    <div
      data-slot="checkbox-group-sub"
      hidden={!isSubVisible(id, text)}
      className={cn('flex flex-col gap-3 [[data-slot=checkbox-group-sub]+&]:mt-3', className)}
      {...props}
    >
      <CheckboxRow
        id={id}
        data-slot="checkbox-group-sub-trigger"
        label={label}
        description={description}
        disabled={scope.disabled}
        invalid={invalid}
        control={
          <TriStateCheckbox
            id={id}
            scope={scope}
            invalid={invalid}
            describedBy={description ? `${id}-description` : undefined}
            controls={`${id}-items`}
          />
        }
      />
      <CheckboxGroupSubContext.Provider value={id}>
        <div
          id={`${id}-items`}
          role="group"
          aria-labelledby={`${id}-label`}
          data-slot="checkbox-group-sub-items"
          className="flex flex-col gap-3 ps-7"
        >
          {children}
        </div>
      </CheckboxGroupSubContext.Provider>
    </div>
  );
};

interface CheckboxGroupItemProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The value added to the group's value when checked. */
  value: string;
  /** The label. Defaults to `value`. */
  children?: React.ReactNode;
  description?: React.ReactNode;
  /** Text matched by the search box when the label isn't a plain string. */
  textValue?: string;
  disabled?: boolean;
}

const CheckboxGroupItem = ({ value, children, description, textValue, disabled, ...props }: CheckboxGroupItemProps) => {
  const { value: checkedValues, toggle, registerItem, isItemVisible, atMax, invalid, ...ctx } = useCheckboxGroup();
  const subId = React.useContext(CheckboxGroupSubContext);
  const id = React.useId();
  const text = textValue ?? textOf(children, value);
  const ownDisabled = ctx.disabled || !!disabled;
  const checked = checkedValues.includes(value);
  const isDisabled = ownDisabled || (!checked && atMax);

  React.useLayoutEffect(
    () => registerItem({ value, text, disabled: ownDisabled, subId }),
    [registerItem, value, text, ownDisabled, subId],
  );

  return (
    <CheckboxRow
      id={id}
      data-slot="checkbox-group-item"
      data-checked={checked || undefined}
      hidden={!isItemVisible(text, subId)}
      label={children ?? value}
      labelClassName="font-normal"
      description={description}
      disabled={isDisabled}
      invalid={invalid}
      control={
        <Checkbox
          id={id}
          checked={checked}
          disabled={isDisabled}
          onCheckedChange={(next) => toggle(value, next === true)}
          aria-labelledby={`${id}-label`}
          aria-describedby={description ? `${id}-description` : undefined}
          aria-invalid={invalid || undefined}
        />
      }
      {...props}
    />
  );
};

interface CheckboxGroupSearchProps extends Omit<React.ComponentProps<'input'>, 'value' | 'defaultValue'> {
  /** Classes for the `<input>` itself; `className` goes on the surrounding group. */
  inputClassName?: string;
  /** Accessible name for the clear button. */
  clearLabel?: string;
}

/** Narrows the visible options. Escape clears it. */
const CheckboxGroupSearch = ({
  className,
  inputClassName,
  placeholder = 'Search',
  clearLabel = 'Clear search',
  onChange,
  onKeyDown,
  ...props
}: CheckboxGroupSearchProps) => {
  const { query, setQuery, disabled } = useCheckboxGroup();

  return (
    <InputGroup data-slot="checkbox-group-search" className={className}>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        autoComplete="off"
        placeholder={placeholder}
        aria-label={placeholder}
        disabled={disabled}
        value={query}
        className={cn('[&::-webkit-search-cancel-button]:hidden', inputClassName)}
        {...props}
        onChange={(event) => {
          onChange?.(event);
          if (!event.defaultPrevented) setQuery(event.target.value);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || event.key !== 'Escape' || !query) return;
          event.preventDefault();
          setQuery('');
        }}
      />
      {query && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label={clearLabel} onClick={() => setQuery('')}>
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

/** Rendered only when the search matches nothing. */
const CheckboxGroupEmpty = ({ className, children = 'No matches.', ...props }: React.ComponentProps<'p'>) => {
  const { query, visibleCount } = useCheckboxGroup();
  if (!query.trim() || visibleCount > 0) return null;

  return (
    <p
      role="status"
      data-slot="checkbox-group-empty"
      className={cn('py-4 text-center text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  );
};

const defaultMessage = ({ min, max, atMax, belowMin, touched }: CheckboxGroupMessageState) => {
  if (belowMin && touched) return `Pick at least ${min}.`;
  if (atMax) return `You can pick up to ${max}.`;

  return null;
};

interface CheckboxGroupMessageProps extends Omit<React.ComponentProps<'p'>, 'children'> {
  /** Custom text, or a function of the selection state. Defaults to min and max reminders. */
  children?: React.ReactNode | ((state: CheckboxGroupMessageState) => React.ReactNode);
}

/** Reports the `min` and `max` state; announced politely and linked to the group. */
const CheckboxGroupMessage = ({ className, children, ...props }: CheckboxGroupMessageProps) => {
  const { messageId, setHasMessage, count, min, max, atMax, belowMin, touched } = useCheckboxGroup();
  const state = { count, min, max, atMax, belowMin, touched };
  const content = typeof children === 'function' ? children(state) : (children ?? defaultMessage(state));

  React.useLayoutEffect(() => {
    setHasMessage(true);

    return () => setHasMessage(false);
  }, [setHasMessage]);

  return (
    <p
      id={messageId}
      aria-live="polite"
      data-slot="checkbox-group-message"
      data-invalid={(touched && belowMin) || undefined}
      className={cn('min-h-5 text-sm text-muted-foreground data-[invalid]:text-destructive', className)}
      {...props}
    >
      {content}
    </p>
  );
};

/** A plain column for the options, handy for capping height and scrolling a long list. */
const CheckboxGroupList = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div data-slot="checkbox-group-list" className={cn('flex flex-col gap-3', className)} {...props} />;
};

export {
  CheckboxGroup,
  CheckboxGroupLabel,
  CheckboxGroupSelectAll,
  CheckboxGroupSearch,
  CheckboxGroupList,
  CheckboxGroupSub,
  CheckboxGroupItem,
  CheckboxGroupEmpty,
  CheckboxGroupMessage,
};

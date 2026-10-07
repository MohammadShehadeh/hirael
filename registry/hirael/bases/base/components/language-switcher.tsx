'use client';

import * as React from 'react';
import { ChevronDown, Languages } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/registry/hirael/bases/base/ui/dropdown-menu';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

export interface Language {
  /** BCP 47 tag, like `en`, `ar` or `pt-BR`. */
  code: string;
  /** The language's name in its own script, like "Deutsch". Shown first so people can find their language. */
  nativeName: string;
  /** The name in the current UI language, shown as a hint when it differs from `nativeName`. */
  name?: string;
  /** Writing direction, so the page can flip with the language. */
  dir?: 'ltr' | 'rtl';
}

interface LanguageSwitcherContextValue {
  value: string;
  setValue: (code: string) => void;
  languages: Language[];
  current: Language | undefined;
}

const LanguageSwitcherContext = React.createContext<LanguageSwitcherContextValue | null>(null);

const useLanguageSwitcher = () => {
  const ctx = React.useContext(LanguageSwitcherContext);
  if (!ctx) {
    throw new Error('LanguageSwitcher compound parts must be used inside <LanguageSwitcher>');
  }

  return ctx;
};

export interface LanguageSwitcherProps {
  /** Languages to offer, in display order. */
  languages: Language[];
  value?: string;
  defaultValue?: string;
  /** Called with the new code and its language, including `dir` for flipping the layout. */
  onValueChange?: (code: string, language: Language | undefined) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const LanguageSwitcher = ({
  languages,
  value: valueProp,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  children,
}: LanguageSwitcherProps) => {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? languages[0]?.code ?? '',
    onChange: (code: string) =>
      onValueChange?.(
        code,
        languages.find((language) => language.code === code),
      ),
  });

  const ctx = React.useMemo<LanguageSwitcherContextValue>(
    () => ({ value, setValue, languages, current: languages.find((language) => language.code === value) }),
    [value, setValue, languages],
  );

  return (
    <LanguageSwitcherContext.Provider value={ctx}>
      <DropdownMenu open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        {children ?? (
          <>
            <LanguageSwitcherTrigger />
            <LanguageSwitcherContent />
          </>
        )}
      </DropdownMenu>
    </LanguageSwitcherContext.Provider>
  );
};

export interface LanguageSwitcherTriggerProps extends Omit<React.ComponentProps<typeof Button>, 'children'> {
  /** `name` shows the current language's native name, `code` its short tag (EN, AR), `icon` only the globe. */
  display?: 'name' | 'code' | 'icon';
  /** Accessible name, needed when `display` is `icon`. */
  label?: string;
}

const LanguageSwitcherTrigger = ({
  display = 'name',
  label = 'Change language',
  variant = 'outline',
  size,
  className,
  ...props
}: LanguageSwitcherTriggerProps) => {
  const { current, value } = useLanguageSwitcher();
  const iconOnly = display === 'icon';

  return (
    <DropdownMenuTrigger
      render={
        <Button
          type="button"
          variant={variant}
          size={size ?? (iconOnly ? 'icon' : 'default')}
          aria-label={iconOnly ? label : undefined}
          title={label}
          data-slot="language-switcher-trigger"
          className={cn(!iconOnly && 'font-normal', className)}
          {...props}
        />
      }
    >
      <Languages aria-hidden className="text-muted-foreground" />
      {!iconOnly && (
        <>
          <span data-slot="language-switcher-value" lang={value} className={cn(display === 'code' && 'uppercase')}>
            {display === 'code' ? value.split('-')[0] : (current?.nativeName ?? value)}
          </span>
          <ChevronDown aria-hidden className="text-muted-foreground" />
        </>
      )}
    </DropdownMenuTrigger>
  );
};

export interface LanguageSwitcherContentProps extends React.ComponentProps<typeof DropdownMenuContent> {
  /** Optional heading above the list. */
  heading?: React.ReactNode;
}

const LanguageSwitcherContent = ({ heading, align = 'end', className, ...props }: LanguageSwitcherContentProps) => {
  const { value, setValue, languages } = useLanguageSwitcher();

  return (
    <DropdownMenuContent
      align={align}
      data-slot="language-switcher-content"
      className={cn('w-auto min-w-48', className)}
      {...props}
    >
      <DropdownMenuGroup>
        {heading && <DropdownMenuLabel>{heading}</DropdownMenuLabel>}
        <DropdownMenuRadioGroup value={value} onValueChange={(code) => setValue(code)}>
          {languages.map((language) => (
            <DropdownMenuRadioItem key={language.code} value={language.code} data-slot="language-switcher-item">
              {/* Direction sits on an inline <bdi> so the name shapes correctly but lines up with the menu's other rows. */}
              <span className="flex-1 text-start">
                <bdi lang={language.code} dir={language.dir}>
                  {language.nativeName}
                </bdi>
              </span>
              {language.name && language.name !== language.nativeName && (
                <span className="ms-4 text-xs text-muted-foreground">{language.name}</span>
              )}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
};

export { LanguageSwitcher, LanguageSwitcherTrigger, LanguageSwitcherContent, useLanguageSwitcher };

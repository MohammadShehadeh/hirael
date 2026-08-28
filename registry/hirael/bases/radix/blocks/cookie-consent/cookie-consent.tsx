'use client';

import * as React from 'react';
import { Cookie } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { Switch } from '@/registry/hirael/bases/radix/ui/switch';

export type CookiePreferences = Record<string, boolean>;

interface CategoryRecord {
  id: string;
  required: boolean;
}

interface CookieConsentContextValue {
  prefs: CookiePreferences;
  setPref: (id: string, checked: boolean) => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  register: (category: CategoryRecord) => () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  save: () => void;
}

const CookieConsentContext = React.createContext<CookieConsentContextValue | null>(null);

const useCookieConsent = () => {
  const ctx = React.useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error('CookieConsent parts must be used within <CookieConsent>');
  }
  return ctx;
};

const noopUnsubscribe = () => () => {};

// Server render reports "chosen" so the SSR HTML never shows the banner and
// hydration agrees; the real storage value is read once hydration commits.
const useStoredChoice = (storageKey: string) => {
  const subscribe = React.useCallback(
    (cb: () => void) => {
      if (typeof window === 'undefined') return noopUnsubscribe();
      const handler = (e: StorageEvent) => {
        if (e.key === storageKey) cb();
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    },
    [storageKey],
  );
  const getSnapshot = React.useCallback(() => {
    if (typeof window === 'undefined') return true;
    try {
      return window.localStorage.getItem(storageKey) !== null;
    } catch {
      return false;
    }
  }, [storageKey]);
  const getServerSnapshot = React.useCallback(() => true, []);
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

const writeStored = (key: string, prefs: CookiePreferences) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(prefs));
  } catch {
    // Storage may be unavailable (private mode, quota). The choice still
    // reaches `onChange`, so nothing else to do here.
  }
};

interface CookieConsentProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** localStorage key the choice is saved under. */
  storageKey?: string;
  /** Whether the banner is pinned to the viewport or its nearest positioned parent. */
  position?: 'fixed' | 'absolute';
  /** Controlled visibility. When omitted, the banner shows until a choice is stored. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Starting values before the visitor decides. Required categories are always on. */
  defaultPreferences?: CookiePreferences;
  /** Called with the final preferences on Accept all, Reject all, or Save. */
  onChange?: (prefs: CookiePreferences) => void;
}

const CookieConsent = ({
  storageKey = 'cookie-consent',
  position = 'fixed',
  open: openProp,
  onOpenChange,
  defaultPreferences,
  onChange,
  className,
  children,
  ...props
}: CookieConsentProps) => {
  const isControlled = openProp !== undefined;
  const hasStoredChoice = useStoredChoice(storageKey);
  // Same-tab writes don't fire the storage event, so a local flag closes
  // the banner right after a choice is made.
  const [dismissed, setDismissed] = React.useState(false);
  const open = isControlled ? openProp : !hasStoredChoice && !dismissed;

  const [prefs, setPrefs] = React.useState<CookiePreferences>(() => defaultPreferences ?? {});
  const [expanded, setExpanded] = React.useState(false);
  const categoriesRef = React.useRef<Map<string, CategoryRecord>>(new Map());

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setDismissed(!next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const register = React.useCallback((category: CategoryRecord) => {
    categoriesRef.current.set(category.id, category);
    return () => {
      categoriesRef.current.delete(category.id);
    };
  }, []);

  const setPref = React.useCallback((id: string, checked: boolean) => {
    setPrefs((prev) => ({ ...prev, [id]: checked }));
  }, []);

  const commit = React.useCallback(
    (next: CookiePreferences) => {
      writeStored(storageKey, next);
      setPrefs(next);
      onChange?.(next);
      setExpanded(false);
      setOpen(false);
    },
    [storageKey, onChange, setOpen],
  );

  const acceptAll = React.useCallback(() => {
    const next: CookiePreferences = {};
    for (const { id } of categoriesRef.current.values()) next[id] = true;
    commit(next);
  }, [commit]);

  const rejectAll = React.useCallback(() => {
    const next: CookiePreferences = {};
    for (const { id, required } of categoriesRef.current.values()) {
      next[id] = required;
    }
    commit(next);
  }, [commit]);

  const save = React.useCallback(() => {
    const next: CookiePreferences = {};
    for (const { id, required } of categoriesRef.current.values()) {
      next[id] = required || Boolean(prefs[id]);
    }
    commit(next);
  }, [commit, prefs]);

  const value = React.useMemo<CookieConsentContextValue>(
    () => ({
      prefs,
      setPref,
      expanded,
      setExpanded,
      register,
      acceptAll,
      rejectAll,
      save,
    }),
    [prefs, setPref, expanded, register, acceptAll, rejectAll, save],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && expanded) {
      event.stopPropagation();
      setExpanded(false);
    }
  };

  if (!open) return null;

  return (
    <CookieConsentContext.Provider value={value}>
      <div
        role="dialog"
        aria-modal={false}
        aria-label="Cookie preferences"
        data-slot="cookie-consent"
        data-position={position}
        data-expanded={expanded ? '' : undefined}
        onKeyDown={onKeyDown}
        className={cn(
          position === 'fixed' ? 'fixed' : 'absolute',
          'bottom-4 start-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-lg',
          'animate-in fade-in-0 slide-in-from-bottom-4 duration-300 motion-reduce:animate-none',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CookieConsentContext.Provider>
  );
};

type CookieConsentTitleProps = React.ComponentProps<'h2'>;

const CookieConsentTitle = ({ className, children, ...props }: CookieConsentTitleProps) => {
  return (
    <h2
      data-slot="cookie-consent-title"
      className={cn('flex items-center gap-2 text-sm font-semibold tracking-[-0.01em] text-foreground', className)}
      {...props}
    >
      <Cookie aria-hidden className="size-4 text-muted-foreground" />
      {children}
    </h2>
  );
};

type CookieConsentDescriptionProps = React.ComponentProps<'p'>;

const CookieConsentDescription = ({ className, ...props }: CookieConsentDescriptionProps) => {
  return (
    <p
      data-slot="cookie-consent-description"
      className={cn('text-sm leading-relaxed text-muted-foreground', className)}
      {...props}
    />
  );
};

type CookieConsentManageProps = React.ComponentProps<typeof Button>;

/** Expands the per-category switches. Hidden once they're showing. */
const CookieConsentManage = ({ className, children = 'Manage', ...props }: CookieConsentManageProps) => {
  const { expanded, setExpanded } = useCookieConsent();
  if (expanded) return null;
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      data-slot="cookie-consent-manage"
      aria-expanded={expanded}
      onClick={() => setExpanded(true)}
      className={cn('text-muted-foreground', className)}
      {...props}
    >
      {children}
    </Button>
  );
};

type CookieConsentCategoriesProps = React.ComponentProps<'div'>;

/** Renders its categories only while the banner is expanded. */
const CookieConsentCategories = ({ className, ...props }: CookieConsentCategoriesProps) => {
  const { expanded } = useCookieConsent();
  if (!expanded) return null;
  return (
    <div
      data-slot="cookie-consent-categories"
      className={cn('flex flex-col divide-y divide-border rounded-md border border-border bg-background', className)}
      {...props}
    />
  );
};

interface CookieConsentCategoryProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Key the choice is stored under, e.g. "analytics". */
  id: string;
  name: React.ReactNode;
  description?: React.ReactNode;
  /** Always on and cannot be switched off. */
  required?: boolean;
}

const CookieConsentCategory = ({
  id,
  name,
  description,
  required = false,
  className,
  ...props
}: CookieConsentCategoryProps) => {
  const { prefs, setPref, register } = useCookieConsent();

  React.useEffect(() => register({ id, required }), [register, id, required]);

  const checked = required || Boolean(prefs[id]);
  const switchId = `cookie-consent-${id}`;

  return (
    <Field
      orientation="horizontal"
      data-slot="cookie-consent-category"
      data-required={required ? '' : undefined}
      className={cn('justify-between gap-4 p-3', className)}
      {...props}
    >
      <FieldContent className="min-w-0 gap-0.5">
        <FieldLabel htmlFor={switchId} className="items-center">
          {name}
          {required ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Always on</span>
          ) : null}
        </FieldLabel>
        {description ? <FieldDescription className="text-xs">{description}</FieldDescription> : null}
      </FieldContent>
      <Switch
        id={switchId}
        size="sm"
        checked={checked}
        disabled={required}
        onCheckedChange={(next) => setPref(id, next)}
        className="mt-0.5"
      />
    </Field>
  );
};

type CookieConsentActionsProps = React.ComponentProps<'div'>;

const CookieConsentActions = ({ className, ...props }: CookieConsentActionsProps) => {
  return (
    <div data-slot="cookie-consent-actions" className={cn('flex flex-wrap items-center gap-2', className)} {...props} />
  );
};

type CookieConsentButtonProps = React.ComponentProps<typeof Button>;

const CookieConsentAcceptAll = ({ children = 'Accept all', ...props }: CookieConsentButtonProps) => {
  const { acceptAll } = useCookieConsent();
  return (
    <Button type="button" size="sm" data-slot="cookie-consent-accept-all" onClick={acceptAll} {...props}>
      {children}
    </Button>
  );
};

const CookieConsentRejectAll = ({ children = 'Reject all', ...props }: CookieConsentButtonProps) => {
  const { rejectAll } = useCookieConsent();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      data-slot="cookie-consent-reject-all"
      onClick={rejectAll}
      {...props}
    >
      {children}
    </Button>
  );
};

/** Saves the current switches. Only shown while categories are expanded. */
const CookieConsentSave = ({ children = 'Save choices', ...props }: CookieConsentButtonProps) => {
  const { expanded, save } = useCookieConsent();
  if (!expanded) return null;
  return (
    <Button type="button" variant="outline" size="sm" data-slot="cookie-consent-save" onClick={save} {...props}>
      {children}
    </Button>
  );
};

type CookieConsentLinkProps = React.ComponentProps<'a'>;

const CookieConsentLink = ({ className, ...props }: CookieConsentLinkProps) => {
  return (
    <a
      data-slot="cookie-consent-link"
      className={cn(
        'text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    />
  );
};

export {
  CookieConsent,
  CookieConsentTitle,
  CookieConsentDescription,
  CookieConsentManage,
  CookieConsentCategories,
  CookieConsentCategory,
  CookieConsentActions,
  CookieConsentAcceptAll,
  CookieConsentRejectAll,
  CookieConsentSave,
  CookieConsentLink,
  useCookieConsent,
};

const PREVIEW_STORAGE_KEY = 'hirael-cookie-consent-preview';

const CookieConsentBlock = () => {
  const [open, setOpen] = React.useState(true);
  const [choice, setChoice] = React.useState<CookiePreferences | null>(null);

  const reset = () => {
    try {
      window.localStorage.removeItem(PREVIEW_STORAGE_KEY);
    } catch {
      // ignore
    }
    setChoice(null);
    setOpen(true);
  };

  const summary = choice
    ? Object.entries(choice)
        .filter(([, on]) => on)
        .map(([id]) => id)
        .join(', ')
    : null;

  return (
    <section
      data-slot="cookie-consent-block"
      className="relative flex min-h-svh w-full flex-col items-center justify-center gap-3 overflow-hidden bg-background p-6 sm:p-10"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {summary ? `Saved · ${summary}` : 'Waiting for a choice'}
        </span>
        {!open ? (
          <Button type="button" variant="link" onClick={reset} className="h-auto p-0 underline">
            Reset and show the banner again
          </Button>
        ) : null}
      </div>

      <CookieConsent
        position="absolute"
        storageKey={PREVIEW_STORAGE_KEY}
        open={open}
        onOpenChange={setOpen}
        onChange={setChoice}
      >
        <div className="flex flex-col gap-1.5">
          <CookieConsentTitle>We use cookies</CookieConsentTitle>
          <CookieConsentDescription>
            Necessary cookies keep the site working. With your permission we also use a few for analytics and to measure
            campaigns. <CookieConsentLink href="#">Privacy policy</CookieConsentLink>
          </CookieConsentDescription>
        </div>

        <CookieConsentCategories>
          <CookieConsentCategory
            id="necessary"
            name="Necessary"
            description="Sign-in, security, and remembering this choice."
            required
          />
          <CookieConsentCategory
            id="analytics"
            name="Analytics"
            description="Page views and feature usage, aggregated."
          />
          <CookieConsentCategory
            id="marketing"
            name="Marketing"
            description="Attribution for the campaigns that brought you here."
          />
        </CookieConsentCategories>

        <CookieConsentActions>
          <CookieConsentAcceptAll />
          <CookieConsentRejectAll />
          <CookieConsentSave />
          <CookieConsentManage className="ms-auto" />
        </CookieConsentActions>
      </CookieConsent>
    </section>
  );
};

export default CookieConsentBlock;

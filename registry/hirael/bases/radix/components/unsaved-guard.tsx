'use client';

import * as React from 'react';

import { ConfirmProvider, useConfirm } from '@/registry/hirael/bases/radix/components/confirm';

export interface UnsavedGuardOptions {
  /** Whether there are unsaved changes to guard. */
  when: boolean;
  /** Leave-dialog heading. */
  title?: React.ReactNode;
  /** Leave-dialog supporting line. */
  description?: React.ReactNode;
  /** Leave (proceed) button label. */
  confirmText?: React.ReactNode;
  /** Stay (cancel) button label. */
  cancelText?: React.ReactNode;
}

/**
 * Runs `proceed` once it is safe to navigate. With no unsaved changes it runs
 * immediately; otherwise it asks for confirmation first. Resolves `true` when
 * the navigation went ahead, `false` when it was cancelled.
 */
export type GuardNavigation = (proceed?: () => void | Promise<void>) => Promise<boolean>;

interface UnsavedGuardContextValue {
  register: (id: string, options: UnsavedGuardOptions) => void;
  unregister: (id: string) => void;
  confirmLeave: (options?: Partial<UnsavedGuardOptions>) => Promise<boolean>;
}

const UnsavedGuardContext = React.createContext<UnsavedGuardContextValue | null>(null);

/**
 * Registers an unsaved-changes guard. While `when` is true, leaving the page
 * (reload, tab close, in-app link) is intercepted with a confirm dialog.
 * Returns a `guard(proceed)` to wrap programmatic navigation. Must be used
 * under an `<UnsavedGuardProvider>`.
 */
const useUnsavedGuard = (options: UnsavedGuardOptions): GuardNavigation => {
  const ctx = React.useContext(UnsavedGuardContext);
  if (!ctx) {
    throw new Error('useUnsavedGuard must be used inside <UnsavedGuardProvider>');
  }
  const id = React.useId();
  const { when, title, description, confirmText, cancelText } = options;

  const latestRef = React.useRef(options);
  React.useEffect(() => {
    latestRef.current = { when, title, description, confirmText, cancelText };
  });

  React.useEffect(() => {
    ctx.register(id, { when, title, description, confirmText, cancelText });
    return () => ctx.unregister(id);
  }, [ctx, id, when, title, description, confirmText, cancelText]);

  return React.useCallback<GuardNavigation>(
    (proceed) => {
      const current = latestRef.current;
      if (!current.when) {
        return Promise.resolve(proceed?.()).then(() => true);
      }
      return ctx.confirmLeave(current).then((ok) => {
        if (!ok) return false;
        return Promise.resolve(proceed?.()).then(() => true);
      });
    },
    [ctx],
  );
};

export interface UnsavedGuardProviderProps {
  children: React.ReactNode;
  /** Warn on reload / tab close via the browser's native prompt. Default true. */
  beforeUnload?: boolean;
  /**
   * Called with the destination URL when the user confirms leaving via an
   * in-app link. Use it to navigate through your router (e.g. `router.push`);
   * defaults to a full navigation.
   */
  onProceed?: (href: string) => void;
  /** Default leave-dialog copy, overridden per `useUnsavedGuard` call. */
  defaultOptions?: Omit<UnsavedGuardOptions, 'when'>;
}

const UnsavedGuardProvider = ({
  children,
  beforeUnload = true,
  onProceed,
  defaultOptions,
}: UnsavedGuardProviderProps) => {
  return (
    <ConfirmProvider>
      <UnsavedGuardInner beforeUnload={beforeUnload} onProceed={onProceed} defaultOptions={defaultOptions}>
        {children}
      </UnsavedGuardInner>
    </ConfirmProvider>
  );
};

const UnsavedGuardInner = ({
  children,
  beforeUnload,
  onProceed,
  defaultOptions,
}: Required<Pick<UnsavedGuardProviderProps, 'beforeUnload'>> &
  Pick<UnsavedGuardProviderProps, 'onProceed' | 'defaultOptions' | 'children'>) => {
  const confirm = useConfirm();
  const guardsRef = React.useRef(new Map<string, UnsavedGuardOptions>());
  const blockedRef = React.useRef(false);
  const activeRef = React.useRef<UnsavedGuardOptions | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const {
    title: defTitle,
    description: defDescription,
    confirmText: defConfirmText,
    cancelText: defCancelText,
  } = defaultOptions ?? {};

  const recompute = React.useCallback(() => {
    let active: UnsavedGuardOptions | null = null;
    for (const value of guardsRef.current.values()) {
      if (value.when) {
        active = value;
        break;
      }
    }
    blockedRef.current = active !== null;
    activeRef.current = active;
  }, []);

  const register = React.useCallback(
    (id: string, options: UnsavedGuardOptions) => {
      guardsRef.current.set(id, options);
      recompute();
    },
    [recompute],
  );

  const unregister = React.useCallback(
    (id: string) => {
      guardsRef.current.delete(id);
      recompute();
    },
    [recompute],
  );

  const confirmLeave = React.useCallback(
    (options?: Partial<UnsavedGuardOptions>) =>
      confirm({
        tone: 'destructive',
        title: options?.title ?? defTitle ?? 'Discard unsaved changes?',
        description:
          options?.description ?? defDescription ?? 'You have unsaved changes that will be lost if you leave.',
        confirmText: options?.confirmText ?? defConfirmText ?? 'Leave',
        cancelText: options?.cancelText ?? defCancelText ?? 'Stay',
      }),
    [confirm, defTitle, defDescription, defConfirmText, defCancelText],
  );

  React.useEffect(() => {
    if (!beforeUnload) return;
    const handler = (event: BeforeUnloadEvent) => {
      if (!blockedRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [beforeUnload]);

  React.useEffect(() => {
    const root = wrapperRef.current;
    if (!root) return;
    const onClick = (event: MouseEvent) => {
      if (!blockedRef.current || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) {
        return;
      }
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.href === window.location.href) return;
      event.preventDefault();
      event.stopPropagation();
      void confirmLeave(activeRef.current ?? undefined).then((ok) => {
        if (!ok) return;
        if (onProceed) {
          onProceed(url.href);
        } else {
          window.location.assign(url.href);
        }
      });
    };
    root.addEventListener('click', onClick, true);
    return () => root.removeEventListener('click', onClick, true);
  }, [confirmLeave, onProceed]);

  const value = React.useMemo<UnsavedGuardContextValue>(
    () => ({ register, unregister, confirmLeave }),
    [register, unregister, confirmLeave],
  );

  return (
    <UnsavedGuardContext.Provider value={value}>
      <div ref={wrapperRef} style={{ display: 'contents' }}>
        {children}
      </div>
    </UnsavedGuardContext.Provider>
  );
};

export { UnsavedGuardProvider, useUnsavedGuard };

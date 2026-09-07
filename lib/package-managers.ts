'use client';

import * as React from 'react';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export const PACKAGE_MANAGERS: readonly PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'] as const;

const STORAGE_KEY = 'hirael:pm';
const CHANGE_EVENT = 'hirael:pm-change';

const RUNNERS: Record<PackageManager, string> = {
  npm: 'npx',
  pnpm: 'pnpm dlx',
  yarn: 'yarn dlx',
  bun: 'bunx --bun',
};

export const getShadcnAddCommand = (pm: PackageManager, url: string): string =>
  `${RUNNERS[pm]} shadcn@latest add ${url}`;

export const getShadcnInitCommand = (pm: PackageManager, flags: string): string =>
  `${RUNNERS[pm]} shadcn@latest init ${flags}`.trim();

const isPackageManager = (value: string | null): value is PackageManager => {
  return value !== null && (PACKAGE_MANAGERS as readonly string[]).includes(value);
};

/**
 * Held in the module rather than in any one component, so every install block
 * on the page agrees without one of them owning the state. localStorage is
 * where it persists, not where it lives: a browser that refuses to store it
 * still gets a working picker for the visit.
 */
let current: PackageManager | null = null;

const fromStorage = (): PackageManager => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isPackageManager(stored) ? stored : 'npm';
  } catch {
    return 'npm';
  }
};

/** Resolved from storage on first read, then kept in memory. */
const snapshot = (): PackageManager => (current ??= fromStorage());

/** `storage` covers other tabs; the custom event covers this one, which
 * `storage` never fires in. */
const subscribe = (onStoreChange: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    current = isPackageManager(event.newValue) ? event.newValue : 'npm';
    onStoreChange();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
};

export const setPackageManager = (next: PackageManager) => {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
  }
  window.dispatchEvent(new CustomEvent<PackageManager>(CHANGE_EVENT, { detail: next }));
};

export const usePackageManager = (): [PackageManager, (pm: PackageManager) => void] => {
  const pm = React.useSyncExternalStore(subscribe, snapshot, () => 'npm' as PackageManager);
  return [pm, setPackageManager];
};

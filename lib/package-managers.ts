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

export const getShadcnAddCommand = (packageManager: PackageManager, url: string): string =>
  `${RUNNERS[packageManager]} shadcn@latest add ${url}`;

export const getShadcnInitCommand = (packageManager: PackageManager, flags: string): string =>
  `${RUNNERS[packageManager]} shadcn@latest init ${flags}`.trim();

const isPackageManager = (value: string | null): value is PackageManager => {
  return value !== null && (PACKAGE_MANAGERS as readonly string[]).includes(value);
};

let current: PackageManager | null = null;

const fromStorage = (): PackageManager => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    return isPackageManager(stored) ? stored : 'npm';
  } catch {
    return 'npm';
  }
};

const snapshot = (): PackageManager => (current ??= fromStorage());

/** The storage event only fires in other tabs, so this tab sends its own. */
const subscribe = (onStoreChange: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    current = isPackageManager(event.newValue) ? event.newValue : 'npm';
    onStoreChange();
  };
  window.addEventListener('storage', handleStorage);
  window.addEventListener(CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
};

export const setPackageManager = (next: PackageManager) => {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {}
  window.dispatchEvent(new CustomEvent<PackageManager>(CHANGE_EVENT, { detail: next }));
};

export const usePackageManager = () => {
  const packageManager = React.useSyncExternalStore(subscribe, snapshot, () => 'npm' as PackageManager);

  return { packageManager, setPackageManager };
};

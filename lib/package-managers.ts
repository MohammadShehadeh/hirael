"use client";

import * as React from "react";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export const PACKAGE_MANAGERS: readonly PackageManager[] = [
  "npm",
  "pnpm",
  "yarn",
  "bun",
] as const;

const STORAGE_KEY = "hirael:pm";
const CHANGE_EVENT = "hirael:pm-change";

const RUNNERS: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
};

export const getShadcnAddCommand = (pm: PackageManager, url: string): string =>
  `${RUNNERS[pm]} shadcn@latest add ${url}`;

export const getShadcnInitCommand = (pm: PackageManager, flags: string): string =>
  `${RUNNERS[pm]} shadcn@latest init ${flags}`.trim();

const isPackageManager = (value: string | null): value is PackageManager => {
  return (
    value !== null && (PACKAGE_MANAGERS as readonly string[]).includes(value)
  );
};

export const usePackageManager = (): [
  PackageManager,
  (pm: PackageManager) => void,
] => {
  const [pm, setPmState] = React.useState<PackageManager>("npm");

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isPackageManager(stored)) setPmState(stored);
    } catch {
      // localStorage unavailable; fall back to default
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && isPackageManager(e.newValue)) {
        setPmState(e.newValue);
      }
    };
    const onSameTab = (e: Event) => {
      const detail = (e as CustomEvent<PackageManager>).detail;
      if (isPackageManager(detail)) setPmState(detail);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(CHANGE_EVENT, onSameTab);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CHANGE_EVENT, onSameTab);
    };
  }, []);

  const setPm = React.useCallback((next: PackageManager) => {
    setPmState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(
        new CustomEvent<PackageManager>(CHANGE_EVENT, { detail: next }),
      );
    } catch {
      // ignore
    }
  }, []);

  return [pm, setPm];
};

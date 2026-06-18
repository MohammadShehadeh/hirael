"use client";

import * as React from "react";
import { Flag, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";

export type FeatureFlag = {
  id: string;
  name: string;
  key: string;
  description?: string;
  enabled: boolean;
  environments?: string[];
  rollout?: number;
};

type FeatureFlagManagerContextValue = {
  flags: FeatureFlag[];
  query: string;
  setQuery: (query: string) => void;
  toggle: (id: string) => void;
  enabledCount: number;
  total: number;
};

const FeatureFlagManagerContext =
  React.createContext<FeatureFlagManagerContextValue | null>(null);

function useFeatureFlagManager() {
  const ctx = React.useContext(FeatureFlagManagerContext);
  if (!ctx) {
    throw new Error(
      "FeatureFlagManager compound parts must be used inside <FeatureFlagManager>",
    );
  }
  return ctx;
}

function matchesQuery(flag: FeatureFlag, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    flag.name.toLowerCase().includes(q) ||
    flag.key.toLowerCase().includes(q) ||
    (flag.description?.toLowerCase().includes(q) ?? false)
  );
}

export type FeatureFlagManagerProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** Controlled list of flags. */
  value?: FeatureFlag[];
  /** Uncontrolled initial list of flags. */
  defaultValue?: FeatureFlag[];
  /** Called with the next list whenever a flag is toggled. */
  onValueChange?: (value: FeatureFlag[]) => void;
};

function FeatureFlagManager({
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: FeatureFlagManagerProps) {
  const [internalValue, setInternalValue] = React.useState<FeatureFlag[]>(
    defaultValue ?? [],
  );
  const flags = valueProp ?? internalValue;

  const setValue = React.useCallback(
    (next: FeatureFlag[]) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const [query, setQuery] = React.useState("");

  const toggle = React.useCallback(
    (id: string) => {
      setValue(
        flags.map((flag) =>
          flag.id === id ? { ...flag, enabled: !flag.enabled } : flag,
        ),
      );
    },
    [flags, setValue],
  );

  const enabledCount = flags.filter((flag) => flag.enabled).length;

  const ctx = React.useMemo<FeatureFlagManagerContextValue>(
    () => ({
      flags,
      query,
      setQuery,
      toggle,
      enabledCount,
      total: flags.length,
    }),
    [flags, query, toggle, enabledCount],
  );

  return (
    <FeatureFlagManagerContext.Provider value={ctx}>
      <div
        data-slot="feature-flag-manager"
        className={cn(
          "flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </FeatureFlagManagerContext.Provider>
  );
}

type FeatureFlagManagerToolbarProps = React.ComponentProps<"div">;

function FeatureFlagManagerToolbar({
  className,
  ...props
}: FeatureFlagManagerToolbarProps) {
  const { query, setQuery, enabledCount, total } = useFeatureFlagManager();

  return (
    <div
      data-slot="feature-flag-manager-toolbar"
      className={cn(
        "flex items-center gap-3 border-b border-border px-4 py-3",
        className,
      )}
      {...props}
    >
      <div className="relative min-w-0 flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search flags"
          aria-label="Search flags"
          className="h-8 w-full rounded-md border border-border bg-background pe-3 ps-8 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>
      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
        {enabledCount} / {total} on
      </span>
    </div>
  );
}

type FeatureFlagListProps = React.ComponentProps<"ul">;

function FeatureFlagList({ className, children, ...props }: FeatureFlagListProps) {
  const { flags, query } = useFeatureFlagManager();
  const visible = flags.filter((flag) => matchesQuery(flag, query));

  return (
    <ul
      data-slot="feature-flag-list"
      className={cn("divide-y divide-border", className)}
      {...props}
    >
      {children ??
        visible.map((flag) => <FeatureFlagItem key={flag.id} flag={flag} />)}
    </ul>
  );
}

type FeatureFlagItemProps = React.ComponentProps<"li"> & {
  flag: FeatureFlag;
};

function FeatureFlagItem({
  flag,
  className,
  children,
  ...props
}: FeatureFlagItemProps) {
  return (
    <li
      data-slot="feature-flag-item"
      data-enabled={flag.enabled ? "" : undefined}
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                {flag.enabled ? (
                  <span className="state-dot" aria-hidden />
                ) : (
                  <Flag
                    aria-hidden
                    className="size-3.5 text-muted-foreground"
                  />
                )}
                {flag.name}
              </span>
              <code className="truncate font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                {flag.key}
              </code>
            </div>
            {flag.description ? (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {flag.description}
              </p>
            ) : null}
            {flag.environments?.length || flag.rollout !== undefined ? (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {flag.environments?.map((env) => (
                  <Badge
                    key={env}
                    variant="secondary"
                    className="bg-muted font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
                  >
                    {env}
                  </Badge>
                ))}
                {flag.rollout !== undefined ? (
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                    {flag.rollout}% rollout
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
          <FeatureFlagSwitch flag={flag} className="ms-auto" />
        </>
      )}
    </li>
  );
}

type FeatureFlagSwitchProps = Omit<
  React.ComponentProps<"button">,
  "role" | "aria-checked" | "onClick"
> & {
  flag: FeatureFlag;
};

function FeatureFlagSwitch({
  flag,
  className,
  ...props
}: FeatureFlagSwitchProps) {
  const { toggle } = useFeatureFlagManager();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={flag.enabled}
      aria-label={`Toggle ${flag.name}`}
      data-slot="feature-flag-switch"
      data-state={flag.enabled ? "checked" : "unchecked"}
      onClick={() => toggle(flag.id)}
      className={cn(
        "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent p-0.5 transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none size-4 rounded-full bg-background shadow-sm transition-transform data-[state=checked]:translate-x-4 rtl:data-[state=checked]:-translate-x-4"
        data-state={flag.enabled ? "checked" : "unchecked"}
      />
    </button>
  );
}

export {
  FeatureFlagManager,
  FeatureFlagManagerToolbar,
  FeatureFlagList,
  FeatureFlagItem,
  FeatureFlagSwitch,
};

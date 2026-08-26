"use client";

import * as React from "react";
import {
  Eye,
  EyeOff,
  Lock,
  LockOpen,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/registry/hirael/components/copy-button";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/hirael/ui/dialog";
import { Field, FieldError } from "@/registry/hirael/ui/field";
import { Input } from "@/registry/hirael/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/hirael/ui/input-group";
import { Textarea } from "@/registry/hirael/ui/textarea";

export type EnvEnvironment = "production" | "preview" | "development";

export interface EnvVar {
  key: string;
  value: string;
  secret?: boolean;
  environments?: EnvEnvironment[];
}

const ENVIRONMENTS: readonly { id: EnvEnvironment; label: string }[] = [
  { id: "production", label: "Prod" },
  { id: "preview", label: "Preview" },
  { id: "development", label: "Dev" },
];

const KEY_PATTERN = /^[A-Z_][A-Z0-9_]*$/;
const SECRET_HINT = /(SECRET|TOKEN|PASSWORD|PRIVATE|API_KEY)/;

/**
 * Parses `.env` text into variables. Handles comments, blank lines, an
 * optional `export` prefix, single or double quotes, `\n` escapes inside
 * double quotes, and trailing `# comments` after unquoted values.
 */
const parseDotEnv = (text: string): EnvVar[] => {
  const vars: EnvVar[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_.-]*)\s*=\s*(.*)$/.exec(
      line,
    );
    if (!match) continue;

    const key = match[1];
    let value = match[2].trim();

    if (value.startsWith('"')) {
      const end = value.indexOf('"', 1);
      value = end === -1 ? value.slice(1) : value.slice(1, end);
      value = value.replace(/\\n/g, "\n").replace(/\\"/g, '"');
    } else if (value.startsWith("'")) {
      const end = value.indexOf("'", 1);
      value = end === -1 ? value.slice(1) : value.slice(1, end);
    } else {
      const hash = value.indexOf(" #");
      if (hash !== -1) value = value.slice(0, hash).trim();
    }

    vars.push({ key, value });
  }
  return vars;
};

const validateKey = (key: string): string | null => {
  if (!key) return "Key is required.";
  if (!KEY_PATTERN.test(key)) {
    return "Use A-Z, 0-9 and underscores. Cannot start with a digit.";
  }
  return null;
};

const sameVar = (a: EnvVar, b: EnvVar) => {
  return (
    a.key === b.key &&
    a.value === b.value &&
    Boolean(a.secret) === Boolean(b.secret) &&
    (a.environments ?? []).join(",") === (b.environments ?? []).join(",")
  );
};

interface EnvEditorContextValue {
  vars: EnvVar[];
  visible: number[];
  query: string;
  setQuery: (query: string) => void;
  errors: Record<number, string>;
  hasErrors: boolean;
  dirtyCount: number;
  adding: boolean;
  setAdding: (adding: boolean) => void;
  update: (index: number, patch: Partial<EnvVar>) => void;
  remove: (index: number) => void;
  add: (vars: EnvVar | EnvVar[]) => void;
  save: () => void;
  discard: () => void;
}

const EnvEditorContext = React.createContext<EnvEditorContextValue | null>(
  null,
);

const useEnvEditor = () => {
  const ctx = React.useContext(EnvEditorContext);
  if (!ctx) {
    throw new Error("EnvEditor parts must be used within <EnvEditor>");
  }
  return ctx;
};

interface EnvEditorProps extends Omit<
  React.ComponentProps<"div">,
  "defaultValue"
> {
  value?: EnvVar[];
  defaultValue?: EnvVar[];
  onValueChange?: (vars: EnvVar[]) => void;
  /** Called with the full list when Save is pressed. */
  onSave?: (vars: EnvVar[]) => void;
  onDiscard?: () => void;
}

const EnvEditor = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  onSave,
  onDiscard,
  className,
  children,
  ...props
}: EnvEditorProps) => {
  const isControlled = valueProp !== undefined;
  const [valueState, setValueState] = React.useState<EnvVar[]>(
    () => defaultValue ?? [],
  );
  const vars = isControlled ? valueProp : valueState;

  // Last saved snapshot; the footer counts changes against it.
  const [baseline, setBaseline] = React.useState<EnvVar[]>(vars);
  const [query, setQuery] = React.useState("");
  const [adding, setAdding] = React.useState(false);

  const setVars = React.useCallback(
    (next: EnvVar[]) => {
      if (!isControlled) setValueState(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const update = React.useCallback(
    (index: number, patch: Partial<EnvVar>) => {
      setVars(vars.map((v, i) => (i === index ? { ...v, ...patch } : v)));
    },
    [vars, setVars],
  );

  const remove = React.useCallback(
    (index: number) => {
      setVars(vars.filter((_, i) => i !== index));
    },
    [vars, setVars],
  );

  const add = React.useCallback(
    (incoming: EnvVar | EnvVar[]) => {
      const list = Array.isArray(incoming) ? incoming : [incoming];
      const next = [...vars];
      for (const item of list) {
        const existing = next.findIndex((v) => v.key === item.key);
        if (existing === -1) next.push(item);
        else next[existing] = { ...next[existing], ...item };
      }
      setVars(next);
    },
    [vars, setVars],
  );

  const save = React.useCallback(() => {
    setBaseline(vars);
    onSave?.(vars);
  }, [vars, onSave]);

  const discard = React.useCallback(() => {
    setVars(baseline);
    setAdding(false);
    onDiscard?.();
  }, [baseline, setVars, onDiscard]);

  const errors = React.useMemo(() => {
    const result: Record<number, string> = {};
    const seen = new Map<string, number>();
    vars.forEach((v, i) => {
      const message = validateKey(v.key);
      if (message) {
        result[i] = message;
        return;
      }
      const first = seen.get(v.key);
      if (first !== undefined) {
        result[i] = `Duplicate of row ${first + 1}.`;
      } else {
        seen.set(v.key, i);
      }
    });
    return result;
  }, [vars]);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return vars
      .map((v, i) => ({ v, i }))
      .filter(
        ({ v }) =>
          !q ||
          v.key.toLowerCase().includes(q) ||
          (!v.secret && v.value.toLowerCase().includes(q)),
      )
      .map(({ i }) => i);
  }, [vars, query]);

  const dirtyCount = React.useMemo(() => {
    let count = 0;
    vars.forEach((v, i) => {
      const before = baseline[i];
      if (!before || !sameVar(v, before)) count += 1;
    });
    count += Math.max(0, baseline.length - vars.length);
    return count;
  }, [vars, baseline]);

  const ctx = React.useMemo<EnvEditorContextValue>(
    () => ({
      vars,
      visible,
      query,
      setQuery,
      errors,
      hasErrors: Object.keys(errors).length > 0,
      dirtyCount,
      adding,
      setAdding,
      update,
      remove,
      add,
      save,
      discard,
    }),
    [
      vars,
      visible,
      query,
      errors,
      dirtyCount,
      adding,
      update,
      remove,
      add,
      save,
      discard,
    ],
  );

  return (
    <EnvEditorContext.Provider value={ctx}>
      <div
        data-slot="env-editor"
        className={cn(
          "flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </EnvEditorContext.Provider>
  );
};

interface EnvEditorHeaderProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  title?: React.ReactNode;
  /** Hide the search box. */
  searchable?: boolean;
}

const EnvEditorHeader = ({
  title = "Environment variables",
  searchable = true,
  className,
  children,
  ...props
}: EnvEditorHeaderProps) => {
  const { vars, query, setQuery, setAdding } = useEnvEditor();

  return (
    <div
      data-slot="env-editor-header"
      className={cn(
        "flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <Badge
          variant="outline"
          className="font-mono text-[10px] tabular-nums"
          aria-label={`${vars.length} variables`}
        >
          {vars.length}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {searchable ? (
          <InputGroup className="h-8 w-44">
            <InputGroupAddon align="inline-start">
              <Search className="size-3.5" aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search keys"
              aria-label="Search variables"
              className="text-xs"
            />
          </InputGroup>
        ) : null}
        <EnvEditorImport />
        <Button
          type="button"
          size="sm"
          data-slot="env-editor-add-trigger"
          onClick={() => setAdding(true)}
        >
          <Plus aria-hidden />
          Add variable
        </Button>
        {children}
      </div>
    </div>
  );
};

type EnvEditorImportProps = React.ComponentProps<typeof Button>;

const EnvEditorImport = ({
  className,
  children = "Import .env",
  ...props
}: EnvEditorImportProps) => {
  const { add } = useEnvEditor();
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");

  const parsed = React.useMemo(() => parseDotEnv(text), [text]);

  const submit = () => {
    add(
      parsed.map((v) => ({
        ...v,
        secret: SECRET_HINT.test(v.key),
        environments: ["production", "preview", "development"],
      })),
    );
    setText("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-slot="env-editor-import"
          className={className}
          {...props}
        >
          <Upload aria-hidden />
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import from .env</DialogTitle>
          <DialogDescription>
            Paste the file contents. Comments and blank lines are ignored;
            existing keys are updated in place.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          spellCheck={false}
          aria-label=".env contents"
          placeholder={
            'DATABASE_URL="postgres://..."\n# comments are fine\nLOG_LEVEL=debug'
          }
          className="min-h-40 font-mono text-xs"
        />
        <DialogFooter className="sm:items-center sm:justify-between">
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {parsed.length} {parsed.length === 1 ? "variable" : "variables"}{" "}
            found
          </span>
          <Button
            type="button"
            size="sm"
            disabled={parsed.length === 0}
            onClick={submit}
          >
            Import {parsed.length > 0 ? parsed.length : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ROW_GRID =
  "md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto_auto] md:items-start md:gap-3";

type EnvEditorTableProps = React.ComponentProps<"div">;

/** Renders one `EnvEditorRow` per visible variable unless children are given. */
const EnvEditorTable = ({
  className,
  children,
  ...props
}: EnvEditorTableProps) => {
  const { vars, visible, query } = useEnvEditor();

  return (
    <div
      data-slot="env-editor-table"
      role="table"
      aria-label="Environment variables"
      className={cn("flex flex-col", className)}
      {...props}
    >
      <div
        role="row"
        className={cn(
          "hidden border-b border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground",
          ROW_GRID,
        )}
      >
        <span role="columnheader">Key</span>
        <span role="columnheader">Value</span>
        <span role="columnheader">Environments</span>
        <span role="columnheader" className="sr-only">
          Actions
        </span>
      </div>
      {children ??
        (visible.length === 0 ? (
          <EnvEditorEmpty>
            {vars.length === 0
              ? "No variables yet. Add one or import a .env file."
              : `Nothing matches "${query}".`}
          </EnvEditorEmpty>
        ) : (
          visible.map((index) => <EnvEditorRow key={index} index={index} />)
        ))}
    </div>
  );
};

interface EnvironmentChipsProps {
  value: EnvEnvironment[];
  onChange: (next: EnvEnvironment[]) => void;
  label: string;
}

const EnvironmentChips = ({
  value,
  onChange,
  label,
}: EnvironmentChipsProps) => {
  const toggle = (id: EnvEnvironment) => {
    onChange(
      value.includes(id)
        ? value.filter((env) => env !== id)
        : ENVIRONMENTS.map((env) => env.id).filter(
            (env) => env === id || value.includes(env),
          ),
    );
  };

  return (
    <div
      role="group"
      aria-label={label}
      data-slot="env-editor-environments"
      className="flex items-center gap-1"
    >
      {ENVIRONMENTS.map((env) => {
        const on = value.includes(env.id);
        return (
          <button
            key={env.id}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(env.id)}
            className={cn(
              "inline-flex h-7 items-center rounded-md border px-2 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              on
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {env.label}
          </button>
        );
      })}
    </div>
  );
};

interface EnvEditorRowProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  index: number;
}

const EnvEditorRow = ({ index, className, ...props }: EnvEditorRowProps) => {
  const { vars, errors, update, remove } = useEnvEditor();
  const [revealed, setRevealed] = React.useState(false);
  const item = vars[index];
  if (!item) return null;

  const error = errors[index];
  const secret = Boolean(item.secret);
  const errorId = `env-editor-error-${index}`;

  return (
    <div
      role="row"
      data-slot="env-editor-row"
      data-secret={secret ? "" : undefined}
      className={cn(
        "flex flex-col gap-2 border-b border-border px-4 py-3 last:border-b-0",
        ROW_GRID,
        className,
      )}
      {...props}
    >
      <div role="cell" className="flex flex-col gap-1">
        <Input
          value={item.key}
          onChange={(event) =>
            update(index, { key: event.target.value.toUpperCase() })
          }
          aria-label="Key"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          spellCheck={false}
          autoCapitalize="characters"
          className="h-8 font-mono text-xs"
        />
        {error ? (
          <p id={errorId} className="text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </div>

      <div role="cell" className="flex items-center gap-1">
        <Input
          type={secret && !revealed ? "password" : "text"}
          value={item.value}
          onChange={(event) => update(index, { value: event.target.value })}
          aria-label="Value"
          spellCheck={false}
          autoComplete="off"
          className="h-8 font-mono text-xs"
        />
        {secret ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={revealed ? "Hide value" : "Reveal value"}
            aria-pressed={revealed}
            onClick={() => setRevealed((v) => !v)}
            className="size-7 text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
          >
            {revealed ? <EyeOff /> : <Eye />}
          </Button>
        ) : null}
        <CopyButton value={item.value} size="sm" />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={secret ? "Mark as plain text" : "Mark as secret"}
          aria-pressed={secret}
          onClick={() => {
            update(index, { secret: !secret });
            setRevealed(false);
          }}
          className={cn(
            "size-7 [&_svg]:size-3.5",
            secret
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {secret ? <Lock /> : <LockOpen />}
        </Button>
      </div>

      <div role="cell" className="flex items-center md:h-8">
        <EnvironmentChips
          label={`Environments for ${item.key || "variable"}`}
          value={item.environments ?? []}
          onChange={(environments) => update(index, { environments })}
        />
      </div>

      <div role="cell" className="flex items-center justify-end md:h-8">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete ${item.key || "variable"}`}
          onClick={() => remove(index)}
          className="size-7 text-muted-foreground hover:text-destructive [&_svg]:size-3.5"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};

type EnvEditorAddProps = Omit<React.ComponentProps<"form">, "onSubmit">;

/** Inline form for a new row. Shows after "Add variable" is pressed. */
const EnvEditorAdd = ({ className, ...props }: EnvEditorAddProps) => {
  const { vars, add, adding, setAdding } = useEnvEditor();
  const [key, setKey] = React.useState("");
  const [value, setValue] = React.useState("");
  const [secret, setSecret] = React.useState(false);
  const [environments, setEnvironments] = React.useState<EnvEnvironment[]>([
    "production",
    "preview",
    "development",
  ]);
  const [touched, setTouched] = React.useState(false);
  const keyErrorId = React.useId();

  if (!adding) return null;

  const keyError =
    validateKey(key) ??
    (vars.some((v) => v.key === key) ? "That key already exists." : null);

  const reset = () => {
    setKey("");
    setValue("");
    setSecret(false);
    setTouched(false);
    setAdding(false);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (keyError) return;
    add({ key, value, secret, environments });
    reset();
  };

  return (
    <form
      data-slot="env-editor-add"
      onSubmit={submit}
      onKeyDown={(event) => {
        if (event.key === "Escape") reset();
      }}
      className={cn(
        "flex flex-col gap-2 border-t border-border bg-muted/40 px-4 py-3",
        ROW_GRID,
        className,
      )}
      {...props}
    >
      <Field
        className="gap-1"
        data-invalid={touched && keyError ? true : undefined}
      >
        <Input
          autoFocus
          value={key}
          onChange={(event) => setKey(event.target.value.toUpperCase())}
          onBlur={() => setTouched(true)}
          placeholder="NEW_KEY"
          aria-label="New key"
          aria-invalid={touched && keyError ? true : undefined}
          aria-describedby={touched && keyError ? keyErrorId : undefined}
          spellCheck={false}
          className="h-8 bg-background font-mono text-xs"
        />
        <FieldError id={keyErrorId} className="text-xs">
          {touched && keyError ? keyError : null}
        </FieldError>
      </Field>
      <div className="flex items-center gap-1">
        <Input
          type={secret ? "password" : "text"}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="value"
          aria-label="New value"
          spellCheck={false}
          autoComplete="off"
          className="h-8 bg-background font-mono text-xs"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={secret ? "Mark as plain text" : "Mark as secret"}
          aria-pressed={secret}
          onClick={() => setSecret((v) => !v)}
          className={cn(
            "size-7 [&_svg]:size-3.5",
            secret
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {secret ? <Lock /> : <LockOpen />}
        </Button>
      </div>
      <div className="flex items-center md:h-8">
        <EnvironmentChips
          label="Environments for the new variable"
          value={environments}
          onChange={setEnvironments}
        />
      </div>
      <div className="flex items-center justify-end gap-1 md:h-8">
        <Button type="button" variant="ghost" size="sm" onClick={reset}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Add
        </Button>
      </div>
    </form>
  );
};

type EnvEditorEmptyProps = React.ComponentProps<"div">;

const EnvEditorEmpty = ({ className, ...props }: EnvEditorEmptyProps) => {
  return (
    <div
      data-slot="env-editor-empty"
      className={cn(
        "flex flex-col items-center justify-center gap-1 px-4 py-12 text-center text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};

type EnvEditorFooterProps = React.ComponentProps<"div">;

const EnvEditorFooter = ({
  className,
  children,
  ...props
}: EnvEditorFooterProps) => {
  const { dirtyCount, hasErrors, save, discard } = useEnvEditor();
  const dirty = dirtyCount > 0;

  return (
    <div
      data-slot="env-editor-footer"
      className={cn(
        "flex items-center justify-between gap-3 border-t border-border bg-muted/40 px-4 py-3",
        className,
      )}
      {...props}
    >
      <span
        aria-live="polite"
        className={cn(
          "font-mono text-[11px] tabular-nums",
          hasErrors
            ? "text-destructive"
            : dirty
              ? "text-foreground"
              : "text-muted-foreground",
        )}
      >
        {hasErrors
          ? "Fix the highlighted keys to save."
          : dirty
            ? `${dirtyCount} unsaved ${dirtyCount === 1 ? "change" : "changes"}`
            : "All changes saved"}
      </span>
      <div className="flex items-center gap-2">
        {children}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!dirty}
          onClick={discard}
        >
          Discard
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!dirty || hasErrors}
          onClick={save}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export {
  EnvEditor,
  EnvEditorHeader,
  EnvEditorImport,
  EnvEditorTable,
  EnvEditorRow,
  EnvEditorAdd,
  EnvEditorEmpty,
  EnvEditorFooter,
  useEnvEditor,
  parseDotEnv,
};

const SAMPLE: EnvVar[] = [
  {
    key: "DATABASE_URL",
    value: "postgres://app:s3cr3t@db.internal:5432/relay",
    secret: true,
    environments: ["production"],
  },
  {
    key: "REDIS_URL",
    value: "redis://cache.internal:6379/0",
    environments: ["production", "preview"],
  },
  {
    key: "STRIPE_SECRET_KEY",
    value: "sk_live_51N8xK2QfR7ZmY0pL9wVtHc",
    secret: true,
    environments: ["production"],
  },
  {
    key: "NEXT_PUBLIC_APP_URL",
    value: "https://app.relay.dev",
    environments: ["production", "preview", "development"],
  },
  {
    key: "LOG_LEVEL",
    value: "info",
    environments: ["production", "preview", "development"],
  },
  {
    key: "SESSION_SECRET",
    value: "b7f2e9c4a1d84f6e9a0c3b5d7e1f2a4c",
    secret: true,
    environments: ["production", "preview", "development"],
  },
];

const EnvEditorBlock = () => {
  const [vars, setVars] = React.useState<EnvVar[]>(SAMPLE);

  return (
    <section
      data-slot="env-editor-block"
      className="flex w-full justify-center bg-background p-6 sm:p-10"
    >
      <EnvEditor
        value={vars}
        onValueChange={setVars}
        className="w-full max-w-4xl"
      >
        <EnvEditorHeader />
        <EnvEditorTable />
        <EnvEditorAdd />
        <EnvEditorFooter />
      </EnvEditor>
    </section>
  );
};

export default EnvEditorBlock;

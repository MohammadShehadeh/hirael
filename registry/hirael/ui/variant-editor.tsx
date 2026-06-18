"use client";

import * as React from "react";
import { Plus, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import { Input } from "@/registry/hirael/ui/input";

export type VariantOption = {
  id: string;
  name: string;
  values: string[];
};

export type VariantRow = {
  id: string;
  options: Record<string, string>;
  price: string;
  sku: string;
  stock: string;
};

function comboKey(options: Record<string, string>): string {
  return Object.keys(options)
    .sort()
    .map((name) => `${name}=${options[name]}`)
    .join("");
}

function cartesian(
  axes: VariantOption[],
): Array<Record<string, string>> {
  const usable = axes.filter(
    (axis) => axis.name.trim() !== "" && axis.values.length > 0,
  );
  if (usable.length === 0) return [];
  return usable.reduce<Array<Record<string, string>>>(
    (acc, axis) =>
      acc.flatMap((combo) =>
        axis.values.map((value) => ({ ...combo, [axis.name]: value })),
      ),
    [{}],
  );
}

type VariantEditorContextValue = {
  options: VariantOption[];
  rows: VariantRow[];
  createId: () => string;
  addOption: () => void;
  removeOption: (id: string) => void;
  renameOption: (id: string, name: string) => void;
  addValue: (id: string, value: string) => void;
  removeValue: (id: string, index: number) => void;
  updateRow: (
    id: string,
    patch: Partial<Pick<VariantRow, "price" | "sku" | "stock">>,
  ) => void;
};

const VariantEditorContext =
  React.createContext<VariantEditorContextValue | null>(null);

function useVariantEditor(): VariantEditorContextValue {
  const context = React.useContext(VariantEditorContext);
  if (!context) {
    throw new Error(
      "VariantEditor compound parts must be used inside <VariantEditor>",
    );
  }
  return context;
}

type VariantEditorState = {
  options: VariantOption[];
  rows: VariantRow[];
};

export type VariantEditorProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** Controlled options and generated rows. */
  value?: VariantEditorState;
  /** Initial options and rows for an uncontrolled editor. */
  defaultValue?: VariantEditorState;
  /** Called whenever the options or any row changes. */
  onValueChange?: (value: VariantEditorState) => void;
};

function VariantEditor({
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: VariantEditorProps) {
  const idPrefix = React.useId();
  const counter = React.useRef(0);

  const createId = React.useCallback(() => {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }
    counter.current += 1;
    return `${idPrefix}item-${counter.current}`;
  }, [idPrefix]);

  const [internal, setInternal] = React.useState<VariantEditorState>(
    () => defaultValue ?? { options: [], rows: [] },
  );

  const isControlled = valueProp !== undefined;
  const state = isControlled ? valueProp : internal;

  const commitOptions = React.useCallback(
    (nextOptions: VariantOption[]) => {
      const combos = cartesian(nextOptions);
      const existing = new Map(
        state.rows.map((row) => [comboKey(row.options), row]),
      );
      const nextRows = combos.map((options) => {
        const key = comboKey(options);
        const prev = existing.get(key);
        return prev
          ? { ...prev, options }
          : {
              id: createId(),
              options,
              price: "",
              sku: "",
              stock: "",
            };
      });
      const next: VariantEditorState = {
        options: nextOptions,
        rows: nextRows,
      };
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [state.rows, createId, isControlled, onValueChange],
  );

  const commitRows = React.useCallback(
    (nextRows: VariantRow[]) => {
      const next: VariantEditorState = {
        options: state.options,
        rows: nextRows,
      };
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [state.options, isControlled, onValueChange],
  );

  const addOption = React.useCallback(() => {
    commitOptions([
      ...state.options,
      { id: createId(), name: "", values: [] },
    ]);
  }, [state.options, createId, commitOptions]);

  const removeOption = React.useCallback(
    (id: string) => {
      commitOptions(state.options.filter((option) => option.id !== id));
    },
    [state.options, commitOptions],
  );

  const renameOption = React.useCallback(
    (id: string, name: string) => {
      commitOptions(
        state.options.map((option) =>
          option.id === id ? { ...option, name } : option,
        ),
      );
    },
    [state.options, commitOptions],
  );

  const addValue = React.useCallback(
    (id: string, value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      commitOptions(
        state.options.map((option) =>
          option.id === id && !option.values.includes(trimmed)
            ? { ...option, values: [...option.values, trimmed] }
            : option,
        ),
      );
    },
    [state.options, commitOptions],
  );

  const removeValue = React.useCallback(
    (id: string, index: number) => {
      commitOptions(
        state.options.map((option) =>
          option.id === id
            ? {
                ...option,
                values: option.values.filter((_, i) => i !== index),
              }
            : option,
        ),
      );
    },
    [state.options, commitOptions],
  );

  const updateRow = React.useCallback(
    (
      id: string,
      patch: Partial<Pick<VariantRow, "price" | "sku" | "stock">>,
    ) => {
      commitRows(
        state.rows.map((row) =>
          row.id === id ? { ...row, ...patch } : row,
        ),
      );
    },
    [state.rows, commitRows],
  );

  const context = React.useMemo<VariantEditorContextValue>(
    () => ({
      options: state.options,
      rows: state.rows,
      createId,
      addOption,
      removeOption,
      renameOption,
      addValue,
      removeValue,
      updateRow,
    }),
    [
      state.options,
      state.rows,
      createId,
      addOption,
      removeOption,
      renameOption,
      addValue,
      removeValue,
      updateRow,
    ],
  );

  return (
    <VariantEditorContext.Provider value={context}>
      <div
        data-slot="variant-editor"
        className={cn("flex w-full flex-col gap-6", className)}
        {...props}
      >
        {children}
      </div>
    </VariantEditorContext.Provider>
  );
}

type VariantOptionsProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Override the add-axis control label. */
  addLabel?: React.ReactNode;
};

function VariantOptions({
  className,
  addLabel = "Add option",
  ...props
}: VariantOptionsProps) {
  const ctx = useVariantEditor();
  return (
    <div
      data-slot="variant-options"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {ctx.options.map((option) => (
        <VariantOptionRow key={option.id} option={option} />
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        data-slot="variant-options-add"
        onClick={ctx.addOption}
        className="w-fit"
      >
        <Plus />
        {addLabel}
      </Button>
    </div>
  );
}

type VariantOptionProps = Omit<React.ComponentProps<"div">, "children"> & {
  option: VariantOption;
};

function VariantOptionRow({ option, className, ...props }: VariantOptionProps) {
  const ctx = useVariantEditor();
  return (
    <div
      data-slot="variant-option"
      className={cn(
        "flex flex-col gap-2 rounded-md border border-border bg-card p-3 sm:flex-row sm:items-start",
        className,
      )}
      {...props}
    >
      <Input
        data-slot="variant-option-name"
        value={option.name}
        onChange={(event) => ctx.renameOption(option.id, event.target.value)}
        placeholder="Option name"
        aria-label="Option name"
        className="sm:w-40"
      />
      <VariantValues option={option} className="flex-1" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        data-slot="variant-option-remove"
        aria-label={`Remove ${option.name || "option"}`}
        onClick={() => ctx.removeOption(option.id)}
        className="text-muted-foreground"
      >
        <Trash2 />
      </Button>
    </div>
  );
}

type VariantValuesProps = Omit<React.ComponentProps<"div">, "children"> & {
  option: VariantOption;
};

function VariantValues({ option, className, ...props }: VariantValuesProps) {
  const ctx = useVariantEditor();
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const commit = () => {
    if (!draft.trim()) return;
    ctx.addValue(option.id, draft);
    setDraft("");
  };

  return (
    <div
      data-slot="variant-values"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault();
          inputRef.current?.focus();
        }
      }}
      className={cn(
        "flex min-h-9 flex-wrap items-center gap-1 rounded-sm border border-input bg-transparent px-1.5 py-1 transition-colors focus-within:border-ring",
        className,
      )}
      {...props}
    >
      {option.values.map((value, index) => (
        <Badge
          key={`${value}-${index}`}
          variant="secondary"
          data-slot="variant-value"
          className="gap-1 pe-1 font-normal"
        >
          <span className="min-w-0 truncate">{value}</span>
          <button
            type="button"
            tabIndex={-1}
            aria-label={`Remove ${value}`}
            onClick={() => ctx.removeValue(option.id, index)}
            className="inline-flex size-3.5 items-center justify-center rounded-[2px] text-secondary-foreground/70 transition-colors hover:bg-secondary-foreground/20 hover:text-secondary-foreground"
          >
            <X className="size-2.5" />
          </button>
        </Badge>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            if (draft.trim()) {
              event.preventDefault();
              commit();
            }
          } else if (
            event.key === "Backspace" &&
            !draft &&
            option.values.length > 0
          ) {
            event.preventDefault();
            ctx.removeValue(option.id, option.values.length - 1);
          }
        }}
        onBlur={commit}
        placeholder={option.values.length === 0 ? "Add value" : undefined}
        aria-label="Add value"
        data-slot="variant-values-field"
        className="min-w-24 flex-1 bg-transparent px-1.5 py-0.5 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

const VARIANT_FIELDS: Array<{
  key: "price" | "sku" | "stock";
  label: string;
  placeholder: string;
  inputMode?: React.ComponentProps<"input">["inputMode"];
}> = [
  { key: "price", label: "Price", placeholder: "0.00", inputMode: "decimal" },
  { key: "sku", label: "SKU", placeholder: "SKU-000" },
  { key: "stock", label: "Stock", placeholder: "0", inputMode: "numeric" },
];

type VariantTableProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Shown when no variants are generated yet. */
  emptyHint?: React.ReactNode;
};

function VariantTable({
  className,
  emptyHint = "Add options with values to generate variants.",
  ...props
}: VariantTableProps) {
  const ctx = useVariantEditor();
  const axisNames = ctx.options
    .filter((option) => option.name.trim() !== "" && option.values.length > 0)
    .map((option) => option.name);

  if (ctx.rows.length === 0) {
    return (
      <div
        data-slot="variant-table"
        data-empty="true"
        className={cn(
          "rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground",
          className,
        )}
        {...props}
      >
        {emptyHint}
      </div>
    );
  }

  return (
    <div
      data-slot="variant-table"
      className={cn(
        "overflow-hidden rounded-md border border-border",
        className,
      )}
      {...props}
    >
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-start text-xs font-medium text-muted-foreground">
            <th className="px-3 py-2 text-start font-medium">Variant</th>
            {VARIANT_FIELDS.map((field) => (
              <th
                key={field.key}
                className="px-3 py-2 text-start font-medium"
              >
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ctx.rows.map((row) => (
            <VariantTableRow key={row.id} row={row} axisNames={axisNames} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type VariantRowProps = Omit<
  React.ComponentProps<"tr">,
  "children" | "row"
> & {
  row: VariantRow;
  axisNames?: string[];
};

function VariantTableRow({
  row,
  axisNames,
  className,
  ...props
}: VariantRowProps) {
  const ctx = useVariantEditor();
  const names =
    axisNames ?? Object.keys(row.options).sort((a, b) => a.localeCompare(b));
  const label = names
    .map((name) => row.options[name])
    .filter(Boolean)
    .join(" / ");

  return (
    <tr
      data-slot="variant-row"
      className={cn(
        "border-b border-border last:border-b-0 align-middle",
        className,
      )}
      {...props}
    >
      <td className="px-3 py-2">
        <span
          data-slot="variant-row-label"
          className="font-medium text-foreground"
        >
          {label}
        </span>
      </td>
      {VARIANT_FIELDS.map((field) => (
        <td key={field.key} className="px-3 py-2">
          <Input
            data-slot={`variant-row-${field.key}`}
            value={row[field.key]}
            onChange={(event) =>
              ctx.updateRow(row.id, { [field.key]: event.target.value })
            }
            placeholder={field.placeholder}
            inputMode={field.inputMode}
            aria-label={`${label} ${field.label}`}
            className="h-8 min-w-20"
          />
        </td>
      ))}
    </tr>
  );
}

type VariantCountProps = Omit<React.ComponentProps<"p">, "children"> & {
  /** Render the label from the variant count. */
  children?: (count: number) => React.ReactNode;
};

function VariantCount({ className, children, ...props }: VariantCountProps) {
  const ctx = useVariantEditor();
  const count = ctx.rows.length;
  return (
    <p
      data-slot="variant-count"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children
        ? children(count)
        : `${count} variant${count === 1 ? "" : "s"}`}
    </p>
  );
}

export {
  VariantEditor,
  VariantOptions,
  VariantOptionRow as VariantOption,
  VariantValues,
  VariantTable,
  VariantTableRow as VariantRow,
  VariantCount,
};

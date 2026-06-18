"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/registry/hirael/ui/input";

type Variant = { id: string; label: string };

type Location = { id: string; label: string };

type StockMap = Record<string, Record<string, number>>;

type StockState = "ok" | "low" | "out";

function stockState(qty: number, lowStockThreshold: number): StockState {
  if (qty <= 0) return "out";
  if (qty <= lowStockThreshold) return "low";
  return "ok";
}

type InventoryMatrixContextValue = {
  variants: Variant[];
  locations: Location[];
  value: StockMap;
  lowStockThreshold: number;
  quantity: (variantId: string, locationId: string) => number;
  setQuantity: (variantId: string, locationId: string, qty: number) => void;
  rowTotal: (variantId: string) => number;
  columnTotal: (locationId: string) => number;
  grandTotal: () => number;
};

const InventoryMatrixContext =
  React.createContext<InventoryMatrixContextValue | null>(null);

function useInventoryMatrix() {
  const ctx = React.useContext(InventoryMatrixContext);
  if (!ctx) {
    throw new Error(
      "InventoryMatrix compound parts must be used inside <InventoryMatrix>",
    );
  }
  return ctx;
}

export type InventoryMatrixProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** Rows of the grid. Each variant (size, SKU, …) renders one stock row. */
  variants: Variant[];
  /** Columns of the grid. Each location or warehouse renders one stock column. */
  locations: Location[];
  /** Controlled stock map of variant id to location id to on-hand quantity. */
  value?: StockMap;
  /** Initial stock map for uncontrolled use. */
  defaultValue?: StockMap;
  /** Called with the next stock map whenever a cell changes. */
  onValueChange?: (value: StockMap) => void;
  /** Quantities at or below this count tint as low stock. Zero or less is out of stock. */
  lowStockThreshold?: number;
};

function InventoryMatrix({
  variants,
  locations,
  value: valueProp,
  defaultValue,
  onValueChange,
  lowStockThreshold = 5,
  className,
  children,
  ...props
}: InventoryMatrixProps) {
  const [internalValue, setInternalValue] = React.useState<StockMap>(
    () => defaultValue ?? {},
  );
  const value = valueProp ?? internalValue;

  const setValue = React.useCallback(
    (next: StockMap) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const quantity = React.useCallback(
    (variantId: string, locationId: string) =>
      value[variantId]?.[locationId] ?? 0,
    [value],
  );

  const setQuantity = React.useCallback(
    (variantId: string, locationId: string, qty: number) => {
      setValue({
        ...value,
        [variantId]: { ...(value[variantId] ?? {}), [locationId]: qty },
      });
    },
    [value, setValue],
  );

  const rowTotal = React.useCallback(
    (variantId: string) =>
      locations.reduce(
        (sum, location) => sum + quantity(variantId, location.id),
        0,
      ),
    [locations, quantity],
  );

  const columnTotal = React.useCallback(
    (locationId: string) =>
      variants.reduce(
        (sum, variant) => sum + quantity(variant.id, locationId),
        0,
      ),
    [variants, quantity],
  );

  const grandTotal = React.useCallback(
    () =>
      variants.reduce((sum, variant) => sum + rowTotal(variant.id), 0),
    [variants, rowTotal],
  );

  const ctx = React.useMemo<InventoryMatrixContextValue>(
    () => ({
      variants,
      locations,
      value,
      lowStockThreshold,
      quantity,
      setQuantity,
      rowTotal,
      columnTotal,
      grandTotal,
    }),
    [
      variants,
      locations,
      value,
      lowStockThreshold,
      quantity,
      setQuantity,
      rowTotal,
      columnTotal,
      grandTotal,
    ],
  );

  return (
    <InventoryMatrixContext.Provider value={ctx}>
      <div
        data-slot="inventory-matrix"
        className={cn(
          "relative w-full overflow-x-auto rounded-lg border border-border bg-card text-card-foreground",
          className,
        )}
        {...props}
      >
        {children ?? (
          <table
            data-slot="inventory-matrix-table"
            className="w-full border-collapse text-sm"
          >
            <InventoryMatrixHeader />
            <tbody data-slot="inventory-matrix-body">
              {variants.map((variant) => (
                <InventoryRow key={variant.id} variant={variant} />
              ))}
            </tbody>
            <InventoryTotals />
          </table>
        )}
      </div>
    </InventoryMatrixContext.Provider>
  );
}

export type InventoryMatrixHeaderProps = React.ComponentProps<"thead">;

function InventoryMatrixHeader({
  className,
  ...props
}: InventoryMatrixHeaderProps) {
  const { locations } = useInventoryMatrix();
  return (
    <thead
      data-slot="inventory-matrix-header"
      className={cn("border-b border-border bg-muted/40", className)}
      {...props}
    >
      <tr data-slot="inventory-matrix-header-row">
        <th
          scope="col"
          data-slot="inventory-matrix-corner"
          className="sticky start-0 z-10 bg-muted/40 px-4 py-3 text-start align-bottom font-medium text-muted-foreground"
        >
          Variant
        </th>
        {locations.map((location) => (
          <th
            key={location.id}
            scope="col"
            data-slot="inventory-matrix-location"
            className="px-3 py-3 text-center align-bottom font-medium text-foreground"
          >
            {location.label}
          </th>
        ))}
        <th
          scope="col"
          data-slot="inventory-matrix-total-head"
          className="px-4 py-3 text-end align-bottom font-medium text-muted-foreground"
        >
          Total
        </th>
      </tr>
    </thead>
  );
}

export type InventoryRowProps = Omit<React.ComponentProps<"tr">, "children"> & {
  variant: Variant;
};

function InventoryRow({ variant, className, ...props }: InventoryRowProps) {
  const { locations, quantity, setQuantity, rowTotal, lowStockThreshold } =
    useInventoryMatrix();
  const total = rowTotal(variant.id);
  return (
    <tr
      data-slot="inventory-row"
      className={cn(
        "border-b border-border transition-colors hover:bg-accent/40",
        className,
      )}
      {...props}
    >
      <th
        scope="row"
        data-slot="inventory-row-label"
        className="sticky start-0 z-10 bg-card px-4 py-2 text-start font-normal text-foreground"
      >
        {variant.label}
      </th>
      {locations.map((location) => {
        const qty = quantity(variant.id, location.id);
        return (
          <InventoryCell
            key={location.id}
            value={qty}
            state={stockState(qty, lowStockThreshold)}
            onValueChange={(next) =>
              setQuantity(variant.id, location.id, next)
            }
            aria-label={`Stock for ${variant.label} at ${location.label}`}
          />
        );
      })}
      <td
        data-slot="inventory-row-total"
        className="px-4 py-2 text-end font-medium tabular-nums text-foreground"
      >
        {total}
      </td>
    </tr>
  );
}

export type InventoryCellProps = Omit<
  React.ComponentProps<"td">,
  "onChange"
> & {
  /** On-hand quantity shown in the cell input. */
  value: number;
  /** Stock state derived from the low-stock threshold, driving the cell tint. */
  state: StockState;
  /** Called with the parsed quantity when the cell input changes. */
  onValueChange?: (value: number) => void;
  /** Accessible name for the cell input, e.g. "Stock for M at Berlin". */
  "aria-label"?: string;
  disabled?: boolean;
};

function InventoryCell({
  value,
  state,
  onValueChange,
  disabled,
  className,
  "aria-label": ariaLabel,
  ...props
}: InventoryCellProps) {
  return (
    <td
      data-slot="inventory-cell"
      data-state={state}
      className={cn(
        "px-2 py-1.5 text-center",
        state === "low" && "bg-warning/10",
        state === "out" && "bg-destructive/10",
        className,
      )}
      {...props}
    >
      <div className="relative">
        <Input
          data-slot="inventory-cell-input"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={value}
          disabled={disabled}
          aria-label={ariaLabel}
          onChange={(event) => {
            const parsed = event.currentTarget.valueAsNumber;
            onValueChange?.(Number.isNaN(parsed) ? 0 : parsed);
          }}
          className={cn(
            "mx-auto w-20 text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            state === "low" &&
              "border-warning/40 text-warning focus-visible:border-warning focus-visible:ring-warning/40",
            state === "out" &&
              "border-destructive/40 text-destructive focus-visible:border-destructive focus-visible:ring-destructive/40",
          )}
        />
        {state === "low" ? (
          <AlertTriangle
            data-slot="inventory-cell-low-icon"
            className="pointer-events-none absolute end-2 top-1/2 size-3.5 -translate-y-1/2 text-warning"
            aria-hidden
          />
        ) : null}
      </div>
    </td>
  );
}

export type InventoryTotalsProps = React.ComponentProps<"tfoot">;

function InventoryTotals({ className, ...props }: InventoryTotalsProps) {
  const { locations, columnTotal, grandTotal } = useInventoryMatrix();
  return (
    <tfoot
      data-slot="inventory-totals"
      className={cn("border-t border-border bg-muted/40", className)}
      {...props}
    >
      <tr data-slot="inventory-totals-row">
        <th
          scope="row"
          data-slot="inventory-totals-label"
          className="sticky start-0 z-10 bg-muted/40 px-4 py-2.5 text-start font-medium text-muted-foreground"
        >
          Total
        </th>
        {locations.map((location) => (
          <td
            key={location.id}
            data-slot="inventory-column-total"
            className="px-3 py-2.5 text-center font-medium tabular-nums text-foreground"
          >
            {columnTotal(location.id)}
          </td>
        ))}
        <td
          data-slot="inventory-grand-total"
          className="px-4 py-2.5 text-end font-semibold tabular-nums text-foreground"
        >
          {grandTotal()}
        </td>
      </tr>
    </tfoot>
  );
}

export {
  InventoryMatrix,
  InventoryMatrixHeader,
  InventoryRow,
  InventoryCell,
  InventoryTotals,
};

"use client";

import * as React from "react";
import { Minus, Package, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import { Input } from "@/registry/hirael/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/hirael/ui/select";

export type BundleProduct = {
  id: string;
  name: string;
  price: number;
};

export type BundleLine = {
  id: string;
  productId: string;
  quantity: number;
};

function formatPrice(value: number, locale: string, currency: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
}

function productById(
  products: BundleProduct[],
  productId: string,
): BundleProduct | undefined {
  return products.find((product) => product.id === productId);
}

function lineTotal(products: BundleProduct[], line: BundleLine): number {
  const product = productById(products, line.productId);
  return product ? product.price * line.quantity : 0;
}

type Ctx = {
  products: BundleProduct[];
  value: BundleLine[];
  discount: number;
  locale: string;
  currency: string;
  add: (productId: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  setDiscount: (discount: number) => void;
  subtotal: number;
  savings: number;
  total: number;
  nextId: () => string;
};

const BundleBuilderContext = React.createContext<Ctx | null>(null);

function useBundleBuilder(): Ctx {
  const ctx = React.useContext(BundleBuilderContext);
  if (!ctx) {
    throw new Error(
      "BundleBuilder compound parts must be used inside <BundleBuilder>",
    );
  }
  return ctx;
}

export type BundleBuilderProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  /** Catalog of products the picker can add to the bundle. */
  products: BundleProduct[];
  /** Controlled list of bundle lines. */
  value?: BundleLine[];
  /** Initial bundle lines for an uncontrolled builder. */
  defaultValue?: BundleLine[];
  /** Called whenever the bundle lines change. */
  onValueChange?: (value: BundleLine[]) => void;
  /** Controlled bundle discount as a percentage from 0 to 100. */
  discount?: number;
  /** Initial discount percentage for an uncontrolled builder. */
  defaultDiscount?: number;
  /** Called whenever the discount percentage changes. */
  onDiscountChange?: (discount: number) => void;
  /** BCP 47 locale used to format prices. */
  locale?: string;
  /** ISO 4217 currency code used to format prices. */
  currency?: string;
};

function BundleBuilder({
  products,
  value: valueProp,
  defaultValue,
  onValueChange,
  discount: discountProp,
  defaultDiscount = 0,
  onDiscountChange,
  locale = "en-US",
  currency = "USD",
  className,
  children,
  ...props
}: BundleBuilderProps) {
  const reactId = React.useId();
  const seedRef = React.useRef(0);

  const [internalValue, setInternalValue] = React.useState<BundleLine[]>(
    defaultValue ?? [],
  );
  const value = valueProp ?? internalValue;

  const [internalDiscount, setInternalDiscount] =
    React.useState<number>(defaultDiscount);
  const discount = discountProp ?? internalDiscount;

  const nextId = React.useCallback(
    () => `${reactId}-line-${seedRef.current++}`,
    [reactId],
  );

  const setValue = React.useCallback(
    (next: BundleLine[]) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const setDiscount = React.useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(100, next));
      if (discountProp === undefined) setInternalDiscount(clamped);
      onDiscountChange?.(clamped);
    },
    [discountProp, onDiscountChange],
  );

  const add = React.useCallback(
    (productId: string) => {
      if (!productById(products, productId)) return;
      const existing = value.find((line) => line.productId === productId);
      if (existing) {
        setValue(
          value.map((line) =>
            line.id === existing.id
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          ),
        );
        return;
      }
      setValue([...value, { id: nextId(), productId, quantity: 1 }]);
    },
    [products, value, setValue, nextId],
  );

  const setQuantity = React.useCallback(
    (id: string, quantity: number) => {
      const next = Math.max(1, Math.trunc(quantity));
      setValue(
        value.map((line) => (line.id === id ? { ...line, quantity: next } : line)),
      );
    },
    [value, setValue],
  );

  const remove = React.useCallback(
    (id: string) => {
      setValue(value.filter((line) => line.id !== id));
    },
    [value, setValue],
  );

  const subtotal = React.useMemo(
    () => value.reduce((sum, line) => sum + lineTotal(products, line), 0),
    [products, value],
  );

  const savings = React.useMemo(
    () => (subtotal * discount) / 100,
    [subtotal, discount],
  );

  const total = subtotal - savings;

  const ctx = React.useMemo<Ctx>(
    () => ({
      products,
      value,
      discount,
      locale,
      currency,
      add,
      setQuantity,
      remove,
      setDiscount,
      subtotal,
      savings,
      total,
      nextId,
    }),
    [
      products,
      value,
      discount,
      locale,
      currency,
      add,
      setQuantity,
      remove,
      setDiscount,
      subtotal,
      savings,
      total,
      nextId,
    ],
  );

  return (
    <BundleBuilderContext.Provider value={ctx}>
      <div
        data-slot="bundle-builder"
        className={cn(
          "flex w-full flex-col gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </BundleBuilderContext.Provider>
  );
}

type BundlePickerProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  /** Placeholder shown in the picker before a product is chosen. */
  placeholder?: React.ReactNode;
  /** Label for the add button. */
  addLabel?: React.ReactNode;
  /** Render an add-button list instead of a Select. */
  variant?: "select" | "list";
};

function BundlePicker({
  placeholder = "Add a product",
  addLabel = "Add",
  variant = "select",
  className,
  ...props
}: BundlePickerProps) {
  const ctx = useBundleBuilder();
  const [selected, setSelected] = React.useState("");

  if (variant === "list") {
    return (
      <div
        data-slot="bundle-picker"
        data-variant="list"
        className={cn("flex flex-col gap-1.5", className)}
        {...props}
      >
        {ctx.products.map((product) => (
          <button
            key={product.id}
            type="button"
            data-slot="bundle-picker-item"
            onClick={() => ctx.add(product.id)}
            className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-start text-sm transition-colors hover:border-foreground hover:bg-accent"
          >
            <span className="min-w-0 truncate font-medium text-foreground">
              {product.name}
            </span>
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {formatPrice(product.price, ctx.locale, ctx.currency)}
              </span>
              <Plus className="size-3.5 text-muted-foreground" />
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      data-slot="bundle-picker"
      data-variant="select"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger
          data-slot="bundle-picker-trigger"
          className="flex-1"
          aria-label="Product"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {ctx.products.map((product) => (
            <SelectItem key={product.id} value={product.id}>
              <span className="flex w-full items-center justify-between gap-4">
                <span>{product.name}</span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {formatPrice(product.price, ctx.locale, ctx.currency)}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="outline"
        data-slot="bundle-picker-add"
        disabled={!selected}
        onClick={() => {
          if (!selected) return;
          ctx.add(selected);
          setSelected("");
        }}
      >
        <Plus />
        {addLabel}
      </Button>
    </div>
  );
}

type BundleItemsProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Shown when the bundle has no lines yet. */
  emptyHint?: React.ReactNode;
};

function BundleItems({
  className,
  emptyHint = "No products in the bundle yet.",
  ...props
}: BundleItemsProps) {
  const ctx = useBundleBuilder();

  if (ctx.value.length === 0) {
    return (
      <div
        data-slot="bundle-items"
        data-empty="true"
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground",
          className,
        )}
        {...props}
      >
        <Package className="size-5 text-muted-foreground" />
        {emptyHint}
      </div>
    );
  }

  return (
    <div
      data-slot="bundle-items"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {ctx.value.map((line) => (
        <BundleItem key={line.id} line={line} />
      ))}
    </div>
  );
}

type BundleItemProps = Omit<React.ComponentProps<"div">, "children"> & {
  line: BundleLine;
};

function BundleItem({ line, className, ...props }: BundleItemProps) {
  const ctx = useBundleBuilder();
  const product = productById(ctx.products, line.productId);
  if (!product) return null;

  return (
    <div
      data-slot="bundle-item"
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-md border border-border bg-background px-3 py-2",
        className,
      )}
      {...props}
    >
      <div data-slot="bundle-item-info" className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground">
          {product.name}
        </span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {formatPrice(product.price, ctx.locale, ctx.currency)} each
        </span>
      </div>

      <div
        data-slot="bundle-item-stepper"
        className="flex items-center gap-1 rounded-md border border-border p-0.5"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          data-slot="bundle-item-decrement"
          aria-label={`Decrease ${product.name} quantity`}
          disabled={line.quantity <= 1}
          onClick={() => ctx.setQuantity(line.id, line.quantity - 1)}
        >
          <Minus />
        </Button>
        <span
          data-slot="bundle-item-quantity"
          aria-live="polite"
          className="min-w-7 text-center font-mono text-sm tabular-nums text-foreground"
        >
          {line.quantity}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          data-slot="bundle-item-increment"
          aria-label={`Increase ${product.name} quantity`}
          onClick={() => ctx.setQuantity(line.id, line.quantity + 1)}
        >
          <Plus />
        </Button>
      </div>

      <span
        data-slot="bundle-item-total"
        className="w-20 text-end font-mono text-sm tabular-nums font-medium text-foreground"
      >
        {formatPrice(product.price * line.quantity, ctx.locale, ctx.currency)}
      </span>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        data-slot="bundle-item-remove"
        aria-label={`Remove ${product.name}`}
        onClick={() => ctx.remove(line.id)}
        className="text-muted-foreground"
      >
        <X />
      </Button>
    </div>
  );
}

type BundleSummaryProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Show the discount percentage input. */
  showDiscount?: boolean;
};

function BundleSummary({
  className,
  showDiscount = true,
  ...props
}: BundleSummaryProps) {
  const ctx = useBundleBuilder();
  const discountId = React.useId();

  return (
    <div
      data-slot="bundle-summary"
      className={cn(
        "flex flex-col gap-2 border-t border-border pt-4 text-sm",
        className,
      )}
      {...props}
    >
      <div
        data-slot="bundle-summary-row"
        className="flex items-center justify-between gap-3"
      >
        <span className="text-muted-foreground">Items</span>
        <span className="font-mono tabular-nums text-foreground">
          {formatPrice(ctx.subtotal, ctx.locale, ctx.currency)}
        </span>
      </div>

      {showDiscount ? (
        <div
          data-slot="bundle-summary-discount"
          className="flex items-center justify-between gap-3"
        >
          <label
            htmlFor={discountId}
            className="text-muted-foreground"
            data-slot="bundle-summary-discount-label"
          >
            Bundle discount
          </label>
          <div className="flex items-center gap-1.5">
            <Input
              id={discountId}
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              value={ctx.discount === 0 ? "" : String(ctx.discount)}
              placeholder="0"
              aria-label="Bundle discount percentage"
              data-slot="bundle-summary-discount-input"
              onChange={(event) => {
                const parsed = Number(event.target.value);
                ctx.setDiscount(Number.isFinite(parsed) ? parsed : 0);
              }}
              className="h-8 w-16 text-end font-mono tabular-nums"
            />
            <span className="text-muted-foreground">%</span>
          </div>
        </div>
      ) : null}

      {ctx.savings > 0 ? (
        <div
          data-slot="bundle-summary-savings"
          className="flex items-center justify-between gap-3"
        >
          <span className="text-muted-foreground">You save</span>
          <Badge variant="secondary" className="font-mono tabular-nums font-normal">
            −{formatPrice(ctx.savings, ctx.locale, ctx.currency)}
          </Badge>
        </div>
      ) : null}

      <div
        data-slot="bundle-summary-total"
        className="mt-1 flex items-center justify-between gap-3 border-t border-border pt-3 text-base font-semibold"
      >
        <span className="text-foreground">Bundle price</span>
        <span className="font-mono tabular-nums text-foreground">
          {formatPrice(ctx.total, ctx.locale, ctx.currency)}
        </span>
      </div>
    </div>
  );
}

export {
  BundleBuilder,
  BundlePicker,
  BundleItems,
  BundleItem,
  BundleSummary,
};

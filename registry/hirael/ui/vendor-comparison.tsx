"use client";

import * as React from "react";
import { Check, Minus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";

type Vendor = {
  id: string;
  name: string;
  recommended?: boolean;
};

type CellValue = boolean | string | number;

type Feature = {
  id: string;
  label: string;
  group?: string;
  values: Record<string, CellValue>;
};

type VendorComparisonContextValue = {
  vendors: Vendor[];
};

const VendorComparisonContext =
  React.createContext<VendorComparisonContextValue | null>(null);

function useVendorComparison() {
  const ctx = React.useContext(VendorComparisonContext);
  if (!ctx) {
    throw new Error(
      "VendorComparison compound parts must be used inside <VendorComparison>",
    );
  }
  return ctx;
}

export type VendorComparisonProps = React.ComponentProps<"div"> & {
  /** Columns of the table. Mark one vendor `recommended` to tint its column and label it. */
  vendors: Vendor[];
  /** Rows of the table. Pass to render config-driven; omit to compose rows as children. Group adjacent features with `group`. */
  features?: Feature[];
};

function VendorComparison({
  vendors,
  features,
  className,
  children,
  ...props
}: VendorComparisonProps) {
  const ctx = React.useMemo<VendorComparisonContextValue>(
    () => ({ vendors }),
    [vendors],
  );

  const grouped = React.useMemo(() => {
    if (!features) return [];
    const sections: { group?: string; items: Feature[] }[] = [];
    for (const feature of features) {
      const last = sections[sections.length - 1];
      if (last && last.group === feature.group) {
        last.items.push(feature);
      } else {
        sections.push({ group: feature.group, items: [feature] });
      }
    }
    return sections;
  }, [features]);

  return (
    <VendorComparisonContext.Provider value={ctx}>
      <div
        data-slot="vendor-comparison"
        className={cn(
          "relative w-full overflow-x-auto rounded-lg border border-border bg-card text-card-foreground",
          className,
        )}
        {...props}
      >
        <table
          data-slot="vendor-comparison-table"
          className="w-full border-collapse text-sm"
        >
          {children ?? (
            <>
              <VendorComparisonHeader />
              <tbody data-slot="vendor-comparison-body">
                {grouped.map((section, index) => (
                  <React.Fragment key={section.group ?? `section-${index}`}>
                    {section.group ? (
                      <VendorComparisonGroup>
                        {section.group}
                      </VendorComparisonGroup>
                    ) : null}
                    {section.items.map((feature) => (
                      <VendorComparisonRow key={feature.id} label={feature.label}>
                        {vendors.map((vendor) => (
                          <VendorComparisonCell
                            key={vendor.id}
                            value={feature.values[vendor.id]}
                            recommended={vendor.recommended}
                          />
                        ))}
                      </VendorComparisonRow>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
    </VendorComparisonContext.Provider>
  );
}

export type VendorComparisonHeaderProps = React.ComponentProps<"thead">;

function VendorComparisonHeader({
  className,
  ...props
}: VendorComparisonHeaderProps) {
  const { vendors } = useVendorComparison();
  return (
    <thead
      data-slot="vendor-comparison-header"
      className={cn("border-b border-border bg-muted/40", className)}
      {...props}
    >
      <tr data-slot="vendor-comparison-header-row">
        <th
          scope="col"
          data-slot="vendor-comparison-corner"
          className="sticky start-0 z-10 bg-muted/40 px-4 py-3 text-start align-bottom font-medium text-muted-foreground"
        >
          <span className="sr-only">Feature</span>
        </th>
        {vendors.map((vendor) => (
          <th
            key={vendor.id}
            scope="col"
            data-slot="vendor-comparison-vendor"
            data-recommended={vendor.recommended ? "" : undefined}
            className={cn(
              "px-4 py-3 text-center align-bottom font-medium text-foreground",
              vendor.recommended && "bg-primary/5",
            )}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span>{vendor.name}</span>
              {vendor.recommended ? (
                <Badge data-slot="vendor-comparison-badge">Recommended</Badge>
              ) : null}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}

export type VendorComparisonGroupProps = React.ComponentProps<"tr">;

function VendorComparisonGroup({
  className,
  children,
  ...props
}: VendorComparisonGroupProps) {
  const { vendors } = useVendorComparison();
  return (
    <tr
      data-slot="vendor-comparison-group"
      className={cn("border-b border-border bg-muted/20", className)}
      {...props}
    >
      <th
        scope="colgroup"
        colSpan={vendors.length + 1}
        className="sticky start-0 bg-muted/20 px-4 py-2 text-start text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground"
      >
        {children}
      </th>
    </tr>
  );
}

export type VendorComparisonRowProps = React.ComponentProps<"tr"> & {
  /** Feature name shown in the sticky start column. */
  label: React.ReactNode;
};

function VendorComparisonRow({
  label,
  className,
  children,
  ...props
}: VendorComparisonRowProps) {
  return (
    <tr
      data-slot="vendor-comparison-row"
      className={cn(
        "border-b border-border transition-colors last:border-b-0 hover:bg-accent/40",
        className,
      )}
      {...props}
    >
      <th
        scope="row"
        data-slot="vendor-comparison-label"
        className="sticky start-0 z-10 bg-card px-4 py-2.5 text-start font-normal text-foreground"
      >
        {label}
      </th>
      {children}
    </tr>
  );
}

export type VendorComparisonCellProps = Omit<
  React.ComponentProps<"td">,
  "children"
> & {
  /** Cell content. `true`/`false` render a check or x icon; strings and numbers render as text. */
  value?: CellValue;
  /** Tint the cell to match a recommended vendor column. */
  recommended?: boolean;
};

function VendorComparisonCell({
  value,
  recommended,
  className,
  ...props
}: VendorComparisonCellProps) {
  return (
    <td
      data-slot="vendor-comparison-cell"
      data-recommended={recommended ? "" : undefined}
      className={cn(
        "px-4 py-2.5 text-center",
        recommended && "bg-primary/5",
        className,
      )}
      {...props}
    >
      {typeof value === "boolean" ? (
        value ? (
          <>
            <Check
              aria-hidden
              className={cn(
                "mx-auto size-4",
                recommended ? "text-primary" : "text-foreground",
              )}
            />
            <span className="sr-only">Yes</span>
          </>
        ) : (
          <>
            <X aria-hidden className="mx-auto size-4 text-muted-foreground" />
            <span className="sr-only">No</span>
          </>
        )
      ) : value === undefined || value === "" ? (
        <>
          <Minus
            aria-hidden
            className="mx-auto size-4 text-muted-foreground"
          />
          <span className="sr-only">Not available</span>
        </>
      ) : (
        <span
          data-slot="vendor-comparison-value"
          className="font-mono text-xs text-foreground"
        >
          {value}
        </span>
      )}
    </td>
  );
}

export {
  VendorComparison,
  VendorComparisonHeader,
  VendorComparisonGroup,
  VendorComparisonRow,
  VendorComparisonCell,
};

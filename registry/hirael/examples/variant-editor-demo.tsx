"use client";

import * as React from "react";

import {
  VariantCount,
  VariantEditor,
  VariantOptions,
  VariantTable,
  type VariantOption,
  type VariantRow,
} from "@/registry/hirael/ui/variant-editor";

type ProductState = { options: VariantOption[]; rows: VariantRow[] };

const PRODUCT: ProductState = {
  options: [
    { id: "size", name: "Size", values: ["S", "M", "L"] },
    { id: "color", name: "Color", values: ["Black", "White"] },
  ],
  rows: [
    {
      id: "s-black",
      options: { Size: "S", Color: "Black" },
      price: "24.00",
      sku: "TEE-S-BLK",
      stock: "40",
    },
    {
      id: "s-white",
      options: { Size: "S", Color: "White" },
      price: "24.00",
      sku: "TEE-S-WHT",
      stock: "32",
    },
    {
      id: "m-black",
      options: { Size: "M", Color: "Black" },
      price: "26.00",
      sku: "TEE-M-BLK",
      stock: "55",
    },
    {
      id: "m-white",
      options: { Size: "M", Color: "White" },
      price: "26.00",
      sku: "TEE-M-WHT",
      stock: "48",
    },
    {
      id: "l-black",
      options: { Size: "L", Color: "Black" },
      price: "28.00",
      sku: "TEE-L-BLK",
      stock: "20",
    },
    {
      id: "l-white",
      options: { Size: "L", Color: "White" },
      price: "28.00",
      sku: "TEE-L-WHT",
      stock: "18",
    },
  ],
};

const PLAN: ProductState = {
  options: [{ id: "tier", name: "Tier", values: ["Monthly", "Yearly"] }],
  rows: [
    {
      id: "tier-monthly",
      options: { Tier: "Monthly" },
      price: "12.00",
      sku: "PLAN-M",
      stock: "",
    },
    {
      id: "tier-yearly",
      options: { Tier: "Yearly" },
      price: "120.00",
      sku: "PLAN-Y",
      stock: "",
    },
  ],
};

export default function VariantEditorDemo() {
  const [product, setProduct] = React.useState(PRODUCT);
  const [plan, setPlan] = React.useState(PLAN);

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <VariantEditor value={product} onValueChange={setProduct}>
        <VariantOptions />
        <VariantCount />
        <VariantTable />
      </VariantEditor>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium text-foreground">Billing plan</p>
        <VariantEditor value={plan} onValueChange={setPlan}>
          <VariantOptions addLabel="Add axis" />
          <VariantCount>
            {(count) => `${count} price ${count === 1 ? "point" : "points"}`}
          </VariantCount>
          <VariantTable emptyHint="Add a tier to set prices." />
        </VariantEditor>
      </div>
    </div>
  );
}

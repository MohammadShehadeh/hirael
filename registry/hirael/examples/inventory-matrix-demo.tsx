"use client";

import { InventoryMatrix } from "@/registry/hirael/ui/inventory-matrix";

export default function InventoryMatrixDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <InventoryMatrix
        variants={[
          { id: "s", label: "S" },
          { id: "m", label: "M" },
          { id: "l", label: "L" },
          { id: "xl", label: "XL" },
        ]}
        locations={[
          { id: "berlin", label: "Berlin" },
          { id: "austin", label: "Austin" },
          { id: "tokyo", label: "Tokyo" },
        ]}
        defaultValue={{
          s: { berlin: 24, austin: 12, tokyo: 4 },
          m: { berlin: 40, austin: 31, tokyo: 18 },
          l: { berlin: 3, austin: 0, tokyo: 9 },
          xl: { berlin: 0, austin: 2, tokyo: 5 },
        }}
      />

      <InventoryMatrix
        variants={[
          { id: "sku-101", label: "SKU 101" },
          { id: "sku-102", label: "SKU 102" },
        ]}
        locations={[
          { id: "shelf", label: "Shelf" },
          { id: "backroom", label: "Backroom" },
        ]}
        lowStockThreshold={10}
        defaultValue={{
          "sku-101": { shelf: 6, backroom: 22 },
          "sku-102": { shelf: 0, backroom: 8 },
        }}
      />
    </div>
  );
}

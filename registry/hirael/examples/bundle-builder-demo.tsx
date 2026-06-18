"use client";

import * as React from "react";

import {
  BundleBuilder,
  BundleItems,
  BundlePicker,
  BundleSummary,
  type BundleLine,
} from "@/registry/hirael/ui/bundle-builder";

const PRODUCTS = [
  { id: "keyboard", name: "Mechanical Keyboard", price: 129 },
  { id: "mouse", name: "Wireless Mouse", price: 59 },
  { id: "mat", name: "Desk Mat", price: 35 },
  { id: "wrist-rest", name: "Wrist Rest", price: 24 },
  { id: "hub", name: "USB-C Hub", price: 49 },
];

const WORKSHOP = [
  { id: "fundamentals", name: "Fundamentals Course", price: 80 },
  { id: "advanced", name: "Advanced Course", price: 120 },
  { id: "templates", name: "Template Pack", price: 40 },
];

export default function BundleBuilderDemo() {
  const [lines, setLines] = React.useState<BundleLine[]>([
    { id: "line-keyboard", productId: "keyboard", quantity: 1 },
    { id: "line-mouse", productId: "mouse", quantity: 1 },
    { id: "line-mat", productId: "mat", quantity: 2 },
  ]);

  return (
    <div className="grid w-full max-w-xl gap-8">
      <BundleBuilder
        products={PRODUCTS}
        value={lines}
        onValueChange={setLines}
        defaultDiscount={10}
      >
        <BundlePicker />
        <BundleItems />
        <BundleSummary />
      </BundleBuilder>

      <BundleBuilder products={WORKSHOP} defaultDiscount={15}>
        <BundlePicker variant="list" />
        <BundleItems emptyHint="Pick a course to start your bundle." />
        <BundleSummary />
      </BundleBuilder>
    </div>
  );
}

"use client";

import { Bold, Italic, Link2, Strikethrough, Underline } from "lucide-react";

import {
  FloatingToolbar,
  FloatingToolbarButton,
  FloatingToolbarLabel,
  FloatingToolbarSeparator,
} from "@/registry/hirael/ui/floating-toolbar";

export default function FloatingToolbarDemo() {
  return (
    <div className="flex w-full max-w-xl justify-center py-6">
      <FloatingToolbar>
        <FloatingToolbarLabel>Aa</FloatingToolbarLabel>
        <FloatingToolbarSeparator />
        <FloatingToolbarButton active aria-label="Bold">
          <Bold />
        </FloatingToolbarButton>
        <FloatingToolbarButton aria-label="Italic">
          <Italic />
        </FloatingToolbarButton>
        <FloatingToolbarButton aria-label="Underline">
          <Underline />
        </FloatingToolbarButton>
        <FloatingToolbarButton aria-label="Strikethrough">
          <Strikethrough />
        </FloatingToolbarButton>
        <FloatingToolbarSeparator />
        <FloatingToolbarButton aria-label="Add link">
          <Link2 />
          Link
        </FloatingToolbarButton>
      </FloatingToolbar>
    </div>
  );
}

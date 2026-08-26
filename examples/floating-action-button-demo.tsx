"use client";

import { ImageIcon, Link2, Plus, Type } from "lucide-react";

import { useT } from "@/lib/demo-locale";
import {
  FloatingActionButton,
  FloatingActionButtonItem,
  FloatingActionButtonList,
  FloatingActionButtonTrigger,
} from "@/registry/hirael/components/floating-action-button";

const FloatingActionButtonDemo = () => {
  const t = useT();

  return (
    <div className="flex h-60 w-full max-w-xl items-end justify-center">
      <FloatingActionButton>
        <FloatingActionButtonList>
          <FloatingActionButtonItem
            aria-label={t({ en: "Add text", ar: "إضافة نص" })}
          >
            <Type />
          </FloatingActionButtonItem>
          <FloatingActionButtonItem
            aria-label={t({ en: "Add image", ar: "إضافة صورة" })}
          >
            <ImageIcon />
          </FloatingActionButtonItem>
          <FloatingActionButtonItem
            aria-label={t({ en: "Add link", ar: "إضافة رابط" })}
          >
            <Link2 />
          </FloatingActionButtonItem>
        </FloatingActionButtonList>
        <FloatingActionButtonTrigger
          aria-label={t({ en: "Create", ar: "إنشاء" })}
        >
          <Plus />
        </FloatingActionButtonTrigger>
      </FloatingActionButton>
    </div>
  );
};

export default FloatingActionButtonDemo;

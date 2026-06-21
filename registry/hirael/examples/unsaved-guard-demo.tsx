"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useT } from "@/lib/demo-locale";
import { Button } from "@/registry/hirael/ui/button";
import { Input } from "@/registry/hirael/ui/input";
import {
  UnsavedGuardProvider,
  useUnsavedGuard,
} from "@/registry/hirael/ui/unsaved-guard";

type Tab = "profile" | "billing";

function UnsavedGuardDemoInner() {
  const t = useT();
  const [tab, setTab] = React.useState<Tab>("profile");
  const [name, setName] = React.useState("Mohammad Shehadeh");
  const [savedName, setSavedName] = React.useState("Mohammad Shehadeh");
  const dirty = name !== savedName;

  const guard = useUnsavedGuard({
    when: dirty,
    title: t({ en: "Discard changes?", ar: "تجاهل التغييرات؟" }),
    description: t({
      en: "Your profile edits haven't been saved yet.",
      ar: "لم تُحفظ تعديلات ملفك الشخصي بعد.",
    }),
    confirmText: t({ en: "Discard", ar: "تجاهل" }),
    cancelText: t({ en: "Keep editing", ar: "متابعة التحرير" }),
  });

  function goTo(next: Tab) {
    if (next === tab) return;
    void guard(() => {
      setName(savedName);
      setTab(next);
    });
  }

  const tabs: { id: Tab; label: React.ReactNode }[] = [
    { id: "profile", label: t({ en: "Profile", ar: "الملف الشخصي" }) },
    { id: "billing", label: t({ en: "Billing", ar: "الفوترة" }) },
  ];

  return (
    <div className="grid w-full max-w-sm gap-4">
      <div role="tablist" className="flex gap-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => goTo(item.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab === item.id
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "profile" ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSavedName(name);
          }}
          className="grid gap-3"
        >
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">
              {t({ en: "Display name", ar: "الاسم الظاهر" })}
            </span>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" disabled={!dirty}>
              {t({ en: "Save", ar: "حفظ" })}
            </Button>
            <span className="text-xs text-muted-foreground">
              {dirty
                ? t({ en: "Unsaved changes", ar: "تغييرات غير محفوظة" })
                : t({ en: "All changes saved", ar: "حُفظت كل التغييرات" })}
            </span>
          </div>
        </form>
      ) : (
        <p className="rounded-md border border-border bg-card p-4 text-sm text-muted-foreground">
          {t({
            en: "Edit your name on Profile, then switch tabs to trigger the guard.",
            ar: "عدّل اسمك في تبويب الملف الشخصي ثم بدّل التبويب لتشغيل الحارس.",
          })}
        </p>
      )}
    </div>
  );
}

export default function UnsavedGuardDemo() {
  return (
    <UnsavedGuardProvider beforeUnload={false}>
      <UnsavedGuardDemoInner />
    </UnsavedGuardProvider>
  );
}

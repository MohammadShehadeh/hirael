"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Button } from "@/registry/hirael/ui/button";
import { Field, FieldLabel } from "@/registry/hirael/ui/field";
import { Input } from "@/registry/hirael/ui/input";
import {
  UnsavedGuardProvider,
  useUnsavedGuard,
} from "@/registry/hirael/components/unsaved-guard";

type Tab = "profile" | "billing";

const UnsavedGuardDemoInner = () => {
  const t = useT();
  const nameId = React.useId();
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
          <Button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            variant={tab === item.id ? "secondary" : "ghost"}
            size="sm"
            onClick={() => goTo(item.id)}
          >
            {item.label}
          </Button>
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
          <Field className="gap-1.5">
            <FieldLabel htmlFor={nameId}>
              {t({ en: "Display name", ar: "الاسم الظاهر" })}
            </FieldLabel>
            <Input
              id={nameId}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
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
};

const UnsavedGuardDemo = () => {
  return (
    <UnsavedGuardProvider beforeUnload={false}>
      <UnsavedGuardDemoInner />
    </UnsavedGuardProvider>
  );
};

export default UnsavedGuardDemo;

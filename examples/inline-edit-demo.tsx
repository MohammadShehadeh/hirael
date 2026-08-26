"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import {
  InlineEdit,
  InlineEditControls,
  InlineEditInput,
  InlineEditPreview,
  InlineEditTextarea,
} from "@/registry/hirael/components/inline-edit";

const InlineEditDemo = () => {
  const t = useT();
  const [title, setTitle] = React.useState(
    t({ en: "Quarterly revenue report", ar: "تقرير الإيرادات الفصلي" }),
  );

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Single-line · title", ar: "سطر واحد · عنوان" })}
        </p>
        <InlineEdit
          value={title}
          onValueChange={setTitle}
          placeholder={t({ en: "Untitled document", ar: "مستند بلا عنوان" })}
          aria-label={t({ en: "Document title", ar: "عنوان المستند" })}
        >
          <div className="flex items-center gap-2">
            <InlineEditPreview className="text-sm font-medium" />
            <InlineEditInput
              aria-label={t({
                en: "Edit document title",
                ar: "تعديل عنوان المستند",
              })}
            />
            <InlineEditControls />
          </div>
        </InlineEdit>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Textarea · validation + async submit",
            ar: "منطقة نص · تحقق + إرسال غير متزامن",
          })}
        </p>
        <InlineEdit
          defaultValue={t({
            en: "Design systems engineer shipping accessible component registries.",
            ar: "مهندس أنظمة تصميم يطلق سجلّات مكوّنات سهلة الوصول.",
          })}
          placeholder={t({ en: "Add a short bio", ar: "أضف نبذة قصيرة" })}
          validate={(value) =>
            value.trim().length < 10
              ? t({
                  en: "Bio must be at least 10 characters",
                  ar: "يجب ألا تقل النبذة عن 10 أحرف",
                })
              : null
          }
          onSubmit={async () => {
            await new Promise((resolve) => setTimeout(resolve, 800));
          }}
        >
          <div className="grid gap-2">
            <InlineEditPreview className="text-sm leading-relaxed" />
            <InlineEditTextarea
              aria-label={t({ en: "Edit bio", ar: "تعديل النبذة" })}
              rows={3}
            />
            <InlineEditControls className="justify-end" />
          </div>
        </InlineEdit>
        <p className="text-xs text-muted-foreground">
          {t({
            en: "Cmd/Ctrl + Enter submits, Escape cancels. Saving takes 800ms.",
            ar: "Cmd/Ctrl + Enter يرسل، وEscape يلغي. يستغرق الحفظ 800 جزء من الثانية.",
          })}
        </p>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "asChild · heading", ar: "asChild · عنوان" })}
        </p>
        <InlineEdit
          defaultValue={t({
            en: "Release notes v2.4",
            ar: "ملاحظات الإصدار v2.4",
          })}
          required
        >
          <div className="flex items-center gap-2">
            <InlineEditPreview asChild>
              <h3 className="text-lg font-semibold tracking-tight" />
            </InlineEditPreview>
            <InlineEditInput
              aria-label={t({ en: "Edit heading", ar: "تعديل العنوان" })}
            />
            <InlineEditControls />
          </div>
        </InlineEdit>
      </div>
    </div>
  );
};

export default InlineEditDemo;

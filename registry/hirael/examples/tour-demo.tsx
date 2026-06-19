"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import { Tour, TourTrigger, type TourStep } from "@/registry/hirael/ui/tour";

export default function TourDemo() {
  const t = useT();
  const [completed, setCompleted] = React.useState(false);

  const steps: TourStep[] = [
    {
      target: "#tour-demo-profile",
      title: t({ en: "Your profile", ar: "ملفك الشخصي" }),
      description: t({
        en: "Update your display name and avatar. Changes are visible to your whole team.",
        ar: "حدّث اسمك الظاهر وصورتك. التغييرات مرئية لفريقك بالكامل.",
      }),
      side: "bottom",
    },
    {
      target: "#tour-demo-notifications",
      title: t({ en: "Notifications", ar: "الإشعارات" }),
      description: t({
        en: "Choose how noisy we are. Digest mode batches everything.",
        ar: "اختر مقدار التنبيهات. يجمع وضع الموجز كل شيء دفعة واحدة.",
      }),
      side: "left",
    },
    {
      target: "#tour-demo-api-keys",
      title: t({ en: "API keys", ar: "مفاتيح API" }),
      description: t({
        en: "Create scoped keys for CI and local development.",
        ar: "أنشئ مفاتيح محدّدة النطاق للتكامل المستمر والتطوير المحلي.",
      }),
      side: "right",
    },
    {
      target: "#tour-demo-danger",
      title: t({ en: "Danger zone", ar: "منطقة الخطر" }),
      description: t({
        en: "Deleting the workspace is permanent. No undo, no backups.",
        ar: "حذف مساحة العمل نهائي. لا تراجع، ولا نسخ احتياطية.",
      }),
      side: "top",
    },
  ];

  const tourLabels = t({
    en: { next: "Next", back: "Back", skip: "Skip", finish: "Finish" },
    ar: { next: "التالي", back: "السابق", skip: "تخطّي", finish: "إنهاء" },
  });

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Spotlight tour · 4 steps", ar: "جولة مضيئة · 4 خطوات" })}
        </p>
        <Tour
          steps={steps}
          labels={tourLabels}
          onFinish={() => setCompleted(true)}
        >
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <TourTrigger variant="outline" size="sm">
                {t({ en: "Start tour", ar: "ابدأ الجولة" })}
              </TourTrigger>
              {completed && (
                <Badge variant="outline">
                  {t({ en: "Tour completed", ar: "اكتملت الجولة" })}
                </Badge>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div
                id="tour-demo-profile"
                className="rounded-md border border-border bg-card p-4 sm:col-span-2"
              >
                <p className="text-sm font-medium">
                  {t({ en: "Profile", ar: "الملف الشخصي" })}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mohammad Shehadeh · mohammad@hirael.com
                </p>
                <Button variant="secondary" size="sm" className="mt-3">
                  {t({ en: "Edit profile", ar: "تعديل الملف الشخصي" })}
                </Button>
              </div>
              <div
                id="tour-demo-notifications"
                className="rounded-md border border-border bg-card p-4"
              >
                <p className="text-sm font-medium">
                  {t({ en: "Notifications", ar: "الإشعارات" })}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t({
                    en: "Weekly digest · mentions only",
                    ar: "موجز أسبوعي · الإشارات فقط",
                  })}
                </p>
              </div>
              <div
                id="tour-demo-api-keys"
                className="rounded-md border border-border bg-card p-4"
              >
                <p className="text-sm font-medium">
                  {t({ en: "API keys", ar: "مفاتيح API" })}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  hr_live_••••••••3f2a
                </p>
              </div>
              <div
                id="tour-demo-danger"
                className="rounded-md border border-destructive/40 bg-card p-4 sm:col-span-2"
              >
                <p className="text-sm font-medium text-destructive">
                  {t({ en: "Danger zone", ar: "منطقة الخطر" })}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t({
                    en: "Delete this workspace and all of its data.",
                    ar: "حذف مساحة العمل هذه وكل بياناتها.",
                  })}
                </p>
              </div>
            </div>
          </div>
        </Tour>
      </div>
    </div>
  );
}

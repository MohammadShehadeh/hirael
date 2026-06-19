"use client";

import { useT } from "@/lib/demo-locale";
import {
  BillingCard,
  BillingCardEyebrow,
  BillingCardFooter,
  BillingCardHeader,
  BillingCardMeter,
  BillingCardPlan,
  BillingCardPrice,
  BillingCardRow,
} from "@/registry/hirael/ui/billing-card";

export default function BillingCardDemo() {
  const t = useT();

  return (
    <BillingCard className="w-full max-w-sm">
      <BillingCardHeader>
        <div className="flex flex-col gap-1">
          <BillingCardEyebrow>
            {t({ en: "Current plan", ar: "الخطة الحالية" })}
          </BillingCardEyebrow>
          <BillingCardPlan>{t({ en: "Scale", ar: "التوسّع" })}</BillingCardPlan>
        </div>
        <BillingCardPrice cycle="mo">$99</BillingCardPrice>
      </BillingCardHeader>

      <BillingCardMeter
        value={18}
        max={25}
        label={t({ en: "Seats used", ar: "المقاعد المستخدمة" })}
      />

      <div className="flex flex-col gap-2">
        <BillingCardRow label={t({ en: "Renews on", ar: "يتجدد في" })}>
          Jul 1, 2026
        </BillingCardRow>
        <BillingCardRow label={t({ en: "Payment", ar: "الدفع" })}>
          {t({ en: "Visa ending 4242", ar: "‏Visa تنتهي بـ 4242" })}
        </BillingCardRow>
      </div>

      <BillingCardFooter>
        <button
          type="button"
          className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t({ en: "Manage billing", ar: "إدارة الفواتير" })}
        </button>
        <button
          type="button"
          className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t({ en: "Upgrade", ar: "ترقية" })}
        </button>
      </BillingCardFooter>
    </BillingCard>
  );
}

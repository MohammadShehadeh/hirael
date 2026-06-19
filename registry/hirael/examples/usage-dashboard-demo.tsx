"use client";

import { useT } from "@/lib/demo-locale";
import {
  UsageDashboard,
  UsageDashboardHeader,
  UsageDashboardTitle,
  UsageItem,
  UsageList,
} from "@/registry/hirael/ui/usage-dashboard";

export default function UsageDashboardDemo() {
  const t = useT();

  return (
    <UsageDashboard className="w-full max-w-md">
      <UsageDashboardHeader>
        <UsageDashboardTitle>
          {t({ en: "Usage this month", ar: "الاستخدام هذا الشهر" })}
        </UsageDashboardTitle>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Resets Jul 1", ar: "يُعاد الضبط في 1 يوليو" })}
        </span>
      </UsageDashboardHeader>
      <UsageList>
        <UsageItem
          label={t({ en: "API requests", ar: "طلبات API" })}
          value={82000}
          max={100000}
          caption="82k / 100k"
        />
        <UsageItem
          label={t({ en: "Storage", ar: "التخزين" })}
          value={46}
          max={50}
          caption="46 / 50 GB"
        />
        <UsageItem
          label={t({ en: "Seats", ar: "المقاعد" })}
          value={18}
          max={25}
          caption="18 / 25"
        />
        <UsageItem
          label={t({ en: "Email sends", ar: "رسائل البريد المُرسَلة" })}
          value={5200}
          max={5000}
          caption="5.2k / 5k"
        />
      </UsageList>
    </UsageDashboard>
  );
}

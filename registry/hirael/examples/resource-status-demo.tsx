"use client";

import { useT } from "@/lib/demo-locale";
import {
  ResourceStatus,
  ResourceStatusBanner,
  ResourceStatusItem,
  ResourceStatusList,
} from "@/registry/hirael/components/resource-status";

export default function ResourceStatusDemo() {
  const t = useT();

  return (
    <ResourceStatus className="w-full max-w-lg">
      <ResourceStatusBanner state="degraded">
        {t({ en: "Some systems degraded", ar: "بعض الأنظمة متدهورة" })}
      </ResourceStatusBanner>
      <ResourceStatusList>
        <ResourceStatusItem
          name={t({ en: "API", ar: "الواجهة البرمجية" })}
          description={t({ en: "REST + GraphQL", ar: "‏REST + GraphQL" })}
          state="operational"
          uptime="99.98%"
        />
        <ResourceStatusItem
          name={t({ en: "Dashboard", ar: "لوحة التحكم" })}
          description={t({ en: "app.example.com", ar: "‏app.example.com" })}
          state="operational"
          uptime="99.95%"
        />
        <ResourceStatusItem
          name={t({ en: "Webhooks", ar: "الويب هوك" })}
          description={t({
            en: "Elevated delivery latency",
            ar: "زمن تسليم مرتفع",
          })}
          state="degraded"
          uptime="99.10%"
        />
        <ResourceStatusItem
          name={t({ en: "Background jobs", ar: "المهام الخلفية" })}
          description={t({ en: "Queue backed up", ar: "تراكم في الطابور" })}
          state="partial-outage"
          uptime="97.40%"
        />
        <ResourceStatusItem
          name={t({ en: "Object storage", ar: "التخزين" })}
          description={t({ en: "Scheduled migration", ar: "ترحيل مجدول" })}
          state="maintenance"
          uptime="99.99%"
        />
      </ResourceStatusList>
    </ResourceStatus>
  );
}

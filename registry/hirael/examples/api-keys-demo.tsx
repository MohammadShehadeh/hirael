"use client";

import { Plus } from "lucide-react";

import { useT } from "@/lib/demo-locale";
import {
  ApiKeyItem,
  ApiKeyMeta,
  ApiKeyName,
  ApiKeyValue,
  ApiKeys,
  ApiKeysHeader,
  ApiKeysList,
  ApiKeysTitle,
} from "@/registry/hirael/ui/api-keys";

export default function ApiKeysDemo() {
  const t = useT();

  const KEYS = [
    {
      label: t({ en: "Production", ar: "الإنتاج" }),
      created: t({ en: "Created Mar 4", ar: "أُنشئ في 4 مارس" }),
      used: t({ en: "Used 2h ago", ar: "استُخدم قبل ساعتين" }),
      value: "sk_live_9f8a7b6c5d4e3f2a1b0c",
    },
    {
      label: t({ en: "Development", ar: "التطوير" }),
      created: t({ en: "Created Apr 18", ar: "أُنشئ في 18 أبريل" }),
      used: t({ en: "Used 5d ago", ar: "استُخدم قبل 5 أيام" }),
      value: "sk_test_1a2b3c4d5e6f7g8h9i0j",
    },
  ];

  return (
    <ApiKeys className="w-full max-w-xl">
      <ApiKeysHeader>
        <ApiKeysTitle>{t({ en: "API keys", ar: "مفاتيح API" })}</ApiKeysTitle>
        <button
          type="button"
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:size-3.5"
        >
          <Plus />
          {t({ en: "Create key", ar: "إنشاء مفتاح" })}
        </button>
      </ApiKeysHeader>
      <ApiKeysList>
        {KEYS.map((key) => (
          <ApiKeyItem key={key.label}>
            <ApiKeyName label={key.label}>{key.created}</ApiKeyName>
            <ApiKeyValue value={key.value} className="ms-auto" />
            <ApiKeyMeta>{key.used}</ApiKeyMeta>
          </ApiKeyItem>
        ))}
      </ApiKeysList>
    </ApiKeys>
  );
}

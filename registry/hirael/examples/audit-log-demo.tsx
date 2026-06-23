"use client";

import { useT } from "@/lib/demo-locale";
import {
  AuditLog,
  AuditLogAction,
  AuditLogActor,
  AuditLogDetail,
  AuditLogField,
  AuditLogItem,
  AuditLogStatus,
  AuditLogTime,
  AuditLogTrigger,
} from "@/registry/hirael/components/audit-log";

export default function AuditLogDemo() {
  const t = useT();

  return (
    <div className="grid w-full max-w-2xl gap-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {t({ en: "Recent events", ar: "الأحداث الأخيرة" })}
      </p>
      <AuditLog>
        <AuditLogItem defaultOpen>
          <AuditLogTrigger>
            <AuditLogActor>lena.park</AuditLogActor>
            <AuditLogAction>
              {t({
                en: "updated billing settings",
                ar: "حدّث إعدادات الفواتير",
              })}
            </AuditLogAction>
            <AuditLogStatus tone="success" className="ms-auto">
              200
            </AuditLogStatus>
            <AuditLogTime className="ms-0">14:20 UTC</AuditLogTime>
          </AuditLogTrigger>
          <AuditLogDetail>
            <AuditLogField label={t({ en: "Actor", ar: "الفاعل" })}>
              lena.park@acme.co
            </AuditLogField>
            <AuditLogField label={t({ en: "IP", ar: "عنوان IP" })}>
              192.0.2.51
            </AuditLogField>
            <AuditLogField label={t({ en: "Location", ar: "الموقع" })}>
              {t({ en: "Lisbon, PT", ar: "لشبونة، البرتغال" })}
            </AuditLogField>
            <AuditLogField label={t({ en: "Changed", ar: "التغييرات" })}>
              {t({
                en: "plan: pro → scale, seats: 10 → 25",
                ar: "الخطة: الاحترافي ← التوسّع، المقاعد: 10 ← 25",
              })}
            </AuditLogField>
          </AuditLogDetail>
        </AuditLogItem>

        <AuditLogItem>
          <AuditLogTrigger>
            <AuditLogActor>api/token</AuditLogActor>
            <AuditLogAction>
              {t({ en: "created a new API key", ar: "أنشأ مفتاح API جديدًا" })}
            </AuditLogAction>
            <AuditLogStatus tone="success" className="ms-auto">
              201
            </AuditLogStatus>
            <AuditLogTime className="ms-0">13:02 UTC</AuditLogTime>
          </AuditLogTrigger>
          <AuditLogDetail>
            <AuditLogField label={t({ en: "Key", ar: "المفتاح" })}>
              sk_live_••••8f21
            </AuditLogField>
            <AuditLogField label={t({ en: "Scopes", ar: "الصلاحيات" })}>
              read, write
            </AuditLogField>
            <AuditLogField label={t({ en: "IP", ar: "عنوان IP" })}>
              203.0.113.9
            </AuditLogField>
          </AuditLogDetail>
        </AuditLogItem>

        <AuditLogItem>
          <AuditLogTrigger>
            <AuditLogActor>theo.adams</AuditLogActor>
            <AuditLogAction>
              {t({
                en: "failed sign-in attempt",
                ar: "محاولة تسجيل دخول فاشلة",
              })}
            </AuditLogAction>
            <AuditLogStatus tone="danger" className="ms-auto">
              401
            </AuditLogStatus>
            <AuditLogTime className="ms-0">11:47 UTC</AuditLogTime>
          </AuditLogTrigger>
          <AuditLogDetail>
            <AuditLogField label={t({ en: "Reason", ar: "السبب" })}>
              {t({ en: "invalid password", ar: "كلمة مرور غير صحيحة" })}
            </AuditLogField>
            <AuditLogField label={t({ en: "IP", ar: "عنوان IP" })}>
              198.51.100.7
            </AuditLogField>
            <AuditLogField label={t({ en: "Attempts", ar: "المحاولات" })}>
              {t({ en: "3 in 5 min", ar: "3 خلال 5 دقائق" })}
            </AuditLogField>
          </AuditLogDetail>
        </AuditLogItem>
      </AuditLog>
    </div>
  );
}

"use client";

import { useT } from "@/lib/demo-locale";
import { Callout } from "@/registry/hirael/ui/callout";

export default function CalloutDemo() {
  const t = useT();

  return (
    <div className="grid w-full max-w-2xl gap-4">
      <Callout variant="info" title={t({ en: "Heads up", ar: "تنبيه" })}>
        {t({
          en: "Cache invalidation runs every 60 seconds. Edits may take a moment to appear.",
          ar: "يُعاد ضبط الذاكرة المؤقتة كل 60 ثانية. قد تستغرق التعديلات لحظة لتظهر.",
        })}
      </Callout>

      <Callout
        variant="success"
        title={t({ en: "Deploy succeeded", ar: "نجح النشر" })}
      >
        {t({
          en: (
            <>
              Build <code className="font-mono">b-29f1</code> is now live on
              production.
            </>
          ),
          ar: (
            <>
              الإصدار <code className="font-mono">b-29f1</code> يعمل الآن على
              الإنتاج.
            </>
          ),
        })}
      </Callout>

      <Callout
        variant="warning"
        title={t({ en: "Rate limit approaching", ar: "اقتراب حد الطلبات" })}
      >
        {t({
          en: "You've used 87% of your monthly quota. Consider upgrading before the reset.",
          ar: "لقد استهلكت 87% من حصتك الشهرية. ننصح بالترقية قبل إعادة الضبط.",
        })}
      </Callout>

      <Callout
        variant="error"
        title={t({ en: "Migration failed", ar: "فشل الترحيل" })}
      >
        {t({
          en: (
            <>
              Column <code className="font-mono">users.email</code> already
              exists. Roll back before retrying.
            </>
          ),
          ar: (
            <>
              العمود <code className="font-mono">users.email</code> موجود
              بالفعل. تراجع قبل إعادة المحاولة.
            </>
          ),
        })}
      </Callout>

      <Callout variant="neutral" title={t({ en: "Note", ar: "ملاحظة" })}>
        {t({
          en: "This component is server-renderable. No hooks, no client boundary.",
          ar: "هذا المكوّن قابل للعرض على الخادم. بلا خطافات، بلا حدود عميل.",
        })}
      </Callout>

      <Callout variant="info" icon={false}>
        {t({
          en: (
            <>
              Title-less callouts also work. Pass{" "}
              <code className="font-mono">icon={`{false}`}</code> to drop the
              leading icon.
            </>
          ),
          ar: (
            <>
              التنبيهات بلا عنوان تعمل أيضًا. مرّر{" "}
              <code className="font-mono">icon={`{false}`}</code> لإزالة
              الأيقونة الأمامية.
            </>
          ),
        })}
      </Callout>
    </div>
  );
}

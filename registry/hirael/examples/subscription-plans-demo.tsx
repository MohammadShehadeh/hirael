"use client";

import { useT } from "@/lib/demo-locale";
import {
  SubscriptionPlan,
  SubscriptionPlanAction,
  SubscriptionPlanBadge,
  SubscriptionPlanDescription,
  SubscriptionPlanFeature,
  SubscriptionPlanFeatures,
  SubscriptionPlanName,
  SubscriptionPlanPrice,
  SubscriptionPlans,
} from "@/registry/hirael/components/subscription-plans";

export default function SubscriptionPlansDemo() {
  const t = useT();

  return (
    <SubscriptionPlans className="w-full max-w-3xl">
      <SubscriptionPlan>
        <SubscriptionPlanName>
          {t({ en: "Starter", ar: "المبتدئ" })}
        </SubscriptionPlanName>
        <SubscriptionPlanPrice cycle="mo">$0</SubscriptionPlanPrice>
        <SubscriptionPlanDescription>
          {t({
            en: "For side projects and trials.",
            ar: "للمشاريع الجانبية والتجارب.",
          })}
        </SubscriptionPlanDescription>
        <SubscriptionPlanFeatures>
          <SubscriptionPlanFeature>
            {t({ en: "1 project", ar: "مشروع واحد" })}
          </SubscriptionPlanFeature>
          <SubscriptionPlanFeature>
            {t({ en: "Community support", ar: "دعم المجتمع" })}
          </SubscriptionPlanFeature>
          <SubscriptionPlanFeature>
            {t({ en: "1k requests / day", ar: "1000 طلب / يوم" })}
          </SubscriptionPlanFeature>
        </SubscriptionPlanFeatures>
        <SubscriptionPlanAction>
          {t({ en: "Choose Starter", ar: "اختيار المبتدئ" })}
        </SubscriptionPlanAction>
      </SubscriptionPlan>

      <SubscriptionPlan featured>
        <SubscriptionPlanBadge>
          {t({ en: "Popular", ar: "الأكثر شيوعًا" })}
        </SubscriptionPlanBadge>
        <SubscriptionPlanName>
          {t({ en: "Pro", ar: "الاحترافي" })}
        </SubscriptionPlanName>
        <SubscriptionPlanPrice cycle="mo">$29</SubscriptionPlanPrice>
        <SubscriptionPlanDescription>
          {t({
            en: "For growing teams shipping fast.",
            ar: "للفرق النامية التي تطلق بسرعة.",
          })}
        </SubscriptionPlanDescription>
        <SubscriptionPlanFeatures>
          <SubscriptionPlanFeature>
            {t({ en: "Unlimited projects", ar: "مشاريع غير محدودة" })}
          </SubscriptionPlanFeature>
          <SubscriptionPlanFeature>
            {t({ en: "Priority support", ar: "دعم ذو أولوية" })}
          </SubscriptionPlanFeature>
          <SubscriptionPlanFeature>
            {t({ en: "100k requests / day", ar: "100 ألف طلب / يوم" })}
          </SubscriptionPlanFeature>
          <SubscriptionPlanFeature>
            {t({ en: "Audit log", ar: "سجل التدقيق" })}
          </SubscriptionPlanFeature>
        </SubscriptionPlanFeatures>
        <SubscriptionPlanAction variant="primary">
          {t({ en: "Upgrade to Pro", ar: "الترقية إلى الاحترافي" })}
        </SubscriptionPlanAction>
      </SubscriptionPlan>

      <SubscriptionPlan current>
        <SubscriptionPlanBadge>
          {t({ en: "Current", ar: "الحالية" })}
        </SubscriptionPlanBadge>
        <SubscriptionPlanName>
          {t({ en: "Scale", ar: "التوسّع" })}
        </SubscriptionPlanName>
        <SubscriptionPlanPrice cycle="mo">$99</SubscriptionPlanPrice>
        <SubscriptionPlanDescription>
          {t({
            en: "For high-volume production.",
            ar: "للإنتاج عالي الحجم.",
          })}
        </SubscriptionPlanDescription>
        <SubscriptionPlanFeatures>
          <SubscriptionPlanFeature>
            {t({ en: "Everything in Pro", ar: "كل ما في الاحترافي" })}
          </SubscriptionPlanFeature>
          <SubscriptionPlanFeature>
            {t({ en: <>SSO &amp; SAML</>, ar: <>SSO و SAML</> })}
          </SubscriptionPlanFeature>
          <SubscriptionPlanFeature>
            {t({ en: "Unlimited requests", ar: "طلبات غير محدودة" })}
          </SubscriptionPlanFeature>
        </SubscriptionPlanFeatures>
        <SubscriptionPlanAction disabled>
          {t({ en: "Current plan", ar: "الخطة الحالية" })}
        </SubscriptionPlanAction>
      </SubscriptionPlan>
    </SubscriptionPlans>
  );
}

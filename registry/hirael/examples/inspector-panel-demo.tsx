"use client";

import { useT } from "@/lib/demo-locale";
import {
  InspectorPanel,
  InspectorPanelHeader,
  InspectorPanelRow,
  InspectorPanelSection,
  InspectorPanelTitle,
} from "@/registry/hirael/ui/inspector-panel";

function Field({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 w-full items-center rounded-md border border-border bg-background px-2 font-mono text-xs text-foreground">
      {children}
    </span>
  );
}

export default function InspectorPanelDemo() {
  const t = useT();

  return (
    <div className="flex w-full max-w-xl justify-center">
      <InspectorPanel>
        <InspectorPanelHeader>
          <InspectorPanelTitle>
            {t({ en: "Inspector", ar: "المفتّش" })}
          </InspectorPanelTitle>
          <span className="text-xs text-muted-foreground">
            {t({ en: "Frame 12", ar: "إطار 12" })}
          </span>
        </InspectorPanelHeader>

        <InspectorPanelSection title={t({ en: "Layout", ar: "التخطيط" })}>
          <InspectorPanelRow label={t({ en: "Width", ar: "العرض" })}>
            <Field>320</Field>
          </InspectorPanelRow>
          <InspectorPanelRow label={t({ en: "Height", ar: "الارتفاع" })}>
            <Field>192</Field>
          </InspectorPanelRow>
          <InspectorPanelRow label={t({ en: "Radius", ar: "نصف القطر" })}>
            <Field>12</Field>
          </InspectorPanelRow>
        </InspectorPanelSection>

        <InspectorPanelSection title={t({ en: "Appearance", ar: "المظهر" })}>
          <InspectorPanelRow label={t({ en: "Fill", ar: "التعبئة" })}>
            <span className="size-4 rounded-sm border border-border bg-foreground/80" />
            <Field>#18181B</Field>
          </InspectorPanelRow>
          <InspectorPanelRow label={t({ en: "Opacity", ar: "الشفافية" })}>
            <Field>100%</Field>
          </InspectorPanelRow>
        </InspectorPanelSection>

        <InspectorPanelSection
          title={t({ en: "Typography", ar: "الطباعة" })}
          defaultOpen={false}
        >
          <InspectorPanelRow label={t({ en: "Size", ar: "الحجم" })}>
            <Field>14</Field>
          </InspectorPanelRow>
          <InspectorPanelRow label={t({ en: "Weight", ar: "السماكة" })}>
            <Field>{t({ en: "Medium", ar: "متوسط" })}</Field>
          </InspectorPanelRow>
        </InspectorPanelSection>
      </InspectorPanel>
    </div>
  );
}

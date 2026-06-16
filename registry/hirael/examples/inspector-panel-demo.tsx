"use client";

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
  return (
    <div className="flex w-full max-w-xl justify-center">
      <InspectorPanel>
        <InspectorPanelHeader>
          <InspectorPanelTitle>Inspector</InspectorPanelTitle>
          <span className="text-xs text-muted-foreground">Frame 12</span>
        </InspectorPanelHeader>

        <InspectorPanelSection title="Layout">
          <InspectorPanelRow label="Width">
            <Field>320</Field>
          </InspectorPanelRow>
          <InspectorPanelRow label="Height">
            <Field>192</Field>
          </InspectorPanelRow>
          <InspectorPanelRow label="Radius">
            <Field>12</Field>
          </InspectorPanelRow>
        </InspectorPanelSection>

        <InspectorPanelSection title="Appearance">
          <InspectorPanelRow label="Fill">
            <span className="size-4 rounded-sm border border-border bg-foreground/80" />
            <Field>#18181B</Field>
          </InspectorPanelRow>
          <InspectorPanelRow label="Opacity">
            <Field>100%</Field>
          </InspectorPanelRow>
        </InspectorPanelSection>

        <InspectorPanelSection title="Typography" defaultOpen={false}>
          <InspectorPanelRow label="Size">
            <Field>14</Field>
          </InspectorPanelRow>
          <InspectorPanelRow label="Weight">
            <Field>Medium</Field>
          </InspectorPanelRow>
        </InspectorPanelSection>
      </InspectorPanel>
    </div>
  );
}

'use client';

import { useT } from '@/lib/demo-locale';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/registry/hirael/bases/radix/components/resizable-panels';

const Pane = ({ label, children }: { label: string; children?: React.ReactNode }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <div className="flex-1 p-3 text-sm text-muted-foreground">{children}</div>
    </div>
  );
};

const ResizablePanelsDemo = () => {
  const t = useT();

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-72 w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-card"
    >
      <ResizablePanel defaultSize={28} minSize={15}>
        <Pane label={t({ en: 'Explorer', ar: 'المستكشف' })}>
          {t({
            en: 'Drag a divider to resize.',
            ar: 'اسحب فاصلاً لتغيير الحجم.',
          })}
        </Pane>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={72}>
        <ResizablePanelGroup direction="vertical" className="h-full">
          <ResizablePanel defaultSize={64} minSize={20}>
            <Pane label={t({ en: 'Editor', ar: 'المحرر' })}>
              {t({
                en: "Panels share their space proportionally and clamp to each panel's minimum size.",
                ar: 'تتقاسم اللوحات مساحتها بالتناسب وتلتزم بالحد الأدنى لحجم كل لوحة.',
              })}
            </Pane>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={36} minSize={15}>
            <Pane label={t({ en: 'Terminal', ar: 'الطرفية' })}>
              <span className="font-mono text-xs">$ pnpm dev</span>
            </Pane>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ResizablePanelsDemo;

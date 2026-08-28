'use client';

import { useT } from '@/lib/demo-locale';
import {
  JsonViewer,
  JsonViewerCollapseAll,
  JsonViewerCopy,
  JsonViewerExpandAll,
  JsonViewerTree,
} from '@/registry/hirael/bases/base/components/json-viewer';

const RESPONSE = {
  id: 'ord_8f2a91',
  status: 'paid',
  total: 148.5,
  currency: 'USD',
  paidAt: '2026-08-21T09:14:03Z',
  customer: {
    id: 'cus_41kz',
    name: 'Layla Mansour',
    email: 'layla@example.com',
    verified: true,
    company: null,
  },
  items: [
    { sku: 'TEE-BLK-M', qty: 2, price: 32 },
    { sku: 'CAP-TAN', qty: 1, price: 24.5 },
    { sku: 'SOCK-3PK', qty: 1, price: 60 },
  ],
  shipping: {
    method: 'express',
    tracking: null,
    address: {
      line1: '14 Harbour St',
      city: 'Beirut',
      country: 'LB',
    },
  },
  note: 'Leave the parcel with the concierge if nobody answers. Gate code is on file, ring twice before leaving.',
  tags: ['priority', 'gift'],
};

const CONFIG = {
  name: 'hirael-web',
  version: '3.2.0',
  private: true,
  engines: { node: '>=22', pnpm: '>=10' },
  scripts: {
    dev: 'next dev',
    build: 'next build',
    lint: 'eslint .',
  },
  dependencies: {
    next: '16.3.2',
    react: '19.2.8',
    'lucide-react': '^1.33.0',
  },
  browserslist: ['defaults', 'not IE 11'],
};

const JsonViewerDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'API response', ar: 'استجابة API' })}
        </p>
        <JsonViewer value={RESPONSE} />
        <p className="text-[11px] text-muted-foreground">
          {t({
            en: 'Click a row or use the arrow keys to open and close nodes.',
            ar: 'انقر على صف أو استخدم الأسهم لفتح العقد وإغلاقها.',
          })}
        </p>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'With toolbar', ar: 'مع شريط أدوات' })}
        </p>
        <JsonViewer value={CONFIG} defaultExpanded={1} className="p-0">
          <div className="flex items-center justify-between gap-2 border-b border-border px-2 py-1">
            <span className="ps-1 font-sans text-xs text-muted-foreground">package.json</span>
            <div className="flex items-center gap-1">
              <JsonViewerExpandAll>{t({ en: 'Expand all', ar: 'توسيع الكل' })}</JsonViewerExpandAll>
              <JsonViewerCollapseAll>{t({ en: 'Collapse all', ar: 'طي الكل' })}</JsonViewerCollapseAll>
              <JsonViewerCopy />
            </div>
          </div>
          <JsonViewerTree className="p-3" />
        </JsonViewer>
      </div>
    </div>
  );
};

export default JsonViewerDemo;

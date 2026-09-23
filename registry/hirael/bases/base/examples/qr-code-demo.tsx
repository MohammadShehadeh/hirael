'use client';

import { useT } from '@/lib/demo-locale';
import { QRCode } from '@/registry/hirael/bases/base/components/qr-code';

const longPayload =
  'https://hirael.com/components/qr-code?utm_source=showcase&utm_medium=demo&utm_campaign=error-correction';

const QrCodeDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Sizes', ar: 'الأحجام' })}</p>
        <div className="flex items-end gap-4">
          <QRCode value="https://hirael.com" size={64} title="hirael.com" />
          <QRCode value="https://hirael.com" size={96} title="hirael.com" />
          <QRCode value="https://hirael.com" size={128} title="hirael.com" />
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Custom colors', ar: 'ألوان مخصصة' })}</p>
        <div className="flex items-center gap-4">
          <QRCode value="https://hirael.com" size={96} foreground="#1c1917" background="#f5f5f4" />
          <QRCode value="https://hirael.com" size={96} foreground="#1e3a8a" background="#eff6ff" />
          <QRCode value="https://hirael.com" size={96} foreground="#14532d" background="#f0fdf4" />
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({
            en: 'Error correction · L vs H',
            ar: 'تصحيح الأخطاء · L مقابل H',
          })}
        </p>
        <div className="flex items-end gap-6">
          <div className="grid justify-items-center gap-1.5">
            <QRCode value={longPayload} level="L" size={112} />
            <span className="font-mono text-[10px] text-muted-foreground">level=&quot;L&quot;</span>
          </div>
          <div className="grid justify-items-center gap-1.5">
            <QRCode value={longPayload} level="H" size={112} />
            <span className="font-mono text-[10px] text-muted-foreground">level=&quot;H&quot;</span>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'In a card', ar: 'داخل بطاقة' })}</p>
        <div className="grid w-fit justify-items-center gap-3 rounded-lg border border-border bg-card p-6">
          <QRCode
            value="https://hirael.com"
            size={128}
            title={t({
              en: 'Scan to open hirael.com',
              ar: 'امسح للفتح hirael.com',
            })}
          />
          <p className="text-xs text-muted-foreground">
            {t({ en: 'Scan to open hirael.com', ar: 'امسح للفتح hirael.com' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QrCodeDemo;

'use client';

import { Check, Copy } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { useCopyToClipboard } from '@/registry/hirael/hooks/use-copy-to-clipboard';
import { Button } from '@/registry/hirael/bases/base/ui/button';

const INSTALL = 'npx shadcn add https://hirael.com/r/use-copy-to-clipboard.json';

const UseCopyToClipboardDemo = () => {
  const t = useT();
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="grid w-full max-w-lg gap-3">
      <div className="flex items-center gap-2 rounded-md border border-border bg-card p-2 ps-3 text-card-foreground">
        <span dir="ltr" className="min-w-0 flex-1 truncate text-start text-sm">
          {INSTALL}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => copy(INSTALL)}
          aria-label={copied ? t({ en: 'Copied', ar: 'تم النسخ' }) : t({ en: 'Copy command', ar: 'انسخ الأمر' })}
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </div>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {copied
          ? t({ en: 'Copied to your clipboard.', ar: 'تم النسخ إلى الحافظة.' })
          : t({ en: 'The icon turns into a check for two seconds.', ar: 'تتحول الأيقونة إلى علامة صح لثانيتين.' })}
      </p>
    </div>
  );
};

export default UseCopyToClipboardDemo;

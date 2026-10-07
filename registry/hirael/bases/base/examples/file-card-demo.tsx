'use client';

import { Download, Trash2 } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { FileCard } from '@/registry/hirael/bases/base/components/file-card';

const FileCardDemo = () => {
  const t = useT();
  const actions = (
    <>
      <Button type="button" variant="ghost" size="icon-sm" aria-label={t({ en: 'Download', ar: 'تنزيل' })}>
        <Download />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" aria-label={t({ en: 'Delete', ar: 'حذف' })}>
        <Trash2 />
      </Button>
    </>
  );

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Rows', ar: 'صفوف' })}</p>
        <div className="grid gap-2">
          <FileCard
            name="quarterly-report.pdf"
            size={2_400_000}
            meta={t({ en: 'Today', ar: 'اليوم' })}
            actions={actions}
          />
          <FileCard
            name="pricing-2027.xlsx"
            size={380_000}
            meta={t({ en: 'Yesterday', ar: 'أمس' })}
            actions={actions}
          />
          <FileCard
            name="brand-kit.zip"
            size={12_000_000}
            meta={t({ en: 'Sep 28', ar: '28 سبتمبر' })}
            actions={actions}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Tiles', ar: 'بطاقات' })}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <FileCard
            layout="tile"
            name="hero.jpg"
            size={820_000}
            preview="/media/components/lightbox/forest-thumb.jpg"
            actions={actions}
          />
          <FileCard layout="tile" name="launch-video.mov" size={48_000_000} actions={actions} />
          <FileCard layout="tile" name="voice-memo.m4a" size={3_200_000} actions={actions} />
          <FileCard layout="tile" name="use-filters.ts" size={4_800} actions={actions} />
        </div>
      </div>
    </div>
  );
};

export default FileCardDemo;

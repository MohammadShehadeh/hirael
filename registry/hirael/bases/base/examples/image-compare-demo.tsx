'use client';

import Image from 'next/image';

import { useT } from '@/lib/demo-locale';
import {
  ImageCompare,
  ImageCompareAfter,
  ImageCompareBefore,
  ImageCompareHandle,
  ImageCompareLabel,
} from '@/registry/hirael/bases/base/components/image-compare';

const PHOTO = '/media/components/image-compare/valley.jpg';
const PHOTO_ALT = '/media/components/image-compare/ridge.jpg';

const MockPanel = ({ styled }: { styled?: boolean }) => {
  return (
    <div className="size-full bg-background p-4">
      <div className="grid h-full content-start gap-3 rounded-lg border border-border bg-card p-4">
        <div className={styled ? 'h-3 w-1/3 rounded bg-foreground' : 'h-3 w-1/3 rounded bg-muted'} />
        <div className={styled ? 'h-2 w-2/3 rounded bg-muted-foreground/60' : 'h-2 w-2/3 rounded bg-muted'} />
        <div className={styled ? 'h-2 w-1/2 rounded bg-muted-foreground/60' : 'h-2 w-1/2 rounded bg-muted'} />
        <div className="mt-2 flex gap-2">
          <div
            className={
              styled ? 'h-7 w-20 rounded-md bg-primary' : 'h-7 w-20 rounded-md border border-dashed border-border'
            }
          />
          <div
            className={
              styled
                ? 'h-7 w-20 rounded-md border border-border bg-secondary'
                : 'h-7 w-20 rounded-md border border-dashed border-border'
            }
          />
        </div>
      </div>
    </div>
  );
};

const ImageCompareDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Drag to compare · labels', ar: 'اسحب للمقارنة · تسميات' })}
        </p>
        <ImageCompare className="aspect-video rounded-lg border border-border">
          <ImageCompareBefore>
            <Image
              src={PHOTO}
              alt={t({
                en: 'Forest lake, original',
                ar: 'بحيرة الغابة، الأصلية',
              })}
              width={1200}
              height={675}
              className="size-full object-cover grayscale"
            />
          </ImageCompareBefore>
          <ImageCompareAfter>
            <Image
              src={PHOTO}
              alt={t({
                en: 'Forest lake, edited',
                ar: 'بحيرة الغابة، المعدّلة',
              })}
              width={1200}
              height={675}
              className="size-full object-cover"
            />
          </ImageCompareAfter>
          <ImageCompareLabel side="before">{t({ en: 'Before', ar: 'قبل' })}</ImageCompareLabel>
          <ImageCompareLabel side="after">{t({ en: 'After', ar: 'بعد' })}</ImageCompareLabel>
          <ImageCompareHandle />
        </ImageCompare>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Vertical orientation', ar: 'اتجاه عمودي' })}
        </p>
        <ImageCompare
          orientation="vertical"
          defaultPosition={40}
          className="aspect-video rounded-lg border border-border"
        >
          <ImageCompareBefore>
            <Image
              src={PHOTO}
              alt={t({ en: 'Forest lake', ar: 'بحيرة الغابة' })}
              width={1200}
              height={675}
              className="size-full object-cover"
            />
          </ImageCompareBefore>
          <ImageCompareAfter>
            <Image
              src={PHOTO_ALT}
              alt={t({ en: 'Mountain valley', ar: 'وادٍ جبلي' })}
              width={1200}
              height={675}
              className="size-full object-cover"
            />
          </ImageCompareAfter>
          <ImageCompareLabel side="before">{t({ en: 'Lake', ar: 'بحيرة' })}</ImageCompareLabel>
          <ImageCompareLabel side="after">{t({ en: 'Valley', ar: 'وادٍ' })}</ImageCompareLabel>
          <ImageCompareHandle />
        </ImageCompare>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: 'Follow pointer · wireframe vs styled',
            ar: 'تتبّع المؤشر · مخطط مقابل مُنسّق',
          })}
        </p>
        <ImageCompare followPointer className="aspect-video rounded-lg border border-border">
          <ImageCompareBefore>
            <MockPanel />
          </ImageCompareBefore>
          <ImageCompareAfter>
            <MockPanel styled />
          </ImageCompareAfter>
          <ImageCompareLabel side="before">{t({ en: 'Wireframe', ar: 'مخطط' })}</ImageCompareLabel>
          <ImageCompareLabel side="after">{t({ en: 'Styled', ar: 'مُنسّق' })}</ImageCompareLabel>
          <ImageCompareHandle />
        </ImageCompare>
      </div>
    </div>
  );
};

export default ImageCompareDemo;

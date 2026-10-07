'use client';

import * as React from 'react';
import { FilePlus, Upload } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { UploadQueue, useUploadQueue } from '@/registry/hirael/bases/base/components/upload-queue';

const SAMPLES: [string, number, string][] = [
  ['quarterly-report.pdf', 2_400_000, 'application/pdf'],
  ['team-offsite.jpg', 4_100_000, 'image/jpeg'],
  ['launch-video.mov', 48_000_000, 'video/quicktime'],
  ['pricing.xlsx', 380_000, 'application/vnd.ms-excel'],
  ['brand-kit.zip', 12_000_000, 'application/zip'],
];

// Empty files that report a realistic size, so the demo needs no real uploads.
const sampleFiles = () =>
  SAMPLES.map(([name, size, type]) => Object.defineProperty(new File([], name, { type }), 'size', { value: size }));

// Pretends to upload: bigger files take longer, and the video fails once so retry has something to do.
const failedOnce = new Set<string>();
const fakeUpload = (file: File, { onProgress, signal }: { onProgress: (p: number) => void; signal: AbortSignal }) =>
  new Promise<void>((resolve, reject) => {
    let progress = 0;
    const step = Math.max(2, 40 - Math.log2(file.size) * 1.5);
    const id = window.setInterval(() => {
      progress = Math.min(100, progress + step);
      onProgress(progress);
      if (file.name.endsWith('.mov') && progress >= 60 && !failedOnce.has(file.name)) {
        failedOnce.add(file.name);
        window.clearInterval(id);
        reject(new Error('Connection lost at 60%'));
      } else if (progress >= 100) {
        window.clearInterval(id);
        resolve();
      }
    }, 200);
    signal.addEventListener('abort', () => window.clearInterval(id));
  });

const UploadQueueDemo = () => {
  const t = useT();
  const queue = useUploadQueue({ upload: fakeUpload, concurrency: 2 });
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="grid w-full max-w-md gap-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
          <Upload />
          {t({ en: 'Choose files', ar: 'اختر ملفات' })}
        </Button>
        <Button type="button" variant="ghost" onClick={() => queue.add(sampleFiles())}>
          <FilePlus />
          {t({ en: 'Add sample files', ar: 'أضف ملفات تجريبية' })}
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(event) => {
            if (event.target.files) queue.add(event.target.files);
            event.target.value = '';
          }}
        />
      </div>
      <UploadQueue
        queue={queue}
        labels={{
          summary: (done, total) => t({ en: `${done} of ${total} uploaded`, ar: `تم رفع ${done} من ${total}` }),
          clear: t({ en: 'Clear finished', ar: 'مسح المكتمل' }),
          cancel: t({ en: 'Cancel upload', ar: 'إلغاء الرفع' }),
          retry: t({ en: 'Try again', ar: 'أعد المحاولة' }),
          remove: t({ en: 'Remove', ar: 'إزالة' }),
          status: {
            queued: t({ en: 'Waiting', ar: 'بالانتظار' }),
            uploading: t({ en: 'Uploading', ar: 'جارٍ الرفع' }),
            done: t({ en: 'Uploaded', ar: 'تم الرفع' }),
            error: t({ en: 'Failed', ar: 'فشل' }),
            canceled: t({ en: 'Canceled', ar: 'أُلغي' }),
          },
        }}
      />
      {queue.items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {t({
            en: 'Nothing uploads for real here. Two files go at a time, and the video fails once.',
            ar: 'لا يُرفع شيء فعليًا هنا. يُرفع ملفان في كل مرة، ويفشل الفيديو مرة واحدة.',
          })}
        </p>
      )}
    </div>
  );
};

export default UploadQueueDemo;

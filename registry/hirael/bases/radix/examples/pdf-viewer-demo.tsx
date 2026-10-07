'use client';

import { useT } from '@/lib/demo-locale';
import { PdfViewer } from '@/registry/hirael/bases/radix/components/pdf-viewer';

const PdfViewerDemo = () => {
  const t = useT();

  return (
    <div className="w-full max-w-2xl">
      <PdfViewer
        file="/media/components/pdf-viewer/release-notes.pdf"
        labels={{
          previous: t({ en: 'Previous page', ar: 'الصفحة السابقة' }),
          next: t({ en: 'Next page', ar: 'الصفحة التالية' }),
          page: t({ en: 'Page', ar: 'الصفحة' }),
          of: t({ en: 'of', ar: 'من' }),
          zoomIn: t({ en: 'Zoom in', ar: 'تكبير' }),
          zoomOut: t({ en: 'Zoom out', ar: 'تصغير' }),
          fitWidth: t({ en: 'Fit to width', ar: 'ملاءمة العرض' }),
          download: t({ en: 'Download', ar: 'تنزيل' }),
          error: t({ en: 'This PDF could not be opened.', ar: 'تعذّر فتح ملف PDF هذا.' }),
        }}
      />
    </div>
  );
};

export default PdfViewerDemo;

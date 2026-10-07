'use client';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Download, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { Separator } from '@/registry/hirael/bases/base/ui/separator';
import { Skeleton } from '@/registry/hirael/bases/base/ui/skeleton';

type ReactPdf = typeof import('react-pdf');

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];

export interface PdfViewerLabels {
  previous: string;
  next: string;
  page: string;
  of: string;
  zoomIn: string;
  zoomOut: string;
  fitWidth: string;
  download: string;
  error: string;
}

const DEFAULT_LABELS: PdfViewerLabels = {
  previous: 'Previous page',
  next: 'Next page',
  page: 'Page',
  of: 'of',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  fitWidth: 'Fit to width',
  download: 'Download',
  error: 'This PDF could not be opened.',
};

interface PdfViewerContextValue {
  file: string;
  lib: ReactPdf | null;
  page: number;
  setPage: (page: number) => void;
  pages: number;
  setPages: (pages: number) => void;
  /** 1 fits the page to the width of the viewer. */
  zoom: number;
  setZoom: (zoom: number) => void;
  labels: PdfViewerLabels;
}

const PdfViewerContext = React.createContext<PdfViewerContextValue | null>(null);

const usePdfViewer = () => {
  const ctx = React.useContext(PdfViewerContext);
  if (!ctx) {
    throw new Error('PdfViewer compound parts must be used inside <PdfViewer>');
  }

  return ctx;
};

export interface PdfViewerProps extends React.ComponentProps<'div'> {
  /** URL of the PDF. It must be served from your origin or with CORS. */
  file: string;
  /** Page shown first, starting at 1. */
  defaultPage?: number;
  /**
   * Where pdf.js loads its worker from. Defaults to the matching version on unpkg;
   * copy `pdfjs-dist/build/pdf.worker.min.mjs` to your public folder to self-host it.
   */
  workerUrl?: string;
  labels?: Partial<PdfViewerLabels>;
}

const PdfViewer = ({ file, defaultPage = 1, workerUrl, labels, className, children, ...props }: PdfViewerProps) => {
  const [lib, setLib] = React.useState<ReactPdf | null>(null);
  const [page, setPage] = React.useState(defaultPage);
  const [pages, setPages] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);

  // pdf.js needs browser APIs at import time, so it loads after mount.
  React.useEffect(() => {
    let cancelled = false;
    void import('react-pdf').then((mod) => {
      mod.pdfjs.GlobalWorkerOptions.workerSrc =
        workerUrl ?? `https://unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
      if (!cancelled) setLib(mod);
    });

    return () => {
      cancelled = true;
    };
  }, [workerUrl]);

  const ctx = React.useMemo<PdfViewerContextValue>(
    () => ({
      file,
      lib,
      page,
      setPage: (next) => setPage(Math.min(Math.max(1, next), pages || Number.MAX_SAFE_INTEGER)),
      pages,
      setPages,
      zoom,
      setZoom,
      labels: { ...DEFAULT_LABELS, ...labels },
    }),
    [file, lib, page, pages, zoom, labels],
  );

  return (
    <PdfViewerContext.Provider value={ctx}>
      <div
        data-slot="pdf-viewer"
        className={cn('flex h-[36rem] flex-col overflow-hidden rounded-lg border border-border bg-card', className)}
        {...props}
      >
        {children ?? (
          <>
            <PdfViewerToolbar />
            <PdfViewerContent />
          </>
        )}
      </div>
    </PdfViewerContext.Provider>
  );
};

/** Page arrows and number, zoom, fit to width and download. */
const PdfViewerToolbar = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { file, page, setPage, pages, zoom, setZoom, labels } = usePdfViewer();
  const [draft, setDraft] = React.useState<string | null>(null);
  const zoomIndex = ZOOM_STEPS.findIndex((step) => step >= zoom - 0.001);

  return (
    <div
      data-slot="pdf-viewer-toolbar"
      className={cn('flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5', className)}
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={labels.previous}
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        <ChevronLeft className="rtl:rotate-180" />
      </Button>
      <form
        className="flex items-center gap-1.5 text-sm"
        onSubmit={(event) => {
          event.preventDefault();
          if (draft !== null) setPage(Number(draft) || page);
          setDraft(null);
        }}
      >
        <Input
          aria-label={labels.page}
          inputMode="numeric"
          value={draft ?? String(page)}
          onChange={(event) => setDraft(event.target.value.replace(/\D/g, ''))}
          onBlur={() => {
            if (draft !== null) setPage(Number(draft) || page);
            setDraft(null);
          }}
          className="h-8 w-12 text-center tabular-nums"
        />
        <span className="text-muted-foreground tabular-nums">
          {labels.of} {pages || '–'}
        </span>
      </form>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={labels.next}
        disabled={!pages || page >= pages}
        onClick={() => setPage(page + 1)}
      >
        <ChevronRight className="rtl:rotate-180" />
      </Button>
      <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-5" />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={labels.zoomOut}
        disabled={zoomIndex <= 0}
        onClick={() => setZoom(ZOOM_STEPS[Math.max(0, zoomIndex - 1)])}
      >
        <ZoomOut />
      </Button>
      <span className="w-12 text-center text-sm text-muted-foreground tabular-nums">{Math.round(zoom * 100)}%</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={labels.zoomIn}
        disabled={zoomIndex >= ZOOM_STEPS.length - 1}
        onClick={() => setZoom(ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, zoomIndex + 1)])}
      >
        <ZoomIn />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={labels.fitWidth}
        title={labels.fitWidth}
        disabled={zoom === 1}
        onClick={() => setZoom(1)}
      >
        <Maximize2 />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="ms-auto"
        render={<a href={file} download aria-label={labels.download} title={labels.download} />}
        nativeButton={false}
      >
        <Download />
      </Button>
    </div>
  );
};

/** The page itself, sized to the viewer's width and scrollable when zoomed in. Arrow keys turn pages. */
const PdfViewerContent = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { file, lib, page, setPage, pages, setPages, zoom, labels } = usePdfViewer();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const placeholder = <Skeleton className="mx-auto aspect-[1/1.294] w-full max-w-full" />;

  return (
    <div
      ref={scrollRef}
      tabIndex={0}
      role="region"
      aria-label={`${labels.page} ${page} ${labels.of} ${pages}`}
      data-slot="pdf-viewer-content"
      onKeyDown={(event) => {
        const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
        if (event.key === (rtl ? 'ArrowLeft' : 'ArrowRight') || event.key === 'PageDown') setPage(page + 1);
        else if (event.key === (rtl ? 'ArrowRight' : 'ArrowLeft') || event.key === 'PageUp') setPage(page - 1);
        else return;
        event.preventDefault();
      }}
      className={cn(
        'min-h-0 flex-1 overflow-auto bg-muted/50 p-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset',
        className,
      )}
      {...props}
    >
      {!lib || width === 0 ? (
        placeholder
      ) : (
        <lib.Document
          file={file}
          suspense={false}
          loading={placeholder}
          error={<p className="p-6 text-center text-sm text-muted-foreground">{labels.error}</p>}
          onLoadSuccess={(doc) => setPages(doc.numPages)}
          className="flex justify-center-safe"
        >
          <lib.Page
            pageNumber={page}
            width={width * zoom}
            loading={placeholder}
            className="overflow-hidden rounded-sm shadow-md"
          />
        </lib.Document>
      )}
    </div>
  );
};

export { PdfViewer, PdfViewerToolbar, PdfViewerContent, usePdfViewer };

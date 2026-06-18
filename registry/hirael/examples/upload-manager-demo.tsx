"use client";

import * as React from "react";

import {
  UploadDropzone,
  UploadItem,
  UploadList,
  UploadManager,
  UploadSummary,
  type UploadItem as UploadItemType,
} from "@/registry/hirael/ui/upload-manager";

const INITIAL: UploadItemType[] = [
  {
    id: "demo-photo",
    name: "team-photo.jpg",
    size: 2_412_544,
    progress: 0,
    status: "uploading",
  },
  {
    id: "demo-deck",
    name: "q3-roadmap.pdf",
    size: 8_847_360,
    progress: 0,
    status: "uploading",
  },
  {
    id: "demo-export",
    name: "customers-export.csv",
    size: 524_288,
    progress: 100,
    status: "error",
  },
];

export default function UploadManagerDemo() {
  const [items, setItems] = React.useState<UploadItemType[]>(INITIAL);
  const seedRef = React.useRef(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setItems((current) => {
        let changed = false;
        const next = current.map((item) => {
          if (item.status !== "uploading") return item;
          changed = true;
          const progress = Math.min(100, item.progress + 7 + Math.random() * 6);
          if (progress >= 100) {
            return { ...item, progress: 100, status: "done" as const };
          }
          return { ...item, progress };
        });
        return changed ? next : current;
      });
    }, 350);
    return () => window.clearInterval(id);
  }, []);

  const handleAdd = React.useCallback((files: File[]) => {
    setItems((current) => [
      ...current,
      ...files.map((file) => ({
        id: `demo-added-${seedRef.current++}`,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "uploading" as const,
      })),
    ]);
  }, []);

  const cancel = (id: string) =>
    setItems((current) => current.filter((item) => item.id !== id));

  const remove = (id: string) =>
    setItems((current) => current.filter((item) => item.id !== id));

  const retry = (id: string) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, progress: 0, status: "uploading" as const }
          : item,
      ),
    );

  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Queue · simulated
        </p>
        <UploadManager value={items} onValueChange={setItems}>
          <UploadSummary />
          <UploadDropzone
            onAdd={handleAdd}
            subline="Up to 25 MB each"
          />
          <UploadList empty="Nothing queued yet.">
            {items.map((item) => (
              <UploadItem
                key={item.id}
                item={item}
                onCancel={cancel}
                onRetry={retry}
                onRemove={remove}
              />
            ))}
          </UploadList>
        </UploadManager>
      </div>

      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Compact · custom summary
        </p>
        <UploadManager value={items} onValueChange={setItems}>
          <UploadSummary>
            {({ done, total, uploading }) => (
              <p className="text-sm text-muted-foreground">
                {uploading > 0
                  ? `Uploading ${uploading} of ${total}`
                  : `${done} of ${total} uploaded`}
              </p>
            )}
          </UploadSummary>
          <UploadDropzone onAdd={handleAdd} headline="Add more files" />
          <UploadList>
            {items.map((item) => (
              <UploadItem
                key={item.id}
                item={item}
                onCancel={cancel}
                onRetry={retry}
                onRemove={remove}
              />
            ))}
          </UploadList>
        </UploadManager>
      </div>
    </div>
  );
}

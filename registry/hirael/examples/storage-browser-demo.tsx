"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import {
  StorageBreadcrumb,
  StorageBreadcrumbItem,
  StorageBrowser,
  StorageBrowserHeader,
  StorageBrowserList,
  StorageItem,
} from "@/registry/hirael/components/storage-browser";

type Entry = {
  kind: "folder" | "file";
  name: string;
  size?: string;
  modified?: string;
};

const FS: Record<string, Entry[]> = {
  "": [
    { kind: "folder", name: "images", modified: "Apr 12" },
    { kind: "folder", name: "backups", modified: "Apr 09" },
    { kind: "folder", name: "logs", modified: "Apr 14" },
    { kind: "file", name: "README.md", size: "2.1 KB", modified: "Apr 02" },
    { kind: "file", name: "config.yaml", size: "840 B", modified: "Apr 08" },
  ],
  images: [
    { kind: "folder", name: "thumbnails", modified: "Apr 12" },
    { kind: "file", name: "hero.jpg", size: "1.4 MB", modified: "Apr 11" },
    { kind: "file", name: "avatar.png", size: "312 KB", modified: "Apr 10" },
  ],
  "images/thumbnails": [
    { kind: "file", name: "hero@2x.webp", size: "88 KB", modified: "Apr 12" },
    { kind: "file", name: "avatar@2x.webp", size: "22 KB", modified: "Apr 12" },
  ],
  backups: [
    {
      kind: "file",
      name: "db-2024-04-09.sql.gz",
      size: "48 MB",
      modified: "Apr 09",
    },
    {
      kind: "file",
      name: "db-2024-04-02.sql.gz",
      size: "47 MB",
      modified: "Apr 02",
    },
  ],
  logs: [
    { kind: "file", name: "app.log", size: "6.2 MB", modified: "Apr 14" },
    { kind: "file", name: "access.log", size: "18 MB", modified: "Apr 14" },
  ],
};

export default function StorageBrowserDemo() {
  const t = useT();
  const [path, setPath] = React.useState<string[]>([]);

  const key = path.join("/");
  const entries = FS[key] ?? [];

  function open(entry: Entry) {
    if (entry.kind !== "folder") return;
    const nextKey = [...path, entry.name].join("/");
    if (FS[nextKey]) setPath([...path, entry.name]);
  }

  return (
    <div className="w-full max-w-2xl">
      <StorageBrowser>
        <StorageBrowserHeader>
          <StorageBreadcrumb>
            <StorageBreadcrumbItem
              current={path.length === 0}
              onClick={() => setPath([])}
            >
              my-bucket
            </StorageBreadcrumbItem>
            {path.map((segment, i) => (
              <StorageBreadcrumbItem
                key={segment}
                current={i === path.length - 1}
                onClick={() => setPath(path.slice(0, i + 1))}
              >
                {segment}
              </StorageBreadcrumbItem>
            ))}
          </StorageBreadcrumb>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {t({
              en: `${entries.length} items`,
              ar: `${entries.length} عنصرًا`,
            })}
          </span>
        </StorageBrowserHeader>
        <StorageBrowserList>
          {entries.map((entry) => (
            <StorageItem
              key={entry.name}
              kind={entry.kind}
              name={entry.name}
              size={entry.size}
              modified={entry.modified}
              onClick={() => open(entry)}
            />
          ))}
        </StorageBrowserList>
      </StorageBrowser>
      <p className="mt-2 text-xs text-muted-foreground">
        {t({
          en: "Open a folder to drill in, or click the path to jump back.",
          ar: "افتح مجلدًا للدخول، أو انقر المسار للعودة.",
        })}
      </p>
    </div>
  );
}

"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Label } from "@/registry/hirael/ui/label";
import {
  FileDropzone,
  FileDropzoneErrors,
  FileDropzoneList,
  FileDropzoneZone,
} from "@/registry/hirael/ui/file-dropzone";

export default function FileDropzoneDemo() {
  const t = useT();
  const [basic, setBasic] = React.useState<File[]>([]);
  const [composed, setComposed] = React.useState<File[]>([]);

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label>
          {t({
            en: "Images & PDFs · up to 5 MB",
            ar: "صور وملفات PDF · حتى 5 ميغابايت",
          })}
        </Label>
        <FileDropzone
          value={basic}
          onValueChange={setBasic}
          accept="image/*,.pdf"
          maxSize={5 * 1024 * 1024}
          multiple
        >
          <FileDropzoneZone />
          <FileDropzoneList />
          <FileDropzoneErrors />
        </FileDropzone>
      </div>

      <div className="grid gap-2">
        <Label>
          {t({
            en: "Data files · custom layout",
            ar: "ملفات البيانات · تخطيط مخصص",
          })}
        </Label>
        <FileDropzone
          value={composed}
          onValueChange={setComposed}
          accept=".csv,.json,.txt"
          maxSize={1 * 1024 * 1024}
          multiple
        >
          <FileDropzoneZone
            headline={t({ en: "Drop data files", ar: "أسقط ملفات البيانات" })}
            subline={t({
              en: "csv, json, txt · max 1 MB each",
              ar: "csv، json، txt · بحد أقصى 1 ميغابايت لكل ملف",
            })}
          />
          <FileDropzoneErrors />
          <FileDropzoneList />
        </FileDropzone>
      </div>
    </div>
  );
}

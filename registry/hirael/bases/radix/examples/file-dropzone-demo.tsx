'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldGroup, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import {
  FileDropzone,
  FileDropzoneErrors,
  FileDropzoneList,
  FileDropzoneZone,
} from '@/registry/hirael/bases/radix/components/file-dropzone';

const FileDropzoneDemo = () => {
  const t = useT();
  const [basic, setBasic] = React.useState<File[]>([]);
  const [composed, setComposed] = React.useState<File[]>([]);

  return (
    <FieldGroup className="max-w-md gap-8">
      <Field className="gap-2">
        <FieldLabel>
          {t({
            en: 'Images & PDFs · up to 5 MB',
            ar: 'صور وملفات PDF · حتى 5 ميغابايت',
          })}
        </FieldLabel>
        <FileDropzone value={basic} onValueChange={setBasic} accept="image/*,.pdf" maxSize={5 * 1024 * 1024} multiple>
          <FileDropzoneZone />
          <FileDropzoneList />
          <FileDropzoneErrors />
        </FileDropzone>
      </Field>

      <Field className="gap-2">
        <FieldLabel>
          {t({
            en: 'Data files · custom layout',
            ar: 'ملفات البيانات · تخطيط مخصص',
          })}
        </FieldLabel>
        <FileDropzone
          value={composed}
          onValueChange={setComposed}
          accept=".csv,.json,.txt"
          maxSize={1 * 1024 * 1024}
          multiple
        >
          <FileDropzoneZone
            headline={t({ en: 'Drop data files', ar: 'أسقط ملفات البيانات' })}
            subline={t({
              en: 'csv, json, txt · max 1 MB each',
              ar: 'csv، json، txt · بحد أقصى 1 ميغابايت لكل ملف',
            })}
          />
          <FileDropzoneErrors />
          <FileDropzoneList />
        </FileDropzone>
      </Field>
    </FieldGroup>
  );
};

export default FileDropzoneDemo;

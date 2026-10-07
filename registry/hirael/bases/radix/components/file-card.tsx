'use client';

import * as React from 'react';
import { File, FileArchive, FileAudio, FileCode, FileImage, FileSpreadsheet, FileText, FileVideo } from 'lucide-react';

import { cn } from '@/lib/utils';
import { formatBytes } from '@/registry/hirael/lib/format-bytes';

export type FileKind = 'image' | 'video' | 'audio' | 'document' | 'spreadsheet' | 'archive' | 'code' | 'other';

const KIND_BY_EXTENSION: Record<string, FileKind> = {
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  webp: 'image',
  avif: 'image',
  svg: 'image',
  heic: 'image',
  mp4: 'video',
  mov: 'video',
  webm: 'video',
  mkv: 'video',
  mp3: 'audio',
  wav: 'audio',
  ogg: 'audio',
  m4a: 'audio',
  flac: 'audio',
  pdf: 'document',
  doc: 'document',
  docx: 'document',
  txt: 'document',
  md: 'document',
  rtf: 'document',
  xls: 'spreadsheet',
  xlsx: 'spreadsheet',
  csv: 'spreadsheet',
  numbers: 'spreadsheet',
  zip: 'archive',
  rar: 'archive',
  '7z': 'archive',
  gz: 'archive',
  tar: 'archive',
  js: 'code',
  ts: 'code',
  tsx: 'code',
  jsx: 'code',
  json: 'code',
  html: 'code',
  css: 'code',
  py: 'code',
};

const extensionOf = (name: string) => {
  const dot = name.lastIndexOf('.');

  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
};

/** Sorts a file by its MIME type, falling back to the extension. */
export const fileKindOf = (name: string, type?: string): FileKind => {
  if (type?.startsWith('image/')) return 'image';
  if (type?.startsWith('video/')) return 'video';
  if (type?.startsWith('audio/')) return 'audio';

  return KIND_BY_EXTENSION[extensionOf(name)] ?? 'other';
};

const KIND_ICON: Record<FileKind, React.ReactNode> = {
  image: <FileImage aria-hidden />,
  video: <FileVideo aria-hidden />,
  audio: <FileAudio aria-hidden />,
  document: <FileText aria-hidden />,
  spreadsheet: <FileSpreadsheet aria-hidden />,
  archive: <FileArchive aria-hidden />,
  code: <FileCode aria-hidden />,
  other: <File aria-hidden />,
};

export interface FileIconProps extends React.ComponentProps<'span'> {
  name: string;
  type?: string;
}

/** A tinted square with the right icon for the file type. */
const FileIcon = ({ name, type, className, ...props }: FileIconProps) => {
  return (
    <span
      data-slot="file-icon"
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-5',
        className,
      )}
      {...props}
    >
      {KIND_ICON[fileKindOf(name, type)]}
    </span>
  );
};

export interface FileCardProps extends React.ComponentProps<'div'> {
  name: string;
  /** Size in bytes. */
  size?: number;
  /** MIME type, used for the icon. */
  type?: string;
  /** Image URL shown instead of the icon, like an object URL for an image upload. */
  preview?: string;
  /** Extra text after the size, like "Uploaded 2h ago". */
  meta?: React.ReactNode;
  /** `row` for lists, `tile` for grids with a large preview. */
  layout?: 'row' | 'tile';
  /** Buttons at the end, like download or remove. */
  actions?: React.ReactNode;
}

const FileCard = ({
  name,
  size,
  type,
  preview,
  meta,
  layout = 'row',
  actions,
  className,
  children,
  ...props
}: FileCardProps) => {
  const ext = extensionOf(name);
  const details = [size !== undefined ? formatBytes(size) : null, ext ? ext.toUpperCase() : null]
    .filter(Boolean)
    .join(', ');

  if (layout === 'tile') {
    return (
      <div
        data-slot="file-card"
        data-layout="tile"
        className={cn(
          'group/file relative flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground',
          className,
        )}
        {...props}
      >
        <div className="flex aspect-[4/3] items-center justify-center bg-muted">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- previews are object URLs or any remote image
            <img src={preview} alt="" className="size-full object-cover" />
          ) : (
            <FileIcon name={name} type={type} className="size-14 bg-transparent [&_svg]:size-8" />
          )}
        </div>
        <div className="grid gap-0.5 p-3">
          <span className="truncate text-sm font-medium" title={name}>
            {name}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {details}
            {meta && <>, {meta}</>}
          </span>
          {children}
        </div>
        {actions && (
          <div className="absolute end-2 top-2 flex gap-1 opacity-0 transition-opacity group-focus-within/file:opacity-100 group-hover/file:opacity-100">
            {actions}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      data-slot="file-card"
      data-layout="row"
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border bg-card p-2.5 text-card-foreground',
        className,
      )}
      {...props}
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element -- previews are object URLs or any remote image
        <img src={preview} alt="" className="size-10 shrink-0 rounded-md object-cover" />
      ) : (
        <FileIcon name={name} type={type} />
      )}
      <div className="grid min-w-0 flex-1 gap-0.5">
        <span className="truncate text-sm font-medium" title={name}>
          {name}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {details}
          {meta && <>, {meta}</>}
        </span>
        {children}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
    </div>
  );
};

export { FileCard, FileIcon };

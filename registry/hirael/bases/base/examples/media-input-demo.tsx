'use client';

import * as React from 'react';
import { ImageIcon, Music, Upload } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import {
  MediaInput,
  MediaInputClear,
  MediaInputContent,
  MediaInputEmpty,
  MediaInputFile,
  MediaInputTrigger,
  useMediaInput,
} from '@/registry/hirael/bases/base/components/media-input';
import { AudioPlayer } from '@/registry/hirael/bases/base/components/audio-player';

const AudioPreview = () => {
  const { value } = useMediaInput();
  if (!value) return null;

  return <AudioPlayer src={value.url} className="rounded-md border border-border bg-card p-3" />;
};

const ImagePreview = () => {
  const { value } = useMediaInput();
  if (!value) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={value.url}
      alt={value.file.name}
      className="max-h-48 w-full rounded-md border border-border object-cover"
    />
  );
};

const MediaInputDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: 'Audio · feeds the audio player',
            ar: 'صوت · يغذّي مشغّل الصوت',
          })}
        </p>
        <MediaInput accept="audio/*">
          <MediaInputEmpty>
            <Music aria-hidden className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t({
                en: 'Pick a local audio file. It plays from your browser only. Nothing is uploaded.',
                ar: 'اختر ملف صوت محلّيًا. يُشغّل من متصفحك فقط. لا يُرفع أي شيء.',
              })}
            </p>
            <MediaInputTrigger>
              <Upload aria-hidden />
              {t({ en: 'Choose audio file', ar: 'اختر ملف صوت' })}
            </MediaInputTrigger>
          </MediaInputEmpty>
          <MediaInputContent>
            <div className="flex items-center justify-between gap-3">
              <MediaInputFile />
              <div className="flex items-center gap-1">
                <MediaInputTrigger size="sm">{t({ en: 'Replace', ar: 'استبدال' })}</MediaInputTrigger>
                <MediaInputClear />
              </div>
            </div>
            <AudioPreview />
          </MediaInputContent>
        </MediaInput>
      </div>

      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Image · max 5 MB', ar: 'صورة · بحد أقصى 5 ميجابايت' })}
        </p>
        <MediaInput accept="image/*" maxSize={5 * 1024 * 1024}>
          <MediaInputEmpty className="py-8">
            <ImageIcon aria-hidden className="size-6 text-muted-foreground" />
            <MediaInputTrigger variant="ghost" size="sm">
              {t({ en: 'Choose an image', ar: 'اختر صورة' })}
            </MediaInputTrigger>
          </MediaInputEmpty>
          <MediaInputContent>
            <ImagePreview />
            <div className="flex items-center justify-between gap-3">
              <MediaInputFile />
              <MediaInputClear />
            </div>
          </MediaInputContent>
        </MediaInput>
      </div>
    </div>
  );
};

export default MediaInputDemo;

"use client";

import * as React from "react";
import { Music, Upload } from "lucide-react";

import {
  AudioPlayer,
  AudioPlayerPlay,
  AudioPlayerRate,
  AudioPlayerSeek,
  AudioPlayerSkip,
  AudioPlayerTime,
  AudioPlayerVolume,
  useAudioPlayer,
} from "@/registry/hirael/ui/audio-player";
import {
  MediaInput,
  MediaInputContent,
  MediaInputEmpty,
  MediaInputFile,
  MediaInputTrigger,
} from "@/registry/hirael/ui/media-input";

function PlaybackStatus() {
  const { playing, rate } = useAudioPlayer();

  return (
    <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
      {playing ? `Playing at ${rate}×` : "Paused"}
    </span>
  );
}

export default function AudioPlayerDemo() {
  const [src, setSrc] = React.useState<string>();

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <MediaInput
        accept="audio/*"
        onValueChange={(value) => setSrc(value?.url)}
      >
        <MediaInputEmpty>
          <Music aria-hidden className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Pick a local audio file to preview the player. It plays from your
            browser only. Nothing is uploaded.
          </p>
          <MediaInputTrigger>
            <Upload aria-hidden />
            Choose audio file
          </MediaInputTrigger>
        </MediaInputEmpty>
        <MediaInputContent className="flex items-center justify-between gap-3">
          <MediaInputFile />
          <MediaInputTrigger size="sm">Replace audio</MediaInputTrigger>
        </MediaInputContent>
      </MediaInput>

      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Full player · composed
        </p>
        <AudioPlayer
          src={src}
          className="rounded-md border border-border bg-card p-3"
        >
          <AudioPlayerSkip seconds={-15} />
          <AudioPlayerPlay />
          <AudioPlayerSkip seconds={15} />
          <AudioPlayerTime mode="elapsed" />
          <AudioPlayerSeek />
          <AudioPlayerTime mode="duration" />
          <AudioPlayerVolume className="max-sm:hidden" />
          <AudioPlayerRate />
        </AudioPlayer>
      </div>

      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Podcast row · minimal
        </p>
        <AudioPlayer src={src}>
          <AudioPlayerPlay />
          <AudioPlayerSeek />
          <AudioPlayerTime mode="remaining" />
        </AudioPlayer>
      </div>

      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Custom · useAudioPlayer
        </p>
        <AudioPlayer
          src={src}
          className="rounded-md border border-border bg-card p-3"
        >
          <AudioPlayerPlay />
          <PlaybackStatus />
          <AudioPlayerRate rates={[0.75, 1, 1.5, 2]} />
        </AudioPlayer>
      </div>
    </div>
  );
}

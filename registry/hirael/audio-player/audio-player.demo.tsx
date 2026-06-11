"use client"

import * as React from "react"
import { Music, Upload } from "lucide-react"

import { Button } from "@/registry/hirael/ui/button"
import {
  AudioPlayer,
  AudioPlayerPlay,
  AudioPlayerRate,
  AudioPlayerSeek,
  AudioPlayerSkip,
  AudioPlayerTime,
  AudioPlayerVolume,
  useAudioPlayer,
} from "@/registry/hirael/ui/audio-player"

function PlaybackStatus() {
  const { playing, rate } = useAudioPlayer()

  return (
    <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
      {playing ? `Playing at ${rate}×` : "Paused"}
    </span>
  )
}

export default function AudioPlayerDemo() {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [src, setSrc] = React.useState<string>()
  const [fileName, setFileName] = React.useState<string>()

  React.useEffect(
    () => () => {
      if (src) URL.revokeObjectURL(src)
    },
    [src]
  )

  const handleFile = (file: File | undefined) => {
    if (!file) return
    setSrc(URL.createObjectURL(file))
    setFileName(file.name)
  }

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="sr-only"
        onChange={(event) => {
          handleFile(event.target.files?.[0])
          event.target.value = ""
        }}
      />

      {!src ? (
        <div className="grid justify-items-center gap-3 rounded-md border border-dashed border-border px-6 py-10 text-center">
          <Music aria-hidden className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Pick a local audio file to preview the player. It plays from your
            browser only — nothing is uploaded.
          </p>
          <Button variant="outline" onClick={() => inputRef.current?.click()}>
            <Upload aria-hidden />
            Choose audio file
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate font-mono text-xs text-muted-foreground">
            {fileName}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            Replace audio
          </Button>
        </div>
      )}

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
  )
}

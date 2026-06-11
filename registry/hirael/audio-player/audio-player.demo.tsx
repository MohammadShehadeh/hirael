"use client"

import * as React from "react"

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

const TRACK_ONE = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
const TRACK_TWO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"

function PlaybackStatus() {
  const { playing, rate } = useAudioPlayer()

  return (
    <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
      {playing ? `Playing at ${rate}×` : "Paused"}
    </span>
  )
}

export default function AudioPlayerDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Full player · composed
        </p>
        <AudioPlayer
          src={TRACK_ONE}
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
        <AudioPlayer src={TRACK_TWO}>
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
          src={TRACK_ONE}
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

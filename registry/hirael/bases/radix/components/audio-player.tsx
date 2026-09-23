'use client';

import * as React from 'react';
import { Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Slider } from '@/registry/hirael/bases/radix/ui/slider';

interface AudioPlayerCtx {
  playing: boolean;
  duration: number;
  currentTime: number;
  buffered: number;
  volume: number;
  muted: boolean;
  rate: number;
  toggle: () => void;
  seek: (time: number) => void;
  skip: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRate: (rate: number) => void;
}

const AudioPlayerContext = React.createContext<AudioPlayerCtx | null>(null);

const useAudioPlayer = () => {
  const ctx = React.useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error('AudioPlayer compound parts must be used inside <AudioPlayer>');
  }

  return ctx;
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

export interface AudioPlayerProps extends Omit<React.ComponentProps<'div'>, 'onPlay' | 'onPause' | 'onEnded'> {
  src?: string;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const AudioPlayer = ({
  src,
  crossOrigin,
  onPlay,
  onPause,
  onEnded,
  className,
  children,
  ...props
}: AudioPlayerProps) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(Number.NaN);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [buffered, setBuffered] = React.useState(0);
  const [volume, setVolumeState] = React.useState(1);
  const [muted, setMuted] = React.useState(false);
  const [rate, setRateState] = React.useState(1);

  const toggle = React.useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.getAttribute('src')) return;
    if (audio.paused) void audio.play().catch(() => undefined);
    else audio.pause();
  }, []);

  const [lastSrc, setLastSrc] = React.useState(src);
  if (src !== lastSrc) {
    setLastSrc(src);
    setPlaying(false);
    setDuration(Number.NaN);
    setCurrentTime(0);
    setBuffered(0);
  }

  const seek = React.useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const max = Number.isFinite(audio.duration) ? audio.duration : time;
    audio.currentTime = Math.min(Math.max(time, 0), max);
    setCurrentTime(audio.currentTime);
  }, []);

  const skip = React.useCallback(
    (seconds: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      seek(audio.currentTime + seconds);
    },
    [seek],
  );

  const setVolume = React.useCallback((next: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.min(Math.max(next, 0), 1);
    if (next > 0) audio.muted = false;
  }, []);

  const toggleMute = React.useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
  }, []);

  const setRate = React.useCallback((next: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = next;
  }, []);

  const syncDuration = React.useCallback(() => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  }, []);

  const syncBuffered = React.useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const ranges = audio.buffered;
    setBuffered(ranges.length > 0 ? ranges.end(ranges.length - 1) : 0);
  }, []);

  const ctx = React.useMemo<AudioPlayerCtx>(
    () => ({
      playing,
      duration,
      currentTime,
      buffered,
      volume,
      muted,
      rate,
      toggle,
      seek,
      skip,
      setVolume,
      toggleMute,
      setRate,
    }),
    [playing, duration, currentTime, buffered, volume, muted, rate, toggle, seek, skip, setVolume, toggleMute, setRate],
  );

  return (
    <AudioPlayerContext.Provider value={ctx}>
      <div
        data-slot="audio-player"
        data-state={playing ? 'playing' : 'paused'}
        className={cn('flex w-full items-center gap-2', className)}
        {...props}
      >
        <audio
          ref={audioRef}
          data-slot="audio-player-audio"
          src={src}
          preload="metadata"
          crossOrigin={crossOrigin}
          hidden
          onPlay={() => {
            setPlaying(true);
            onPlay?.();
          }}
          onPause={() => {
            setPlaying(false);
            onPause?.();
          }}
          onEnded={() => {
            setPlaying(false);
            onEnded?.();
          }}
          onTimeUpdate={() => {
            const audio = audioRef.current;
            if (audio) setCurrentTime(audio.currentTime);
          }}
          onLoadedMetadata={syncDuration}
          onDurationChange={syncDuration}
          onProgress={syncBuffered}
          onVolumeChange={() => {
            const audio = audioRef.current;
            if (!audio) return;
            setVolumeState(audio.volume);
            setMuted(audio.muted);
          }}
          onRateChange={() => {
            const audio = audioRef.current;
            if (audio) setRateState(audio.playbackRate);
          }}
        />
        {children ?? (
          <>
            <AudioPlayerPlay />
            <AudioPlayerTime mode="elapsed" />
            <AudioPlayerSeek />
            <AudioPlayerTime mode="duration" />
            <AudioPlayerVolume />
          </>
        )}
      </div>
    </AudioPlayerContext.Provider>
  );
};

export interface AudioPlayerPlayProps extends React.ComponentProps<typeof Button> {
  playLabel?: string;
  pauseLabel?: string;
}

const AudioPlayerPlay = ({
  playLabel = 'Play',
  pauseLabel = 'Pause',
  onClick,
  className,
  ...props
}: AudioPlayerPlayProps) => {
  const { playing, toggle } = useAudioPlayer();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-slot="audio-player-play"
      aria-label={playing ? pauseLabel : playLabel}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggle();
      }}
      className={cn('size-8', className)}
      {...props}
    >
      {playing ? <Pause /> : <Play />}
    </Button>
  );
};

export interface AudioPlayerSeekProps extends React.ComponentProps<'div'> {
  seekLabel?: string;
}

const AudioPlayerSeek = ({ seekLabel = 'Seek', className, ...props }: AudioPlayerSeekProps) => {
  const { duration, currentTime, buffered, seek } = useAudioPlayer();
  const [scrub, setScrub] = React.useState<number | null>(null);

  const hasDuration = Number.isFinite(duration) && duration > 0;
  const max = hasDuration ? duration : 1;
  const value = scrub ?? Math.min(currentTime, max);
  const bufferedPct = hasDuration ? Math.min(buffered / duration, 1) * 100 : 0;

  return (
    <div
      data-slot="audio-player-seek"
      className={cn('relative flex min-w-0 flex-1 items-center', className)}
      {...props}
    >
      <div
        aria-hidden
        data-slot="audio-player-buffered"
        className="pointer-events-none absolute inset-s-0 top-1/2 h-1 w-full origin-left -translate-y-1/2 rounded-sm bg-primary/20 rtl:origin-right"
        style={{ scale: `${bufferedPct / 100} 1` }}
      />
      <Slider
        value={[value]}
        min={0}
        max={max}
        step={0.1}
        disabled={!hasDuration}
        aria-label={seekLabel}
        onValueChange={(values) => setScrub(values[0] ?? 0)}
        onValueCommit={(values) => {
          seek(values[0] ?? 0);
          setScrub(null);
        }}
      />
    </div>
  );
};

export interface AudioPlayerTimeProps extends React.ComponentProps<'span'> {
  mode?: 'elapsed' | 'remaining' | 'duration';
}

const AudioPlayerTime = ({ mode = 'elapsed', className, ...props }: AudioPlayerTimeProps) => {
  const { currentTime, duration } = useAudioPlayer();

  const value = mode === 'duration' ? duration : mode === 'remaining' ? duration - currentTime : currentTime;
  const label = formatTime(value);

  return (
    <span
      data-slot="audio-player-time"
      data-mode={mode}
      className={cn('shrink-0 text-xs text-muted-foreground tabular-nums', className)}
      {...props}
    >
      {mode === 'remaining' && label !== '--:--' ? `-${label}` : label}
    </span>
  );
};

export interface AudioPlayerVolumeProps extends React.ComponentProps<'div'> {
  muteLabel?: string;
  unmuteLabel?: string;
  volumeLabel?: string;
}

const AudioPlayerVolume = ({
  muteLabel = 'Mute',
  unmuteLabel = 'Unmute',
  volumeLabel = 'Volume',
  className,
  ...props
}: AudioPlayerVolumeProps) => {
  const { volume, muted, setVolume, toggleMute } = useAudioPlayer();
  const silent = muted || volume === 0;

  return (
    <div data-slot="audio-player-volume" className={cn('flex shrink-0 items-center gap-1', className)} {...props}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        data-slot="audio-player-mute"
        aria-label={silent ? unmuteLabel : muteLabel}
        onClick={toggleMute}
        className="size-8"
      >
        {silent ? <VolumeX /> : <Volume2 />}
      </Button>
      <Slider
        value={[muted ? 0 : volume]}
        min={0}
        max={1}
        step={0.01}
        aria-label={volumeLabel}
        onValueChange={(values) => setVolume(values[0] ?? 0)}
        className="w-16"
      />
    </div>
  );
};

export interface AudioPlayerRateProps extends React.ComponentProps<typeof Button> {
  rates?: number[];
  /** Accessible name for the current rate. */
  getLabel?: (rate: number) => string;
}

const defaultRateLabel = (rate: number) => `Playback speed ${rate}×`;

const AudioPlayerRate = ({
  rates = [1, 1.25, 1.5, 2],
  getLabel = defaultRateLabel,
  onClick,
  className,
  ...props
}: AudioPlayerRateProps) => {
  const { rate, setRate } = useAudioPlayer();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      data-slot="audio-player-rate"
      aria-label={getLabel(rate)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const index = rates.indexOf(rate);
        setRate(rates[(index + 1) % rates.length] ?? 1);
      }}
      className={cn('h-8 px-2 text-xs tabular-nums', className)}
      {...props}
    >
      {rate}×
    </Button>
  );
};

export interface AudioPlayerSkipProps extends React.ComponentProps<typeof Button> {
  seconds: number;
  /** Accessible name for a skip of `seconds` (negative is backwards). */
  getLabel?: (seconds: number) => string;
}

const defaultSkipLabel = (seconds: number) =>
  seconds < 0 ? `Back ${Math.abs(seconds)} seconds` : `Forward ${seconds} seconds`;

const AudioPlayerSkip = ({
  seconds,
  getLabel = defaultSkipLabel,
  onClick,
  className,
  ...props
}: AudioPlayerSkipProps) => {
  const { skip } = useAudioPlayer();
  const back = seconds < 0;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-slot="audio-player-skip"
      aria-label={getLabel(seconds)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) skip(seconds);
      }}
      className={cn('size-8', className)}
      {...props}
    >
      {back ? <RotateCcw /> : <RotateCw />}
    </Button>
  );
};

export {
  AudioPlayer,
  AudioPlayerPlay,
  AudioPlayerSeek,
  AudioPlayerTime,
  AudioPlayerVolume,
  AudioPlayerRate,
  AudioPlayerSkip,
  useAudioPlayer,
};

'use client';

import * as React from 'react';
import { Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Slider } from '@/registry/hirael/bases/base/ui/slider';

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

  React.useEffect(() => {
    setPlaying(false);
    setDuration(Number.NaN);
    setCurrentTime(0);
    setBuffered(0);
  }, [src]);

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    props.onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== ' ') return;
    const target = event.target as HTMLElement;
    if (target.closest("button, input, textarea, select, [role='slider']")) {
      return;
    }
    event.preventDefault();
    toggle();
  };

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
        onKeyDown={handleKeyDown}
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

const AudioPlayerPlay = ({ className, ...props }: React.ComponentProps<typeof Button>) => {
  const { playing, toggle } = useAudioPlayer();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-slot="audio-player-play"
      aria-label={playing ? 'Pause' : 'Play'}
      onClick={toggle}
      className={cn('size-8', className)}
      {...props}
    >
      {playing ? <Pause /> : <Play />}
    </Button>
  );
};

const AudioPlayerSeek = ({ className, ...props }: React.ComponentProps<'div'>) => {
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
        className="pointer-events-none absolute start-0 top-1/2 h-1 -translate-y-1/2 rounded-sm bg-primary/20"
        style={{ width: `${bufferedPct}%` }}
      />
      <Slider
        value={[value]}
        min={0}
        max={max}
        step={0.1}
        disabled={!hasDuration}
        aria-label="Seek"
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
      className={cn('shrink-0 font-mono text-xs tabular-nums text-muted-foreground', className)}
      {...props}
    >
      {mode === 'remaining' && label !== '--:--' ? `-${label}` : label}
    </span>
  );
};

const AudioPlayerVolume = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { volume, muted, setVolume, toggleMute } = useAudioPlayer();
  const silent = muted || volume === 0;

  return (
    <div data-slot="audio-player-volume" className={cn('flex shrink-0 items-center gap-1', className)} {...props}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        data-slot="audio-player-mute"
        aria-label={silent ? 'Unmute' : 'Mute'}
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
        aria-label="Volume"
        onValueChange={(values) => setVolume(values[0] ?? 0)}
        className="w-16"
      />
    </div>
  );
};

export interface AudioPlayerRateProps extends React.ComponentProps<typeof Button> {
  rates?: number[];
}

const AudioPlayerRate = ({ rates = [1, 1.25, 1.5, 2], className, ...props }: AudioPlayerRateProps) => {
  const { rate, setRate } = useAudioPlayer();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      data-slot="audio-player-rate"
      aria-label={`Playback speed ${rate}×`}
      onClick={() => {
        const index = rates.indexOf(rate);
        setRate(rates[(index + 1) % rates.length] ?? 1);
      }}
      className={cn('h-8 px-2 font-mono text-xs tabular-nums', className)}
      {...props}
    >
      {rate}×
    </Button>
  );
};

export interface AudioPlayerSkipProps extends React.ComponentProps<typeof Button> {
  seconds: number;
}

const AudioPlayerSkip = ({ seconds, className, ...props }: AudioPlayerSkipProps) => {
  const { skip } = useAudioPlayer();
  const back = seconds < 0;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-slot="audio-player-skip"
      aria-label={back ? `Back ${Math.abs(seconds)} seconds` : `Forward ${seconds} seconds`}
      onClick={() => skip(seconds)}
      className={cn('size-8', className)}
      {...props}
    >
      {back ? <RotateCcw className="rtl:rotate-180" /> : <RotateCw className="rtl:rotate-180" />}
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

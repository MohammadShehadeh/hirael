'use client';

import * as React from 'react';
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { animate } from 'motion/react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Slider } from '@/registry/hirael/bases/radix/ui/slider';

interface VideoPlayerCtx {
  attachVideo: (video: HTMLVideoElement | null) => void;
  playing: boolean;
  duration: number;
  currentTime: number;
  buffered: number;
  volume: number;
  muted: boolean;
  fullscreen: boolean;
  toggle: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  fullscreenSupported: boolean;
  /** Shows the controls and restarts the idle timer. */
  wake: () => void;
  media: MediaHandlers;
}

type MediaHandlerName =
  | 'onPlay'
  | 'onPause'
  | 'onEnded'
  | 'onTimeUpdate'
  | 'onDurationChange'
  | 'onLoadedMetadata'
  | 'onProgress'
  | 'onVolumeChange';

type MediaHandlers = Record<MediaHandlerName, React.ReactEventHandler<HTMLVideoElement>>;

const VideoPlayerContext = React.createContext<VideoPlayerCtx | null>(null);

const useVideoPlayer = () => {
  const ctx = React.useContext(VideoPlayerContext);
  if (!ctx) {
    throw new Error('VideoPlayer compound parts must be used inside <VideoPlayer>');
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

/** iOS Safari only offers native fullscreen on the video element itself. */
type WebkitVideoElement = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

export interface VideoPlayerProps extends React.ComponentProps<'div'> {
  /** Hide the controls and cursor after this many ms without pointer or key input while playing. */
  idleDelay?: number;
}

const VideoPlayer = ({ idleDelay = 2500, className, children, onPointerMove, ...props }: VideoPlayerProps) => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const idleTimerRef = React.useRef<number | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(Number.NaN);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [buffered, setBuffered] = React.useState(0);
  const [volume, setVolumeState] = React.useState(1);
  const [muted, setMuted] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [fullscreenSupported, setFullscreenSupported] = React.useState(true);

  // Idle lives on the DOM and motion fades the controls: pointer movement never re-renders the player.
  const setIdle = React.useCallback((idle: boolean) => {
    const root = rootRef.current;
    if (!root || root.dataset.idle === String(idle)) return;
    root.dataset.idle = String(idle);
    const controls = root.querySelector('[data-slot=video-player-controls]');
    if (controls) animate(controls, { opacity: idle ? 0 : 1 }, { duration: 0.3, ease: 'easeOut' });
  }, []);

  const wake = React.useCallback(() => {
    setIdle(false);
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setIdle(true);
    }, idleDelay);
  }, [idleDelay, setIdle]);

  React.useEffect(() => {
    const video = videoRef.current as WebkitVideoElement | null;
    setFullscreenSupported(
      Boolean(document.fullscreenEnabled && rootRef.current?.requestFullscreen) ||
        typeof video?.webkitEnterFullscreen === 'function',
    );
    const onFullscreen = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', onFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreen);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Metadata can load before hydration, when React isn't listening yet; read it off the element on attach.
  const attachVideo = React.useCallback((video: HTMLVideoElement | null) => {
    videoRef.current = video;
    if (!video) return;
    setDuration(video.duration);
    setCurrentTime(video.currentTime);
    setVolumeState(video.volume);
    setMuted(video.muted);
    setPlaying(!video.paused);
    if (video.buffered.length > 0) setBuffered(video.buffered.end(video.buffered.length - 1));
  }, []);

  const media = React.useMemo<MediaHandlers>(
    () => ({
      onPlay: () => {
        setPlaying(true);
        wake();
      },
      onPause: () => {
        setPlaying(false);
        setIdle(false);
      },
      onEnded: () => setPlaying(false),
      onTimeUpdate: (event) => setCurrentTime(event.currentTarget.currentTime),
      onDurationChange: (event) => setDuration(event.currentTarget.duration),
      onLoadedMetadata: (event) => {
        const video = event.currentTarget;
        setDuration(video.duration);
        setVolumeState(video.volume);
        setMuted(video.muted);
      },
      onProgress: (event) => {
        const ranges = event.currentTarget.buffered;
        setBuffered(ranges.length > 0 ? ranges.end(ranges.length - 1) : 0);
      },
      onVolumeChange: (event) => {
        setVolumeState(event.currentTarget.volume);
        setMuted(event.currentTarget.muted);
      },
    }),
    [wake, setIdle],
  );

  const toggle = React.useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.currentSrc) return;
    if (video.paused) void video.play().catch(() => undefined);
    else video.pause();
  }, []);

  const seek = React.useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    const max = Number.isFinite(video.duration) ? video.duration : time;
    video.currentTime = Math.min(Math.max(time, 0), max);
    setCurrentTime(video.currentTime);
  }, []);

  const setVolume = React.useCallback((next: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = Math.min(Math.max(next, 0), 1);
    if (next > 0) video.muted = false;
  }, []);

  const toggleMute = React.useCallback(() => {
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  }, []);

  const toggleFullscreen = React.useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);

      return;
    }
    if (document.fullscreenEnabled && root.requestFullscreen) {
      void root.requestFullscreen().catch(() => undefined);

      return;
    }
    (videoRef.current as WebkitVideoElement | null)?.webkitEnterFullscreen?.();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    props.onKeyDown?.(event);
    wake();
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, input, textarea, select, [role='slider']")) return;
    if (event.key === ' ' || event.key === 'k') {
      event.preventDefault();
      toggle();
    } else if (event.key === 'f') {
      event.preventDefault();
      toggleFullscreen();
    } else if (event.key === 'm') {
      event.preventDefault();
      toggleMute();
    }
  };

  const ctx = React.useMemo<VideoPlayerCtx>(
    () => ({
      attachVideo,
      playing,
      duration,
      currentTime,
      buffered,
      volume,
      muted,
      fullscreen,
      toggle,
      seek,
      setVolume,
      toggleMute,
      toggleFullscreen,
      fullscreenSupported,
      wake,
      media,
    }),
    [
      attachVideo,
      playing,
      duration,
      currentTime,
      buffered,
      volume,
      muted,
      fullscreen,
      toggle,
      seek,
      setVolume,
      toggleMute,
      toggleFullscreen,
      fullscreenSupported,
      wake,
      media,
    ],
  );

  return (
    <VideoPlayerContext.Provider value={ctx}>
      <div
        ref={rootRef}
        data-slot="video-player"
        data-state={playing ? 'playing' : 'paused'}
        data-idle="false"
        tabIndex={-1}
        className={cn(
          'group/video-player relative overflow-hidden rounded-lg bg-muted text-foreground outline-none data-[idle=true]:cursor-none',
          className,
        )}
        {...props}
        onPointerMove={(event) => {
          wake();
          onPointerMove?.(event);
        }}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </VideoPlayerContext.Provider>
  );
};

const VideoPlayerVideo = ({ className, onClick, onPointerDown, ref, ...props }: React.ComponentProps<'video'>) => {
  const { attachVideo, toggle, wake, playing, media } = useVideoPlayer();
  const pointerTypeRef = React.useRef('');
  // Kept in a ref so an inline consumer ref doesn't detach and re-attach the video every render.
  const consumerRef = React.useRef(ref);
  React.useLayoutEffect(() => {
    consumerRef.current = ref;
  });
  // The player needs the element too, so a consumer ref is attached alongside, not instead.
  const composedRef = React.useCallback(
    (video: HTMLVideoElement | null) => {
      attachVideo(video);
      const current = consumerRef.current;
      if (typeof current === 'function') current(video);
      else if (current) current.current = video;
    },
    [attachVideo],
  );
  // The player's own media handlers always run; a consumer's run after them instead of replacing them.
  const handlers = Object.fromEntries(
    (Object.keys(media) as MediaHandlerName[]).map((name) => [
      name,
      (event: React.SyntheticEvent<HTMLVideoElement>) => {
        media[name](event);
        props[name]?.(event);
      },
    ]),
  ) as MediaHandlers;

  return (
    <video
      ref={composedRef}
      data-slot="video-player-video"
      playsInline
      preload="metadata"
      className={cn('block size-full object-contain', className)}
      onPointerDown={(event) => {
        pointerTypeRef.current = event.pointerType;
        onPointerDown?.(event);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        // A tap on a playing video reveals the controls; pausing is left to the play button.
        if (pointerTypeRef.current === 'touch' && playing) wake();
        else toggle();
      }}
      {...props}
      {...handlers}
    />
  );
};

const VideoPlayerControls = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="video-player-controls"
      className={cn(
        'absolute inset-x-0 bottom-0 flex items-center gap-1 bg-linear-to-t from-background/85 to-transparent px-2 pt-8 pb-2',
        'group-data-[idle=true]/video-player:pointer-events-none',
        className,
      )}
      {...props}
    />
  );
};

const controlButton = 'size-8';

export interface VideoPlayerPlayProps extends React.ComponentProps<typeof Button> {
  playLabel?: string;
  pauseLabel?: string;
}

const VideoPlayerPlay = ({
  playLabel = 'Play',
  pauseLabel = 'Pause',
  onClick,
  className,
  ...props
}: VideoPlayerPlayProps) => {
  const { playing, toggle } = useVideoPlayer();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-slot="video-player-play"
      aria-label={playing ? pauseLabel : playLabel}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggle();
      }}
      className={cn(controlButton, className)}
      {...props}
    >
      {playing ? <Pause /> : <Play />}
    </Button>
  );
};

export interface VideoPlayerSeekProps extends React.ComponentProps<'div'> {
  seekLabel?: string;
}

const VideoPlayerSeek = ({ seekLabel = 'Seek', className, ...props }: VideoPlayerSeekProps) => {
  const { duration, currentTime, buffered, seek } = useVideoPlayer();
  const [scrub, setScrub] = React.useState<number | null>(null);

  const hasDuration = Number.isFinite(duration) && duration > 0;
  const max = hasDuration ? duration : 1;
  const value = scrub ?? Math.min(currentTime, max);
  const bufferedPct = hasDuration ? Math.min(buffered / duration, 1) * 100 : 0;

  return (
    <div
      data-slot="video-player-seek"
      className={cn('relative mx-1 flex min-w-0 flex-1 items-center', className)}
      {...props}
    >
      <div
        aria-hidden
        data-slot="video-player-buffered"
        className="pointer-events-none absolute inset-s-0 top-1/2 h-1 w-full origin-left -translate-y-1/2 rounded-sm bg-foreground/25 rtl:origin-right"
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

export interface VideoPlayerTimeProps extends React.ComponentProps<'span'> {
  mode?: 'elapsed' | 'remaining' | 'duration';
}

const VideoPlayerTime = ({ mode = 'elapsed', className, ...props }: VideoPlayerTimeProps) => {
  const { currentTime, duration } = useVideoPlayer();

  const value = mode === 'duration' ? duration : mode === 'remaining' ? duration - currentTime : currentTime;
  const label = formatTime(value);

  return (
    <span
      data-slot="video-player-time"
      data-mode={mode}
      className={cn('shrink-0 px-1 text-xs text-muted-foreground tabular-nums', className)}
      {...props}
    >
      {mode === 'remaining' && label !== '--:--' ? `-${label}` : label}
    </span>
  );
};

export interface VideoPlayerVolumeProps extends React.ComponentProps<'div'> {
  muteLabel?: string;
  unmuteLabel?: string;
  volumeLabel?: string;
}

const VideoPlayerVolume = ({
  muteLabel = 'Mute',
  unmuteLabel = 'Unmute',
  volumeLabel = 'Volume',
  className,
  ...props
}: VideoPlayerVolumeProps) => {
  const { volume, muted, setVolume, toggleMute } = useVideoPlayer();
  const silent = muted || volume === 0;

  return (
    <div data-slot="video-player-volume" className={cn('flex shrink-0 items-center gap-1', className)} {...props}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        data-slot="video-player-mute"
        aria-label={silent ? unmuteLabel : muteLabel}
        onClick={toggleMute}
        className={controlButton}
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
        className="w-16 max-sm:hidden"
      />
    </div>
  );
};

export interface VideoPlayerFullscreenProps extends React.ComponentProps<typeof Button> {
  enterLabel?: string;
  exitLabel?: string;
}

const VideoPlayerFullscreen = ({
  enterLabel = 'Full screen',
  exitLabel = 'Exit full screen',
  onClick,
  className,
  ...props
}: VideoPlayerFullscreenProps) => {
  const { fullscreen, fullscreenSupported, toggleFullscreen } = useVideoPlayer();

  if (!fullscreenSupported) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-slot="video-player-fullscreen"
      aria-label={fullscreen ? exitLabel : enterLabel}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggleFullscreen();
      }}
      className={cn(controlButton, className)}
      {...props}
    >
      {fullscreen ? <Minimize /> : <Maximize />}
    </Button>
  );
};

export {
  VideoPlayer,
  VideoPlayerVideo,
  VideoPlayerControls,
  VideoPlayerPlay,
  VideoPlayerSeek,
  VideoPlayerTime,
  VideoPlayerVolume,
  VideoPlayerFullscreen,
  useVideoPlayer,
};

'use client';

import { useT } from '@/lib/demo-locale';
import {
  VideoPlayer,
  VideoPlayerControls,
  VideoPlayerFullscreen,
  VideoPlayerPlay,
  VideoPlayerSeek,
  VideoPlayerTime,
  VideoPlayerVideo,
  VideoPlayerVolume,
} from '@/registry/hirael/bases/base/components/video-player';

const VideoPlayerDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-2xl gap-3">
      <VideoPlayer className="aspect-video">
        <VideoPlayerVideo src="/media/templates/asme/philosophy.mp4" muted loop />
        <VideoPlayerControls>
          <VideoPlayerPlay />
          <VideoPlayerTime />
          <VideoPlayerSeek />
          <VideoPlayerTime mode="duration" />
          <VideoPlayerVolume />
          <VideoPlayerFullscreen />
        </VideoPlayerControls>
      </VideoPlayer>
      <p className="text-xs text-muted-foreground">
        {t({
          en: 'Click the video or press Space to play. F toggles full screen, M mutes. Controls fade out while it plays.',
          ar: 'انقر على الفيديو أو اضغط مفتاح المسافة للتشغيل. F لملء الشاشة، وM لكتم الصوت. تختفي عناصر التحكم أثناء التشغيل.',
        })}
      </p>
    </div>
  );
};

export default VideoPlayerDemo;

'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

import { reveal } from './primitives';

const SERVICES = [
  {
    videoUrl: '/media/templates/asme/services-research.mp4',
    tag: 'Strategy',
    title: 'Research & Insight',
    description:
      'We dig deep into data, culture, and human behavior to surface the insights that drive meaningful, lasting change.',
  },
  {
    videoUrl: '/media/templates/asme/services-design.mp4',
    tag: 'Craft',
    title: 'Design & Execution',
    description:
      'From concept to launch, we obsess over every detail to deliver experiences that feel effortless and look extraordinary.',
  },
];

const ServiceVideo = ({ src, posterSrc }: { src: string; posterSrc?: string }) => {
  const [failed, setFailed] = React.useState(false);

  if (failed) {
    return (
      <div
        aria-hidden
        className="glow-center h-full w-full bg-card bg-cover bg-center"
        style={posterSrc ? { backgroundImage: `url(${posterSrc})` } : undefined}
      />
    );
  }

  return (
    <video
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      src={src}
      poster={posterSrc}
      muted
      autoPlay
      loop
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
      onError={() => setFailed(true)}
    />
  );
};

export const Services = ({ videoSrcs, posterSrcs }: { videoSrcs?: string[]; posterSrcs?: string[] }) => {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-28 md:py-40">
      <div aria-hidden className="glow-center absolute inset-0" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div {...reveal({ y: 30, duration: 0.7 })} className="mb-12 flex items-end justify-between md:mb-16">
          <h2 className="text-3xl tracking-tight text-foreground md:text-5xl">What we do</h2>
          <p className="hidden text-sm text-foreground/40 md:block">Our services</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {SERVICES.map((service, index) => (
            <motion.article
              key={service.tag}
              {...reveal({ y: 50, duration: 0.8, delay: index * 0.15 })}
              className="liquid-glass group overflow-hidden rounded-3xl"
            >
              <div className="relative aspect-video overflow-hidden">
                <ServiceVideo src={videoSrcs?.[index] ?? service.videoUrl} posterSrc={posterSrcs?.[index]} />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-foreground/40">{service.tag}</p>
                  <span aria-hidden className="liquid-glass rounded-full p-2 text-foreground">
                    <ArrowUpRight size={18} className="rtl:-scale-x-100" />
                  </span>
                </div>
                <h3 className="mb-3 text-xl tracking-tight text-foreground md:text-2xl">{service.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/50">{service.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

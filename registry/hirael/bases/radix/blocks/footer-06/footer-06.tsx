'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';

import { Button } from '@/registry/hirael/bases/radix/ui/button';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
};

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z"
      />
    </svg>
  );
};

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56-.79.3-1.46.72-2.13 1.38A5.86 5.86 0 0 0 .63 4.14c-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.13-1.38 5.86 5.86 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.13A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z"
      />
    </svg>
  );
};

const BrandMark = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
      <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
      <path d="M22 86 H58" opacity="0.7" />
      <path d="M28 92 H52" opacity="0.45" />
      <path d="M34 96 H46" opacity="0.25" />
    </svg>
  );
};

const COLUMNS = [
  {
    label: 'Product',
    links: [
      { label: 'Features', href: '#' },
      { label: 'FAQs', href: '#' },
      { label: 'Get started', href: '#' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'GitHub', href: '#' },
      { label: 'Contact us', href: '#' },
    ],
  },
];

const SOCIALS = [
  { label: 'LinkedIn', href: '#', icon: LinkedinIcon },
  { label: 'Instagram', href: '#', icon: InstagramIcon },
];

const Footer06 = () => {
  const reduceMotion = useReducedMotion();

  return (
    <footer data-slot="footer" className="w-full rounded-xs border border-input bg-muted/10 p-2">
      <div
        data-slot="footer-cta"
        className="relative min-h-72 w-full overflow-hidden rounded-xs border border-border sm:h-80"
      >
        <Image
          src="/media/blocks/footer-06/fractal-maze.jpg"
          alt="Fractal maze of interlocking paths"
          width={1920}
          height={1080}
          quality={75}
          className="absolute inset-0 h-full w-full rotate-180 object-cover opacity-40 blur-[1px] md:blur-[2px]"
        />
        <div className="relative z-10 flex h-full flex-col items-start justify-between px-4 pb-2 pt-2 sm:justify-center sm:pb-4 md:px-8">
          <div className="relative flex flex-col items-start justify-start">
            <p className="mt-2 max-w-lg text-start text-lg font-semibold tracking-tight sm:mt-3 sm:text-xl md:text-3xl">
              Stop fighting YAML. Start orchestrating CI/CD.
            </p>
            <p className="max-w-xl pt-2 text-start text-xs text-foreground/80 sm:pt-3 sm:text-sm">
              Connect your account, get instant insights, and start designing workflows visually.
            </p>
          </div>
          <motion.div
            className="mt-4 flex w-full flex-row flex-wrap items-stretch justify-center gap-2 sm:mt-6 md:items-start md:justify-start md:gap-4"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
          >
            <Button asChild className="h-10 w-full rounded-xs sm:h-12 md:w-52">
              <a href="#" className="group flex items-center gap-2">
                <GithubIcon className="size-4" />
                Get started
              </a>
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="px-4 pb-2 pt-12 md:pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div data-slot="footer-brand" className="lg:col-span-2">
              <a href="#" className="mb-2 flex items-center gap-2">
                <span className="inline-flex size-7 items-center justify-center rounded-sm border border-border bg-background text-foreground">
                  <BrandMark className="size-5" />
                </span>
                <span className="text-base font-semibold tracking-tight">Hirael Flow</span>
              </a>
              <p className="mb-4 max-w-sm text-balance text-sm text-muted-foreground">
                The visual control plane for your pipelines. Built for platform teams that ship at scale.
              </p>
              <div className="flex gap-1">
                {SOCIALS.map((social) => (
                  <Button key={social.label} asChild variant="ghost" size="icon">
                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                      <social.icon className="size-5" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {COLUMNS.map((section) => (
              <div key={section.label} data-slot="footer-column">
                <h3 className="mb-4 font-semibold text-foreground">{section.label}</h3>
                <ul className="space-y-3 text-sm">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div data-slot="footer-legal" className="border-t border-border/50 pt-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <p className="text-sm text-muted-foreground">
                © 2026 Hirael Flow. Built for modern DevOps teams · Powered by GitHub
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer06;

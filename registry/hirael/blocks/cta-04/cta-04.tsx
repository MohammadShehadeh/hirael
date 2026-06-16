"use client";

import * as React from "react";
import { Mail } from "lucide-react";

import { Button } from "@/registry/hirael/ui/button";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
      />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z"
      />
    </svg>
  );
}

const socials = [
  { label: "GitHub", href: "#", icon: GithubIcon },
  { label: "Twitter", href: "#", icon: XIcon },
  { label: "LinkedIn", href: "#", icon: LinkedinIcon },
];

export default function Cta04() {
  return (
    <section
      data-slot="cta"
      className="relative z-0 overflow-hidden bg-background"
    >
      <div
        data-slot="cta-body"
        className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-6 py-20 text-center md:px-10 md:py-28"
      >
        <span
          data-slot="cta-eyebrow"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
        >
          Get in touch
        </span>

        <h2
          data-slot="cta-title"
          className="mt-6 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
        >
          Let&apos;s work{" "}
          <span className="italic text-foreground">together</span>.
        </h2>

        <p
          data-slot="cta-description"
          className="mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base"
        >
          I build fast, accessible, and considered interfaces for the web.
          Whether you have a project in mind or just want to compare notes, I
          would like to hear from you.
        </p>

        <Button asChild size="lg" className="mt-7 rounded-full px-7">
          <a href="#">
            <Mail className="size-4" />
            Get in touch
          </a>
        </Button>

        <p
          data-slot="cta-direct"
          className="mt-3 text-sm text-muted-foreground"
        >
          or reach out directly at{" "}
          <span className="font-medium text-foreground">hello@example.com</span>
        </p>

        <div
          data-slot="cta-socials"
          className="mt-5 flex items-center justify-center gap-3"
        >
          {socials.map((social) => (
            <Button
              key={social.label}
              asChild
              variant="outline"
              size="icon"
              className="size-11 rounded-full"
            >
              <a href={social.href} aria-label={social.label}>
                <social.icon className="size-5" />
              </a>
            </Button>
          ))}
        </div>
      </div>

      <div
        data-slot="cta-glow"
        aria-hidden
        className="relative -z-10 -mt-24 h-64 w-full overflow-hidden md:-mt-32"
        style={{
          maskImage: "radial-gradient(50% 50%, white, transparent)",
          WebkitMaskImage: "radial-gradient(50% 50%, white, transparent)",
        }}
      >
        <div
          className="absolute inset-0 opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at bottom center, color-mix(in oklch, var(--primary) 35%, transparent), transparent 70%)",
          }}
        />
        <div className="absolute inset-s-1/2 top-1/2 aspect-[1/0.7] w-[200%] -translate-x-1/2 rounded-[100%] border-t border-border bg-background rtl:translate-x-1/2" />
        <div
          className="absolute inset-x-0 bottom-0 h-full"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 30%, color-mix(in oklch, var(--foreground) 40%, transparent), transparent), radial-gradient(1px 1px at 70% 20%, color-mix(in oklch, var(--foreground) 30%, transparent), transparent), radial-gradient(1px 1px at 40% 60%, color-mix(in oklch, var(--foreground) 35%, transparent), transparent), radial-gradient(1px 1px at 85% 50%, color-mix(in oklch, var(--foreground) 25%, transparent), transparent), radial-gradient(1px 1px at 55% 40%, color-mix(in oklch, var(--foreground) 30%, transparent), transparent)",
            maskImage: "radial-gradient(50% 50%, white, transparent 85%)",
            WebkitMaskImage: "radial-gradient(50% 50%, white, transparent 85%)",
          }}
        />
      </div>
    </section>
  );
}

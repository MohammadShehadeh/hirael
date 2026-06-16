"use client";

import {
  ArrowRight,
  Boxes,
  Cloud,
  Database,
  Lock,
  Mail,
  MessageCircle,
  Package,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import { Card } from "@/registry/hirael/ui/card";

type Spoke = {
  name: string;
  icon: LucideIcon;
  /** Position on the orbit ring, in degrees clockwise from top (0 = 12 o'clock). */
  angle: number;
  category: string;
  href: string;
};

const SPOKES: readonly Spoke[] = [
  {
    name: "Postgres",
    icon: Database,
    angle: 51,
    category: "Storage",
    href: "#",
  },
  { name: "Resend", icon: Mail, angle: 103, category: "Email", href: "#" },
  {
    name: "Discord",
    icon: MessageCircle,
    angle: 154,
    category: "Comms",
    href: "#",
  },
  { name: "S3", icon: Cloud, angle: 206, category: "Storage", href: "#" },
  { name: "Vault", icon: Lock, angle: 257, category: "Secrets", href: "#" },
  { name: "npm", icon: Package, angle: 309, category: "Registry", href: "#" },
] as const;

export default function Integrations01() {
  return (
    <section
      className="relative isolate overflow-hidden bg-background py-20 sm:py-28"
      aria-labelledby="integrations-01-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="flex flex-col gap-5 lg:col-span-5">
            <Badge variant="outline" className="w-fit">
              integrations
            </Badge>
            <h2
              id="integrations-01-heading"
              className="text-balance font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl md:text-6xl"
            >
              Plays well with the rest of your stack.
            </h2>
            <p className="text-base text-muted-foreground sm:text-lg">
              Hirael is the surface. Your backend, your storage, your CI, your
              secrets; pick whatever you already use. We don&apos;t lock you in,
              and we don&apos;t bring our own server.
            </p>

            <ul
              aria-label="Supported integrations"
              className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 sm:max-w-md"
            >
              {SPOKES.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    className="flex items-center gap-2 rounded-sm px-1 py-1.5 text-sm text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="inline-flex size-6 items-center justify-center rounded-sm border border-border bg-card">
                      <s.icon className="size-3" />
                    </span>
                    <span className="font-medium">{s.name}</span>
                    <Badge variant="outline" className="ms-auto sm:ms-0">
                      {s.category}
                    </Badge>
                  </a>
                </li>
              ))}
            </ul>

            <Button
              asChild
              variant="link"
              className="group mt-4 h-auto w-fit p-0"
            >
              <a href="#">
                Browse all 40+ integrations
                <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </a>
            </Button>
          </div>

          <div className="relative flex items-center justify-center lg:col-span-7">
            <Hub />
          </div>
        </div>
      </div>
    </section>
  );
}

function Hub() {
  const orbit = 42;

  return (
    <div
      className="relative isolate aspect-square w-full max-w-[440px]"
      role="img"
      aria-label="Hirael at the center of an orbit of integration logos"
    >
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full text-border"
      >
        {SPOKES.map((s) => {
          const rad = ((s.angle - 90) * Math.PI) / 180;
          const x = 50 + orbit * Math.cos(rad);
          const y = 50 + orbit * Math.sin(rad);
          return (
            <line
              key={s.name}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth="0.4"
              strokeDasharray="0.8 1.2"
              opacity="0.7"
            />
          );
        })}
        <circle
          cx="50"
          cy="50"
          r={orbit}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="1 1.5"
          opacity="0.5"
        />
        <circle
          cx="50"
          cy="50"
          r={orbit - 14}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="1 1.5"
          opacity="0.35"
        />
      </svg>

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.18] blur-3xl"
        style={{ background: "var(--primary)" }}
      />

      <Card
        className="absolute left-1/2 top-1/2 flex aspect-square -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0 rounded-2xl p-0 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]"
        style={{ width: "22%" }}
      >
        <div className="flex flex-col items-center gap-1.5">
          <Boxes className="size-7 text-foreground" aria-hidden />
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-foreground">
            Hirael
          </span>
        </div>
        <span
          aria-hidden
          className="absolute -inset-2 -z-10 rounded-2xl border border-dashed border-border opacity-70"
        />
      </Card>

      {SPOKES.map((s) => {
        const rad = ((s.angle - 90) * Math.PI) / 180;
        const x = 50 + orbit * Math.cos(rad);
        const y = 50 + orbit * Math.sin(rad);
        return (
          <a
            key={s.name}
            href={s.href}
            aria-label={`${s.name} integration · ${s.category}`}
            className="group absolute rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="absolute -inset-2 -z-10 rounded-full bg-background" />
            <span className="relative inline-flex size-12 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-foreground/40">
              <s.icon className="size-5" aria-hidden />
            </span>
            <span
              className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors group-hover:text-foreground"
              style={{ width: "max-content" }}
            >
              {s.name}
            </span>
          </a>
        );
      })}
    </div>
  );
}

import * as React from "react";
import { Mail, MapPin, MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/registry/hirael/ui/separator";

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

const EMAIL = "hello@example.com";

const SOCIAL_LINKS = [
  { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
  { icon: GithubIcon, href: "#", label: "GitHub" },
] as const;

const Contact02 = () => {
  return (
    <section
      data-slot="contact"
      className="relative mx-auto max-w-6xl border-x border-border bg-background"
    >
      <div className="flex grow flex-col justify-center px-4 py-18 md:items-center">
        <h2 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
          Contact us
        </h2>
        <p className="mb-5 text-base text-muted-foreground">
          Reach the team. We read every message.
        </p>
      </div>

      <Separator />

      <div data-slot="contact-grid" className="grid md:grid-cols-3">
        <Box
          icon={<Mail />}
          title="Email"
          description="We respond to every note within a day."
        >
          <a
            href={`mailto:${EMAIL}`}
            className="font-mono text-sm font-medium tracking-wide hover:underline"
          >
            {EMAIL}
          </a>
        </Box>

        <Box
          icon={<MapPin />}
          title="Location"
          description="A small, distributed team."
        >
          <span className="font-mono text-sm font-medium tracking-wide">
            Remote-first
          </span>
        </Box>

        <Box
          icon={<MessageCircle />}
          title="Social"
          description="Find us on the usual channels."
          className="border-b-0 md:border-e-0"
        >
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-sm font-medium tracking-wide hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </Box>
      </div>

      <Separator />

      <div className="flex h-full flex-col items-center justify-center gap-4 py-24">
        <h3 className="text-center text-2xl font-medium tracking-tight text-muted-foreground md:text-3xl">
          Find us <span className="text-foreground">online</span>
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {SOCIAL_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-x-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm transition-colors duration-150 ease-out hover:bg-accent"
              >
                <Icon className="size-3.5 text-muted-foreground" />
                <span className="font-mono text-xs font-medium tracking-wide">
                  {link.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface ContactBoxProps extends React.ComponentProps<"div"> {
  icon: React.ReactNode;
  title: string;
  description: string;}

const Box = ({
  title,
  description,
  className,
  children,
  icon,
  ...props
}: ContactBoxProps) => {
  return (
    <div
      data-slot="contact-box"
      className={cn(
        "flex flex-col justify-between border-b border-border md:border-b-0 md:border-e",
        className,
      )}
      {...props}
    >
      <div
        data-slot="contact-box-header"
        className={cn(
          "flex items-center gap-x-3 border-b border-border bg-muted/50 p-4",
          "[&_svg]:size-5 [&_svg]:text-muted-foreground",
        )}
      >
        {icon}
        <h3 className="font-mono text-sm font-medium uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div
        data-slot="contact-box-body"
        className="flex items-center gap-x-2 p-4 py-12"
      >
        {children}
      </div>
      <div
        data-slot="contact-box-footer"
        className="border-t border-border p-4"
      >
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Contact02;

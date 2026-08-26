"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

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

type TeamProps = React.ComponentProps<"section">;

const Team = ({ className, children, ...props }: TeamProps) => {
  return (
    <section
      data-slot="team"
      className={cn("bg-background py-20 sm:py-28", className)}
      {...props}
    >
      <div className="container flex w-full flex-col gap-12 sm:gap-16">
        {children}
      </div>
    </section>
  );
};

type TeamHeaderProps = React.ComponentProps<"div">;

const TeamHeader = ({ className, ...props }: TeamHeaderProps) => {
  return (
    <div
      data-slot="team-header"
      className={cn("flex max-w-2xl flex-col gap-5", className)}
      {...props}
    />
  );
};

type TeamEyebrowProps = React.ComponentProps<"span">;

const TeamEyebrow = ({ className, ...props }: TeamEyebrowProps) => {
  return (
    <span
      data-slot="team-eyebrow"
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};

type TeamTitleProps = React.ComponentProps<"h2">;

const TeamTitle = ({ className, ...props }: TeamTitleProps) => {
  return (
    <h2
      data-slot="team-title"
      className={cn(
        "font-serif text-4xl font-medium leading-[1.04] tracking-tight text-foreground sm:text-5xl",
        className,
      )}
      {...props}
    />
  );
};

type TeamDescriptionProps = React.ComponentProps<"p">;

const TeamDescription = ({ className, ...props }: TeamDescriptionProps) => {
  return (
    <p
      data-slot="team-description"
      className={cn(
        "max-w-lg text-sm text-muted-foreground sm:text-base",
        className,
      )}
      {...props}
    />
  );
};

type TeamGridProps = React.ComponentProps<"ul">;

const TeamGrid = ({ className, ...props }: TeamGridProps) => {
  return (
    <ul
      data-slot="team-grid"
      className={cn(
        "grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
      {...props}
    />
  );
};

type TeamMemberProps = React.ComponentProps<"li">;

const TeamMember = ({ className, ...props }: TeamMemberProps) => {
  return (
    <li
      data-slot="team-member"
      className={cn("flex flex-col gap-4 bg-background p-4 sm:p-5", className)}
      {...props}
    />
  );
};

interface TeamMemberAvatarProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Shown in serif when there is no image. */
  initials: string;
  /** Optional portrait; falls back to the initials placeholder. */
  src?: string;
  alt?: string;}

const TeamMemberAvatar = ({
  initials,
  src,
  alt = "",
  className,
  ...props
}: TeamMemberAvatarProps) => {
  return (
    <div
      data-slot="team-member-avatar"
      className={cn(
        "flex aspect-square w-full items-center justify-center overflow-hidden rounded-sm bg-muted",
        className,
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="size-full object-cover" />
      ) : (
        <span
          aria-hidden
          className="font-serif text-4xl font-medium leading-none tracking-tight text-foreground/80 sm:text-5xl"
        >
          {initials}
        </span>
      )}
    </div>
  );
};

type TeamMemberNameProps = React.ComponentProps<"h3">;

const TeamMemberName = ({ className, ...props }: TeamMemberNameProps) => {
  return (
    <h3
      data-slot="team-member-name"
      className={cn(
        "text-sm font-semibold tracking-[-0.01em] text-foreground",
        className,
      )}
      {...props}
    />
  );
};

type TeamMemberRoleProps = React.ComponentProps<"p">;

const TeamMemberRole = ({ className, ...props }: TeamMemberRoleProps) => {
  return (
    <p
      data-slot="team-member-role"
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};

type TeamMemberBioProps = React.ComponentProps<"p">;

const TeamMemberBio = ({ className, ...props }: TeamMemberBioProps) => {
  return (
    <p
      data-slot="team-member-bio"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
};

type TeamMemberLinksProps = React.ComponentProps<"div">;

const TeamMemberLinks = ({ className, ...props }: TeamMemberLinksProps) => {
  return (
    <div
      data-slot="team-member-links"
      className={cn("mt-auto flex items-center gap-1 pt-1", className)}
      {...props}
    />
  );
};

type TeamMemberLinkProps = React.ComponentProps<"a">;

const TeamMemberLink = ({ className, ...props }: TeamMemberLinkProps) => {
  return (
    <a
      data-slot="team-member-link"
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
};

type TeamFooterProps = React.ComponentProps<"div">;

const TeamFooter = ({ className, ...props }: TeamFooterProps) => {
  return (
    <div
      data-slot="team-footer"
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8",
        className,
      )}
      {...props}
    />
  );
};

export {
  Team,
  TeamHeader,
  TeamEyebrow,
  TeamTitle,
  TeamDescription,
  TeamGrid,
  TeamMember,
  TeamMemberAvatar,
  TeamMemberName,
  TeamMemberRole,
  TeamMemberBio,
  TeamMemberLinks,
  TeamMemberLink,
  TeamFooter,
};

const MEMBERS = [
  {
    name: "Nadia Haddad",
    initials: "NH",
    role: "Co-founder, CEO",
    bio: "Ran platform at a payments company before starting Plinth.",
    github: "#",
  },
  {
    name: "Tomasz Wierzbicki",
    initials: "TW",
    role: "Co-founder, CTO",
    bio: "Wrote the first scheduler and still reviews every migration.",
    github: "#",
  },
  {
    name: "Maya Renner",
    initials: "MR",
    role: "Staff engineer",
    bio: "Owns the runtime. Cares a lot about p99s.",
    github: "#",
  },
  {
    name: "Kwame Boateng",
    initials: "KB",
    role: "Design",
    bio: "Designs the console and the docs, in that order.",
    github: "#",
  },
  {
    name: "Elif Demir",
    initials: "ED",
    role: "Infrastructure",
    bio: "Keeps three regions boring. Previously SRE at a CDN.",
    github: "#",
  },
  {
    name: "Jonas Lindqvist",
    initials: "JL",
    role: "Developer experience",
    bio: "Maintains the CLI and answers most of the GitHub issues.",
    github: "#",
  },
  {
    name: "Priya Raman",
    initials: "PR",
    role: "Product",
    bio: "Turns support threads into roadmap. Ex-Linear.",
    github: "#",
  },
  {
    name: "Samuel Okafor",
    initials: "SO",
    role: "Security",
    bio: "Runs the audit program and the bug bounty.",
    github: "#",
  },
] as const;

const Team01Block = () => {
  return (
    <Team data-slot="team-01-block">
      <TeamHeader>
        <TeamEyebrow>The team</TeamEyebrow>
        <TeamTitle>Eight people, three time zones.</TeamTitle>
        <TeamDescription>
          Everyone here has shipped and operated the thing they now build. We
          keep the team small on purpose and hire when a seat is clearly
          missing.
        </TeamDescription>
      </TeamHeader>

      <TeamGrid>
        {MEMBERS.map((member) => (
          <TeamMember key={member.name}>
            <TeamMemberAvatar initials={member.initials} />
            <div className="flex flex-col gap-1">
              <TeamMemberName>{member.name}</TeamMemberName>
              <TeamMemberRole>{member.role}</TeamMemberRole>
            </div>
            <TeamMemberBio>{member.bio}</TeamMemberBio>
            <TeamMemberLinks>
              <TeamMemberLink
                href={member.github}
                aria-label={`${member.name} on GitHub`}
              >
                <GithubIcon />
              </TeamMemberLink>
            </TeamMemberLinks>
          </TeamMember>
        ))}
      </TeamGrid>

      <TeamFooter>
        <p className="text-sm text-muted-foreground">
          We&apos;re hiring across engineering and design.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          See open roles
          <ArrowRight className="size-4 rtl:rotate-180" />
        </a>
      </TeamFooter>
    </Team>
  );
};

export default Team01Block;

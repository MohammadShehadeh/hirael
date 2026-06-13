"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type TeamMembersProps = React.ComponentProps<"div">

function TeamMembers({ className, ...props }: TeamMembersProps) {
  return (
    <div
      data-slot="team-members"
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

type TeamMembersHeaderProps = React.ComponentProps<"div">

function TeamMembersHeader({ className, ...props }: TeamMembersHeaderProps) {
  return (
    <div
      data-slot="team-members-header"
      className={cn(
        "flex items-center justify-between gap-2 border-b border-border px-4 py-3",
        className
      )}
      {...props}
    />
  )
}

type TeamMembersTitleProps = React.ComponentProps<"h3">

function TeamMembersTitle({ className, ...props }: TeamMembersTitleProps) {
  return (
    <h3
      data-slot="team-members-title"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
}

type TeamMembersListProps = React.ComponentProps<"ul">

function TeamMembersList({ className, ...props }: TeamMembersListProps) {
  return (
    <ul
      data-slot="team-members-list"
      className={cn("divide-y divide-border", className)}
      {...props}
    />
  )
}

type TeamMemberItemProps = React.ComponentProps<"li">

function TeamMemberItem({ className, ...props }: TeamMemberItemProps) {
  return (
    <li
      data-slot="team-member-item"
      className={cn("flex items-center gap-3 px-4 py-3", className)}
      {...props}
    />
  )
}

type TeamMemberAvatarProps = React.ComponentProps<"span"> & {
  src?: string
  alt?: string
}

function TeamMemberAvatar({
  src,
  alt,
  className,
  children,
  ...props
}: TeamMemberAvatarProps) {
  return (
    <span
      data-slot="team-member-avatar"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-[11px] font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          className="size-full object-cover"
        />
      ) : (
        children
      )}
    </span>
  )
}

type TeamMemberInfoProps = React.ComponentProps<"div">

function TeamMemberInfo({ className, ...props }: TeamMemberInfoProps) {
  return (
    <div
      data-slot="team-member-info"
      className={cn("flex min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  )
}

type TeamMemberNameProps = React.ComponentProps<"p">

function TeamMemberName({ className, ...props }: TeamMemberNameProps) {
  return (
    <p
      data-slot="team-member-name"
      className={cn("truncate text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
}

type TeamMemberEmailProps = React.ComponentProps<"p">

function TeamMemberEmail({ className, ...props }: TeamMemberEmailProps) {
  return (
    <p
      data-slot="team-member-email"
      className={cn("truncate text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

type TeamMemberRoleProps = React.ComponentProps<"span">

function TeamMemberRole({ className, ...props }: TeamMemberRoleProps) {
  return (
    <span
      data-slot="team-member-role"
      className={cn(
        "inline-flex shrink-0 items-center rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  TeamMembers,
  TeamMembersHeader,
  TeamMembersTitle,
  TeamMembersList,
  TeamMemberItem,
  TeamMemberAvatar,
  TeamMemberInfo,
  TeamMemberName,
  TeamMemberEmail,
  TeamMemberRole,
}

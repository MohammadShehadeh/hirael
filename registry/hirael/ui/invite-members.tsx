"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type InviteMembersProps = React.ComponentProps<"div">

function InviteMembers({ className, ...props }: InviteMembersProps) {
  return (
    <div
      data-slot="invite-members"
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

type InviteMembersTitleProps = React.ComponentProps<"h3">

function InviteMembersTitle({ className, ...props }: InviteMembersTitleProps) {
  return (
    <h3
      data-slot="invite-members-title"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
}

type InviteMembersDescriptionProps = React.ComponentProps<"p">

function InviteMembersDescription({
  className,
  ...props
}: InviteMembersDescriptionProps) {
  return (
    <p
      data-slot="invite-members-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

type InviteMembersFormProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  roles?: string[]
  defaultRole?: string
  onInvite?: (email: string, role: string) => void
}

function InviteMembersForm({
  roles = ["Member", "Admin", "Viewer"],
  defaultRole,
  onInvite,
  className,
  ...props
}: InviteMembersFormProps) {
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState(defaultRole ?? roles[0])

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = email.trim()
    if (!value) return
    onInvite?.(value, role)
    setEmail("")
  }

  return (
    <form
      data-slot="invite-members-form"
      onSubmit={submit}
      className={cn("flex flex-col gap-2 sm:flex-row", className)}
      {...props}
    >
      <input
        type="email"
        required
        placeholder="name@company.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="flex gap-2">
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          aria-label="Role"
          className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {roles.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Invite
        </button>
      </div>
    </form>
  )
}

type InvitePendingListProps = React.ComponentProps<"ul">

function InvitePendingList({ className, ...props }: InvitePendingListProps) {
  return (
    <ul
      data-slot="invite-pending-list"
      className={cn(
        "flex flex-col divide-y divide-border overflow-hidden rounded-md border border-border",
        className
      )}
      {...props}
    />
  )
}

type InvitePendingItemProps = React.ComponentProps<"li">

function InvitePendingItem({ className, ...props }: InvitePendingItemProps) {
  return (
    <li
      data-slot="invite-pending-item"
      className={cn("flex items-center gap-3 px-3 py-2", className)}
      {...props}
    />
  )
}

type InvitePendingEmailProps = React.ComponentProps<"span">

function InvitePendingEmail({ className, ...props }: InvitePendingEmailProps) {
  return (
    <span
      data-slot="invite-pending-email"
      className={cn("min-w-0 flex-1 truncate text-sm text-foreground", className)}
      {...props}
    />
  )
}

type InvitePendingStatusProps = React.ComponentProps<"span">

function InvitePendingStatus({
  className,
  ...props
}: InvitePendingStatusProps) {
  return (
    <span
      data-slot="invite-pending-status"
      className={cn(
        "shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  InviteMembers,
  InviteMembersTitle,
  InviteMembersDescription,
  InviteMembersForm,
  InvitePendingList,
  InvitePendingItem,
  InvitePendingEmail,
  InvitePendingStatus,
}

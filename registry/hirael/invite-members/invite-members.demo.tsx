"use client"

import * as React from "react"

import {
  InviteMembers,
  InviteMembersDescription,
  InviteMembersForm,
  InviteMembersTitle,
  InvitePendingEmail,
  InvitePendingItem,
  InvitePendingList,
  InvitePendingStatus,
} from "@/registry/hirael/ui/invite-members"

export default function InviteMembersDemo() {
  const [pending, setPending] = React.useState([
    { email: "theo@acme.co", role: "Member" },
    { email: "aria@acme.co", role: "Viewer" },
  ])

  return (
    <InviteMembers className="w-full max-w-md">
      <div className="flex flex-col gap-1">
        <InviteMembersTitle>Invite teammates</InviteMembersTitle>
        <InviteMembersDescription>
          They get an email to join your workspace.
        </InviteMembersDescription>
      </div>

      <InviteMembersForm
        onInvite={(email, role) =>
          setPending((list) => [{ email, role }, ...list])
        }
      />

      {pending.length ? (
        <InvitePendingList>
          {pending.map((invite) => (
            <InvitePendingItem key={invite.email}>
              <InvitePendingEmail>{invite.email}</InvitePendingEmail>
              <InvitePendingStatus>{invite.role} · Pending</InvitePendingStatus>
              <button
                type="button"
                onClick={() =>
                  setPending((list) =>
                    list.filter((item) => item.email !== invite.email)
                  )
                }
                className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Revoke
              </button>
            </InvitePendingItem>
          ))}
        </InvitePendingList>
      ) : null}
    </InviteMembers>
  )
}

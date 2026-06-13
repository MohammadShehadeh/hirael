"use client"

import {
  TeamMemberAvatar,
  TeamMemberEmail,
  TeamMemberInfo,
  TeamMemberItem,
  TeamMemberName,
  TeamMemberRole,
  TeamMembers,
  TeamMembersHeader,
  TeamMembersList,
  TeamMembersTitle,
} from "@/registry/hirael/ui/team-members"

const MEMBERS = [
  { initials: "LP", name: "Lena Park", email: "lena@acme.co", role: "Owner" },
  { initials: "MS", name: "Mara Singh", email: "mara@acme.co", role: "Admin" },
  { initials: "TA", name: "Theo Adams", email: "theo@acme.co", role: "Member" },
  { initials: "AK", name: "Aria Kettle", email: "aria@acme.co", role: "Viewer" },
]

export default function TeamMembersDemo() {
  return (
    <TeamMembers className="w-full max-w-lg">
      <TeamMembersHeader>
        <TeamMembersTitle>
          Members <span className="text-muted-foreground">(4)</span>
        </TeamMembersTitle>
        <button
          type="button"
          className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Invite
        </button>
      </TeamMembersHeader>
      <TeamMembersList>
        {MEMBERS.map((member) => (
          <TeamMemberItem key={member.email}>
            <TeamMemberAvatar>{member.initials}</TeamMemberAvatar>
            <TeamMemberInfo>
              <TeamMemberName>{member.name}</TeamMemberName>
              <TeamMemberEmail>{member.email}</TeamMemberEmail>
            </TeamMemberInfo>
            <TeamMemberRole>{member.role}</TeamMemberRole>
          </TeamMemberItem>
        ))}
      </TeamMembersList>
    </TeamMembers>
  )
}

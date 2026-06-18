"use client";

import * as React from "react";

import { PermissionMatrix } from "@/registry/hirael/ui/permission-matrix";

const roles = [
  { id: "viewer", label: "Viewer" },
  { id: "editor", label: "Editor" },
  { id: "admin", label: "Admin" },
];

const permissions = [
  { id: "members.view", label: "View members", group: "Members" },
  { id: "members.invite", label: "Invite members", group: "Members" },
  { id: "members.remove", label: "Remove members", group: "Members" },
  { id: "billing.view", label: "View invoices", group: "Billing" },
  { id: "billing.manage", label: "Manage plan", group: "Billing" },
  { id: "content.publish", label: "Publish content", group: "Content" },
  { id: "content.delete", label: "Delete content", group: "Content" },
];

const smallRoles = [
  { id: "member", label: "Member" },
  { id: "owner", label: "Owner" },
];

const smallPermissions = [
  { id: "read", label: "Read" },
  { id: "write", label: "Write" },
  { id: "delete", label: "Delete" },
];

export default function PermissionMatrixDemo() {
  const [value, setValue] = React.useState<Record<string, string[]>>({
    "members.view": ["viewer", "editor", "admin"],
    "members.invite": ["editor", "admin"],
    "members.remove": ["admin"],
    "billing.view": ["admin"],
    "billing.manage": ["admin"],
    "content.publish": ["editor", "admin"],
    "content.delete": ["admin"],
  });

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <PermissionMatrix
        roles={roles}
        permissions={permissions}
        value={value}
        onValueChange={setValue}
      />

      <PermissionMatrix
        roles={smallRoles}
        permissions={smallPermissions}
        defaultValue={{ read: ["member", "owner"], write: ["owner"] }}
        rowToggles
      />
    </div>
  );
}

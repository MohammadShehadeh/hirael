"use client";

import * as React from "react";

import { RoleManager, type Role } from "@/registry/hirael/ui/role-manager";

const permissions = [
  { id: "members.view", label: "View members", group: "Members" },
  { id: "members.invite", label: "Invite members", group: "Members" },
  { id: "members.remove", label: "Remove members", group: "Members" },
  { id: "content.publish", label: "Publish content", group: "Content" },
  { id: "content.delete", label: "Delete content", group: "Content" },
  { id: "billing.view", label: "View invoices", group: "Billing" },
  { id: "billing.manage", label: "Manage plan", group: "Billing" },
];

const roles: Role[] = [
  {
    id: "owner",
    name: "Owner",
    description: "Full access to everything, including billing.",
    members: 1,
    system: true,
    permissions: permissions.map((permission) => permission.id),
  },
  {
    id: "admin",
    name: "Admin",
    description: "Manages members and content.",
    members: 3,
    permissions: [
      "members.view",
      "members.invite",
      "members.remove",
      "content.publish",
      "content.delete",
    ],
  },
  {
    id: "editor",
    name: "Editor",
    description: "Creates and publishes content.",
    members: 8,
    permissions: ["members.view", "content.publish"],
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access.",
    members: 24,
    permissions: ["members.view", "billing.view"],
  },
];

const smallPermissions = [
  { id: "read", label: "Read" },
  { id: "write", label: "Write" },
  { id: "delete", label: "Delete" },
];

const smallRoles: Role[] = [
  {
    id: "member",
    name: "Member",
    members: 5,
    permissions: ["read", "write"],
  },
  {
    id: "guest",
    name: "Guest",
    members: 2,
    permissions: ["read"],
  },
];

export default function RoleManagerDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-8">
      <RoleManager
        roles={roles}
        permissions={permissions}
        defaultSelectedId="admin"
      />

      <RoleManager roles={smallRoles} permissions={smallPermissions} />
    </div>
  );
}

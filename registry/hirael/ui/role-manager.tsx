"use client";

import * as React from "react";
import { Plus, Copy, Trash2, Shield, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import { Checkbox } from "@/registry/hirael/ui/checkbox";

export type Role = {
  id: string;
  name: string;
  description?: string;
  members?: number;
  system?: boolean;
  permissions: string[];
};

type Permission = { id: string; label: string; group?: string };

type RoleManagerContextValue = {
  roles: Role[];
  permissions: Permission[];
  selectedId: string | null;
  selectedRole: Role | null;
  select: (id: string) => void;
  addRole: () => void;
  duplicateRole: (id: string) => void;
  deleteRole: (id: string) => void;
  togglePermission: (roleId: string, permissionId: string, on: boolean) => void;
  baseId: string;
};

const RoleManagerContext =
  React.createContext<RoleManagerContextValue | null>(null);

function useRoleManager() {
  const ctx = React.useContext(RoleManagerContext);
  if (!ctx) {
    throw new Error(
      "RoleManager compound parts must be used inside <RoleManager>",
    );
  }
  return ctx;
}

export type RoleManagerProps = Omit<
  React.ComponentProps<"div">,
  "onChange"
> & {
  /** Roles to administer. The first part holds the name, member count, and a System badge for built-in roles. */
  roles: Role[];
  /** Permissions offered in the detail checklist. Adjacent items sharing `group` render under one section header. */
  permissions: Permission[];
  /** Id of the role selected on first render. Falls back to the first role. */
  defaultSelectedId?: string;
  /** Called with the full role set whenever a role is added, duplicated, deleted, or its permissions change. */
  onChange?: (roles: Role[]) => void;
};

function RoleManager({
  roles: rolesProp,
  permissions,
  defaultSelectedId,
  onChange,
  className,
  children,
  ...props
}: RoleManagerProps) {
  const reactId = React.useId();
  const counter = React.useRef(0);
  const [roles, setRoles] = React.useState<Role[]>(rolesProp);
  const [selectedId, setSelectedId] = React.useState<string | null>(
    () => defaultSelectedId ?? rolesProp[0]?.id ?? null,
  );

  const commit = React.useCallback(
    (next: Role[]) => {
      setRoles(next);
      onChange?.(next);
    },
    [onChange],
  );

  const select = React.useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const makeId = React.useCallback(() => {
    counter.current += 1;
    return `${reactId}-role-${counter.current}`;
  }, [reactId]);

  const addRole = React.useCallback(() => {
    const role: Role = {
      id: makeId(),
      name: "New role",
      description: "",
      members: 0,
      permissions: [],
    };
    commit([...roles, role]);
    setSelectedId(role.id);
  }, [roles, commit, makeId]);

  const duplicateRole = React.useCallback(
    (id: string) => {
      const source = roles.find((role) => role.id === id);
      if (!source) return;
      const copy: Role = {
        ...source,
        id: makeId(),
        name: `${source.name} copy`,
        members: 0,
        system: false,
        permissions: [...source.permissions],
      };
      const index = roles.findIndex((role) => role.id === id);
      const next = [...roles];
      next.splice(index + 1, 0, copy);
      commit(next);
      setSelectedId(copy.id);
    },
    [roles, commit, makeId],
  );

  const deleteRole = React.useCallback(
    (id: string) => {
      const target = roles.find((role) => role.id === id);
      if (!target || target.system) return;
      const index = roles.findIndex((role) => role.id === id);
      const next = roles.filter((role) => role.id !== id);
      commit(next);
      setSelectedId((current) => {
        if (current !== id) return current;
        const fallback = next[index] ?? next[index - 1] ?? next[0];
        return fallback?.id ?? null;
      });
    },
    [roles, commit],
  );

  const togglePermission = React.useCallback(
    (roleId: string, permissionId: string, on: boolean) => {
      commit(
        roles.map((role) => {
          if (role.id !== roleId || role.system) return role;
          const has = role.permissions.includes(permissionId);
          if (on === has) return role;
          return {
            ...role,
            permissions: on
              ? [...role.permissions, permissionId]
              : role.permissions.filter((id) => id !== permissionId),
          };
        }),
      );
    },
    [roles, commit],
  );

  const selectedRole =
    roles.find((role) => role.id === selectedId) ?? null;

  const ctx = React.useMemo<RoleManagerContextValue>(
    () => ({
      roles,
      permissions,
      selectedId,
      selectedRole,
      select,
      addRole,
      duplicateRole,
      deleteRole,
      togglePermission,
      baseId: reactId,
    }),
    [
      roles,
      permissions,
      selectedId,
      selectedRole,
      select,
      addRole,
      duplicateRole,
      deleteRole,
      togglePermission,
      reactId,
    ],
  );

  return (
    <RoleManagerContext.Provider value={ctx}>
      <div
        data-slot="role-manager"
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground sm:flex-row sm:divide-x sm:divide-border rtl:sm:divide-x-reverse",
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <div
              data-slot="role-manager-aside"
              className="flex w-full flex-col border-b border-border sm:w-64 sm:shrink-0 sm:border-b-0"
            >
              <RoleManagerToolbar />
              <RoleList />
            </div>
            <RoleManagerDetail />
          </>
        )}
      </div>
    </RoleManagerContext.Provider>
  );
}

export type RoleManagerToolbarProps = React.ComponentProps<"div">;

function RoleManagerToolbar({
  className,
  children,
  ...props
}: RoleManagerToolbarProps) {
  const { roles, addRole } = useRoleManager();
  return (
    <div
      data-slot="role-manager-toolbar"
      className={cn(
        "flex items-center justify-between gap-2 border-b border-border px-3 py-2.5",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <span
            data-slot="role-manager-toolbar-title"
            className="text-sm font-medium text-foreground"
          >
            Roles
            <span className="ms-1.5 text-muted-foreground tabular-nums">
              {roles.length}
            </span>
          </span>
          <Button
            data-slot="role-manager-add"
            type="button"
            variant="outline"
            size="sm"
            onClick={addRole}
          >
            <Plus />
            New
          </Button>
        </>
      )}
    </div>
  );
}

export type RoleListProps = React.ComponentProps<"ul">;

function RoleList({ className, children, ...props }: RoleListProps) {
  const { roles } = useRoleManager();
  return (
    <ul
      data-slot="role-list"
      className={cn("flex-1 overflow-y-auto p-1.5", className)}
      {...props}
    >
      {children ??
        roles.map((role) => <RoleItem key={role.id} role={role} />)}
    </ul>
  );
}

export type RoleItemProps = Omit<
  React.ComponentProps<"li">,
  "children" | "role"
> & {
  role: Role;
};

function RoleItem({ role, className, ...props }: RoleItemProps) {
  const { selectedId, select } = useRoleManager();
  const active = selectedId === role.id;
  return (
    <li data-slot="role-item" {...props}>
      <button
        type="button"
        data-slot="role-item-trigger"
        data-active={active || undefined}
        aria-pressed={active}
        onClick={() => select(role.id)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-start transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          active
            ? "bg-accent text-accent-foreground"
            : "text-foreground hover:bg-accent/50",
          className,
        )}
      >
        <Shield
          aria-hidden
          className={cn(
            "size-4 shrink-0",
            active ? "text-primary" : "text-muted-foreground",
          )}
        />
        <span className="flex min-w-0 flex-1 flex-col">
          <span
            data-slot="role-item-name"
            className="truncate text-sm font-medium"
          >
            {role.name}
          </span>
          <span
            data-slot="role-item-meta"
            className="flex items-center gap-1 text-xs text-muted-foreground"
          >
            <Users aria-hidden className="size-3" />
            <span className="tabular-nums">{role.members ?? 0}</span>
          </span>
        </span>
        {role.system ? (
          <Badge
            data-slot="role-item-system"
            variant="secondary"
            className="shrink-0"
          >
            System
          </Badge>
        ) : null}
      </button>
    </li>
  );
}

export type RoleManagerDetailProps = React.ComponentProps<"div">;

function RoleManagerDetail({
  className,
  children,
  ...props
}: RoleManagerDetailProps) {
  const { selectedRole } = useRoleManager();
  return (
    <div
      data-slot="role-manager-detail"
      className={cn("flex min-w-0 flex-1 flex-col", className)}
      {...props}
    >
      {children ??
        (selectedRole ? (
          <>
            <div
              data-slot="role-manager-detail-header"
              className="flex items-start justify-between gap-3 border-b border-border px-5 py-4"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3
                    data-slot="role-manager-detail-name"
                    className="truncate text-base font-semibold text-foreground"
                  >
                    {selectedRole.name}
                  </h3>
                  {selectedRole.system ? (
                    <Badge
                      data-slot="role-manager-detail-system"
                      variant="secondary"
                    >
                      System
                    </Badge>
                  ) : null}
                </div>
                {selectedRole.description ? (
                  <p
                    data-slot="role-manager-detail-description"
                    className="text-sm text-muted-foreground"
                  >
                    {selectedRole.description}
                  </p>
                ) : null}
              </div>
              <RoleManagerDetailActions />
            </div>
            <RolePermissions />
          </>
        ) : (
          <div
            data-slot="role-manager-empty"
            className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground"
          >
            No role selected
          </div>
        ))}
    </div>
  );
}

export type RoleManagerDetailActionsProps = React.ComponentProps<"div">;

function RoleManagerDetailActions({
  className,
  children,
  ...props
}: RoleManagerDetailActionsProps) {
  const { selectedRole, duplicateRole, deleteRole } = useRoleManager();
  if (!selectedRole) return null;
  return (
    <div
      data-slot="role-manager-detail-actions"
      className={cn("flex shrink-0 items-center gap-1", className)}
      {...props}
    >
      {children ?? (
        <>
          <Button
            data-slot="role-manager-duplicate"
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => duplicateRole(selectedRole.id)}
            aria-label={`Duplicate ${selectedRole.name}`}
          >
            <Copy />
          </Button>
          <Button
            data-slot="role-manager-delete"
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => deleteRole(selectedRole.id)}
            disabled={selectedRole.system}
            aria-label={`Delete ${selectedRole.name}`}
          >
            <Trash2 />
          </Button>
        </>
      )}
    </div>
  );
}

export type RolePermissionsProps = React.ComponentProps<"div">;

function RolePermissions({ className, ...props }: RolePermissionsProps) {
  const { selectedRole, permissions, togglePermission, baseId } =
    useRoleManager();

  const grouped = React.useMemo(() => {
    const sections: { group?: string; items: Permission[] }[] = [];
    for (const permission of permissions) {
      const last = sections[sections.length - 1];
      if (last && last.group === permission.group) {
        last.items.push(permission);
      } else {
        sections.push({ group: permission.group, items: [permission] });
      }
    }
    return sections;
  }, [permissions]);

  if (!selectedRole) return null;
  const readOnly = selectedRole.system === true;

  return (
    <div
      data-slot="role-permissions"
      className={cn("flex-1 overflow-y-auto p-5", className)}
      {...props}
    >
      {readOnly ? (
        <p
          data-slot="role-permissions-readonly"
          className="mb-4 text-xs text-muted-foreground"
        >
          System role. Permissions are read-only.
        </p>
      ) : null}
      <div className="flex flex-col gap-5">
        {grouped.map((section, index) => (
          <div
            key={section.group ?? `section-${index}`}
            data-slot="role-permissions-group"
            className="flex flex-col gap-2"
          >
            {section.group ? (
              <p
                data-slot="role-permissions-group-label"
                className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground"
              >
                {section.group}
              </p>
            ) : null}
            {section.items.map((permission) => {
              const checkboxId = `${baseId}-${selectedRole.id}-${permission.id}`;
              const checked = selectedRole.permissions.includes(permission.id);
              return (
                <label
                  key={permission.id}
                  data-slot="role-permission-item"
                  htmlFor={checkboxId}
                  className={cn(
                    "flex items-center gap-2.5 text-sm text-foreground",
                    readOnly && "cursor-not-allowed opacity-70",
                  )}
                >
                  <Checkbox
                    data-slot="role-permission-checkbox"
                    id={checkboxId}
                    checked={checked}
                    disabled={readOnly}
                    onCheckedChange={(next) =>
                      togglePermission(
                        selectedRole.id,
                        permission.id,
                        next === true,
                      )
                    }
                  />
                  <span data-slot="role-permission-label">
                    {permission.label}
                  </span>
                </label>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export {
  RoleManager,
  RoleManagerToolbar,
  RoleList,
  RoleItem,
  RoleManagerDetail,
  RoleManagerDetailActions,
  RolePermissions,
};

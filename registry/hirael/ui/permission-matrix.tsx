"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/registry/hirael/ui/checkbox";

type Role = { id: string; label: string };

type Permission = { id: string; label: string; group?: string };

type GrantState = Record<string, string[]>;

type CheckedState = boolean | "indeterminate";

type PermissionMatrixContextValue = {
  roles: Role[];
  permissions: Permission[];
  value: GrantState;
  isGranted: (permissionId: string, roleId: string) => boolean;
  toggleCell: (permissionId: string, roleId: string, granted: boolean) => void;
  setRow: (permissionId: string, granted: boolean) => void;
  setColumn: (roleId: string, granted: boolean) => void;
  rowState: (permissionId: string) => CheckedState;
  columnState: (roleId: string) => CheckedState;
};

const PermissionMatrixContext =
  React.createContext<PermissionMatrixContextValue | null>(null);

function usePermissionMatrix() {
  const ctx = React.useContext(PermissionMatrixContext);
  if (!ctx) {
    throw new Error(
      "PermissionMatrix compound parts must be used inside <PermissionMatrix>",
    );
  }
  return ctx;
}

function resolveState(granted: number, total: number): CheckedState {
  if (total === 0 || granted === 0) return false;
  if (granted === total) return true;
  return "indeterminate";
}

export type PermissionMatrixProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** Columns of the grid. Each role renders one checkbox column. */
  roles: Role[];
  /** Rows of the grid. Group adjacent permissions under a section header with `group`. */
  permissions: Permission[];
  /** Controlled grant map of permission id to the role ids that hold it. */
  value?: GrantState;
  /** Initial grant map for uncontrolled use. */
  defaultValue?: GrantState;
  /** Called with the next grant map whenever a grant changes. */
  onValueChange?: (value: GrantState) => void;
  /** Show a master checkbox in each column header that toggles the whole column. */
  columnToggles?: boolean;
  /** Show a leading toggle-all checkbox on each permission row. */
  rowToggles?: boolean;
};

function PermissionMatrix({
  roles,
  permissions,
  value: valueProp,
  defaultValue,
  onValueChange,
  columnToggles = true,
  rowToggles = false,
  className,
  children,
  ...props
}: PermissionMatrixProps) {
  const [internalValue, setInternalValue] = React.useState<GrantState>(
    () => defaultValue ?? {},
  );
  const value = valueProp ?? internalValue;

  const setValue = React.useCallback(
    (next: GrantState) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const isGranted = React.useCallback(
    (permissionId: string, roleId: string) =>
      (value[permissionId] ?? []).includes(roleId),
    [value],
  );

  const toggleCell = React.useCallback(
    (permissionId: string, roleId: string, granted: boolean) => {
      const current = value[permissionId] ?? [];
      const next = granted
        ? current.includes(roleId)
          ? current
          : [...current, roleId]
        : current.filter((id) => id !== roleId);
      setValue({ ...value, [permissionId]: next });
    },
    [value, setValue],
  );

  const setRow = React.useCallback(
    (permissionId: string, granted: boolean) => {
      setValue({
        ...value,
        [permissionId]: granted ? roles.map((role) => role.id) : [],
      });
    },
    [value, setValue, roles],
  );

  const setColumn = React.useCallback(
    (roleId: string, granted: boolean) => {
      const next: GrantState = { ...value };
      for (const permission of permissions) {
        const current = next[permission.id] ?? [];
        next[permission.id] = granted
          ? current.includes(roleId)
            ? current
            : [...current, roleId]
          : current.filter((id) => id !== roleId);
      }
      setValue(next);
    },
    [value, setValue, permissions],
  );

  const rowState = React.useCallback(
    (permissionId: string) => {
      const granted = roles.reduce(
        (count, role) => count + (isGranted(permissionId, role.id) ? 1 : 0),
        0,
      );
      return resolveState(granted, roles.length);
    },
    [roles, isGranted],
  );

  const columnState = React.useCallback(
    (roleId: string) => {
      const granted = permissions.reduce(
        (count, permission) =>
          count + (isGranted(permission.id, roleId) ? 1 : 0),
        0,
      );
      return resolveState(granted, permissions.length);
    },
    [permissions, isGranted],
  );

  const ctx = React.useMemo<PermissionMatrixContextValue>(
    () => ({
      roles,
      permissions,
      value,
      isGranted,
      toggleCell,
      setRow,
      setColumn,
      rowState,
      columnState,
    }),
    [
      roles,
      permissions,
      value,
      isGranted,
      toggleCell,
      setRow,
      setColumn,
      rowState,
      columnState,
    ],
  );

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

  return (
    <PermissionMatrixContext.Provider value={ctx}>
      <div
        data-slot="permission-matrix"
        className={cn(
          "relative w-full overflow-x-auto rounded-lg border border-border bg-card text-card-foreground",
          className,
        )}
        {...props}
      >
        {children ?? (
          <table
            data-slot="permission-matrix-table"
            className="w-full border-collapse text-sm"
          >
            <PermissionMatrixHeader
              columnToggles={columnToggles}
              rowToggles={rowToggles}
            />
            <tbody data-slot="permission-matrix-body">
              {grouped.map((section, index) => (
                <React.Fragment key={section.group ?? `section-${index}`}>
                  {section.group ? (
                    <PermissionGroupRow rowToggles={rowToggles}>
                      {section.group}
                    </PermissionGroupRow>
                  ) : null}
                  {section.items.map((permission) => (
                    <PermissionRow
                      key={permission.id}
                      permission={permission}
                      rowToggles={rowToggles}
                    />
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PermissionMatrixContext.Provider>
  );
}

export type PermissionMatrixHeaderProps = React.ComponentProps<"thead"> & {
  columnToggles?: boolean;
  rowToggles?: boolean;
};

function PermissionMatrixHeader({
  columnToggles = true,
  rowToggles = false,
  className,
  ...props
}: PermissionMatrixHeaderProps) {
  const { roles, setColumn, columnState } = usePermissionMatrix();
  return (
    <thead
      data-slot="permission-matrix-header"
      className={cn("border-b border-border bg-muted/40", className)}
      {...props}
    >
      <tr data-slot="permission-matrix-header-row">
        <th
          scope="col"
          data-slot="permission-matrix-corner"
          className="sticky start-0 z-10 bg-muted/40 px-4 py-3 text-start align-bottom font-medium text-muted-foreground"
        >
          Permission
        </th>
        {rowToggles ? (
          <th
            scope="col"
            data-slot="permission-matrix-row-toggle-head"
            className="px-3 py-3 text-center align-bottom font-medium text-muted-foreground"
          >
            <span className="sr-only">Toggle all roles per permission</span>
            All
          </th>
        ) : null}
        {roles.map((role) => {
          const state = columnState(role.id);
          return (
            <th
              key={role.id}
              scope="col"
              data-slot="permission-matrix-role"
              className="px-3 py-3 text-center align-bottom font-medium text-foreground"
            >
              <div className="flex flex-col items-center gap-2">
                <span>{role.label}</span>
                {columnToggles ? (
                  <Checkbox
                    data-slot="permission-matrix-column-toggle"
                    checked={state}
                    onCheckedChange={(checked) =>
                      setColumn(role.id, checked === true)
                    }
                    aria-label={`Grant all to ${role.label}`}
                  />
                ) : null}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export type PermissionGroupRowProps = React.ComponentProps<"tr"> & {
  rowToggles?: boolean;
};

function PermissionGroupRow({
  rowToggles = false,
  className,
  children,
  ...props
}: PermissionGroupRowProps) {
  const { roles } = usePermissionMatrix();
  return (
    <tr
      data-slot="permission-group-row"
      className={cn("border-b border-border bg-muted/20", className)}
      {...props}
    >
      <th
        scope="colgroup"
        colSpan={roles.length + 1 + (rowToggles ? 1 : 0)}
        className="sticky start-0 bg-muted/20 px-4 py-2 text-start text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground"
      >
        {children}
      </th>
    </tr>
  );
}

export type PermissionRowProps = Omit<
  React.ComponentProps<"tr">,
  "children"
> & {
  permission: Permission;
  rowToggles?: boolean;
};

function PermissionRow({
  permission,
  rowToggles = false,
  className,
  ...props
}: PermissionRowProps) {
  const { roles, isGranted, toggleCell, setRow, rowState } =
    usePermissionMatrix();
  const state = rowState(permission.id);
  return (
    <tr
      data-slot="permission-row"
      className={cn(
        "border-b border-border last:border-b-0 transition-colors hover:bg-accent/40",
        className,
      )}
      {...props}
    >
      <th
        scope="row"
        data-slot="permission-label"
        className="sticky start-0 z-10 bg-card px-4 py-2.5 text-start font-normal text-foreground"
      >
        {permission.label}
      </th>
      {rowToggles ? (
        <td
          data-slot="permission-row-toggle-cell"
          className="px-3 py-2.5 text-center"
        >
          <Checkbox
            data-slot="permission-row-toggle"
            checked={state}
            onCheckedChange={(checked) =>
              setRow(permission.id, checked === true)
            }
            aria-label={`Grant ${permission.label} to all roles`}
          />
        </td>
      ) : null}
      {roles.map((role) => (
        <PermissionCell
          key={role.id}
          checked={isGranted(permission.id, role.id)}
          onCheckedChange={(checked) =>
            toggleCell(permission.id, role.id, checked)
          }
          aria-label={`Grant ${permission.label} to ${role.label}`}
        />
      ))}
    </tr>
  );
}

export type PermissionCellProps = Omit<
  React.ComponentProps<"td">,
  "onChange"
> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Accessible name for the cell checkbox, e.g. "Grant Edit to Admin". */
  "aria-label"?: string;
  disabled?: boolean;
};

function PermissionCell({
  checked = false,
  onCheckedChange,
  disabled,
  className,
  "aria-label": ariaLabel,
  ...props
}: PermissionCellProps) {
  return (
    <td
      data-slot="permission-cell"
      className={cn("px-3 py-2.5 text-center", className)}
      {...props}
    >
      <Checkbox
        data-slot="permission-cell-checkbox"
        checked={checked}
        disabled={disabled}
        onCheckedChange={(next) => onCheckedChange?.(next === true)}
        aria-label={ariaLabel}
        className="mx-auto"
      />
    </td>
  );
}

export {
  PermissionMatrix,
  PermissionMatrixHeader,
  PermissionGroupRow,
  PermissionRow,
  PermissionCell,
};

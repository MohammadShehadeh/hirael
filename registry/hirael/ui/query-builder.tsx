"use client";

import * as React from "react";
import { FolderPlus, Plus, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";
import { Input } from "@/registry/hirael/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/hirael/ui/select";

type QueryCombinatorValue = "and" | "or";

type QueryRule = {
  id: string;
  field: string;
  operator: string;
  value: string;
};

type QueryGroupNode = {
  id: string;
  combinator: QueryCombinatorValue;
  rules: QueryNode[];
};

type QueryNode = QueryGroupNode | QueryRule;

type QueryField = {
  name: string;
  label: string;
  operators?: string[];
};

const DEFAULT_OPERATORS = [
  "is",
  "is not",
  "contains",
  "before",
  "after",
  "greater than",
  "less than",
];

function isGroupNode(node: QueryNode): node is QueryGroupNode {
  return "combinator" in node;
}

function removeNode(group: QueryGroupNode, id: string): QueryGroupNode {
  return {
    ...group,
    rules: group.rules
      .filter((rule) => rule.id !== id)
      .map((rule) => (isGroupNode(rule) ? removeNode(rule, id) : rule)),
  };
}

function appendNode(
  group: QueryGroupNode,
  parentId: string,
  child: QueryNode,
): QueryGroupNode {
  if (group.id === parentId) {
    return { ...group, rules: [...group.rules, child] };
  }
  return {
    ...group,
    rules: group.rules.map((rule) =>
      isGroupNode(rule) ? appendNode(rule, parentId, child) : rule,
    ),
  };
}

type QueryBuilderContextValue = {
  fields: QueryField[];
  rootId: string;
  createId: () => string;
  addRule: (parentId: string) => void;
  addGroup: (parentId: string) => void;
  removeRule: (id: string) => void;
  updateRule: (id: string, patch: Partial<Omit<QueryRule, "id">>) => void;
  setCombinator: (id: string, combinator: QueryCombinatorValue) => void;
};

const QueryBuilderContext =
  React.createContext<QueryBuilderContextValue | null>(null);

function useQueryBuilder(): QueryBuilderContextValue {
  const context = React.useContext(QueryBuilderContext);
  if (!context) {
    throw new Error("QueryBuilder parts must be used within <QueryBuilder>.");
  }
  return context;
}

function operatorsForField(
  fields: QueryField[],
  fieldName: string,
): string[] {
  const field = fields.find((item) => item.name === fieldName);
  return field?.operators ?? DEFAULT_OPERATORS;
}

type QueryBuilderProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** Selectable fields. Each field can carry its own operator list. */
  fields: QueryField[];
  /** Controlled root group. */
  value?: QueryGroupNode;
  /** Initial root group for uncontrolled use. */
  defaultValue?: QueryGroupNode;
  /** Called with the next root group whenever the tree changes. */
  onValueChange?: (value: QueryGroupNode) => void;
};

function QueryBuilder({
  fields,
  value,
  defaultValue,
  onValueChange,
  className,
  ...props
}: QueryBuilderProps) {
  const idPrefix = React.useId();
  const counter = React.useRef(0);

  const createId = React.useCallback(() => {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }
    counter.current += 1;
    return `${idPrefix}node-${counter.current}`;
  }, [idPrefix]);

  const [uncontrolled, setUncontrolled] = React.useState<QueryGroupNode>(
    () =>
      defaultValue ?? {
        id: `${idPrefix}root`,
        combinator: "and",
        rules: [],
      },
  );

  const isControlled = value !== undefined;
  const root = isControlled ? value : uncontrolled;

  const commit = React.useCallback(
    (next: QueryGroupNode) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const addRule = React.useCallback(
    (parentId: string) => {
      const fallbackField = fields[0]?.name ?? "";
      const child: QueryRule = {
        id: createId(),
        field: fallbackField,
        operator: operatorsForField(fields, fallbackField)[0] ?? "",
        value: "",
      };
      commit(appendNode(root, parentId, child));
    },
    [commit, createId, fields, root],
  );

  const addGroup = React.useCallback(
    (parentId: string) => {
      const child: QueryGroupNode = {
        id: createId(),
        combinator: "and",
        rules: [],
      };
      commit(appendNode(root, parentId, child));
    },
    [commit, createId, root],
  );

  const removeRule = React.useCallback(
    (id: string) => {
      commit(removeNode(root, id));
    },
    [commit, root],
  );

  const updateRule = React.useCallback(
    (id: string, patch: Partial<Omit<QueryRule, "id">>) => {
      const apply = (group: QueryGroupNode): QueryGroupNode => ({
        ...group,
        rules: group.rules.map((rule) => {
          if (rule.id === id && !isGroupNode(rule)) {
            return { ...rule, ...patch };
          }
          return isGroupNode(rule) ? apply(rule) : rule;
        }),
      });
      commit(apply(root));
    },
    [commit, root],
  );

  const setCombinator = React.useCallback(
    (id: string, combinator: QueryCombinatorValue) => {
      const apply = (group: QueryGroupNode): QueryGroupNode => ({
        ...group,
        combinator: group.id === id ? combinator : group.combinator,
        rules: group.rules.map((rule) =>
          isGroupNode(rule) ? apply(rule) : rule,
        ),
      });
      commit(apply(root));
    },
    [commit, root],
  );

  const context = React.useMemo<QueryBuilderContextValue>(
    () => ({
      fields,
      rootId: root.id,
      createId,
      addRule,
      addGroup,
      removeRule,
      updateRule,
      setCombinator,
    }),
    [
      fields,
      root.id,
      createId,
      addRule,
      addGroup,
      removeRule,
      updateRule,
      setCombinator,
    ],
  );

  return (
    <QueryBuilderContext.Provider value={context}>
      <div
        data-slot="query-builder"
        className={cn("w-full text-sm text-foreground", className)}
        {...props}
      >
        <QueryGroup node={root} />
      </div>
    </QueryBuilderContext.Provider>
  );
}

type QueryGroupProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The group node this part renders recursively. */
  node: QueryGroupNode;
};

function QueryGroup({ node, className, ...props }: QueryGroupProps) {
  const { rootId, addRule, addGroup, removeRule, setCombinator } =
    useQueryBuilder();
  const isRoot = node.id === rootId;

  return (
    <div
      data-slot="query-group"
      data-root={isRoot ? "" : undefined}
      className={cn(
        "rounded-md border border-border bg-card/40 p-3",
        !isRoot && "bg-muted/30",
        className,
      )}
      {...props}
    >
      <div
        data-slot="query-group-header"
        className="flex flex-wrap items-center gap-2"
      >
        <QueryCombinator
          value={node.combinator}
          onValueChange={(next) => setCombinator(node.id, next)}
        />
        <span className="text-xs text-muted-foreground">
          Match {node.combinator === "and" ? "all" : "any"} of the following
        </span>
        {!isRoot ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="ms-auto text-muted-foreground hover:text-destructive"
            onClick={() => removeRule(node.id)}
            aria-label="Remove group"
          >
            <Trash2 />
          </Button>
        ) : null}
      </div>

      <div
        data-slot="query-group-body"
        className={cn(
          "mt-3 flex flex-col gap-2 border-s border-border ps-3",
          node.rules.length === 0 && "border-dashed",
        )}
      >
        {node.rules.length === 0 ? (
          <p
            data-slot="query-empty"
            className="py-1 text-xs text-muted-foreground"
          >
            No rules yet.
          </p>
        ) : (
          node.rules.map((rule) =>
            isGroupNode(rule) ? (
              <QueryGroup key={rule.id} node={rule} />
            ) : (
              <QueryRule key={rule.id} rule={rule} />
            ),
          )
        )}
      </div>

      <div
        data-slot="query-group-actions"
        className="mt-3 flex flex-wrap gap-2"
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addRule(node.id)}
        >
          <Plus />
          Add rule
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addGroup(node.id)}
        >
          <FolderPlus />
          Add group
        </Button>
      </div>
    </div>
  );
}

type QueryCombinatorProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  /** The active combinator. */
  value: QueryCombinatorValue;
  /** Called when a combinator is selected. */
  onValueChange: (value: QueryCombinatorValue) => void;
};

function QueryCombinator({
  value,
  onValueChange,
  className,
  ...props
}: QueryCombinatorProps) {
  const options: QueryCombinatorValue[] = ["and", "or"];

  return (
    <div
      data-slot="query-combinator"
      role="group"
      aria-label="Combinator"
      className={cn(
        "inline-flex items-center rounded-md border border-input p-0.5",
        className,
      )}
      {...props}
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            data-slot="query-combinator-option"
            data-state={active ? "active" : "inactive"}
            aria-pressed={active}
            onClick={() => onValueChange(option)}
            className={cn(
              "rounded-sm px-2.5 py-1 text-xs font-medium uppercase tracking-[0.06em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

type QueryRuleProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The rule node this part renders. */
  rule: QueryRule;
};

function QueryRule({ rule, className, ...props }: QueryRuleProps) {
  const { fields, removeRule, updateRule } = useQueryBuilder();
  const operators = operatorsForField(fields, rule.field);

  return (
    <div
      data-slot="query-rule"
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-md border border-border bg-background p-2",
        className,
      )}
      {...props}
    >
      <Select
        value={rule.field}
        onValueChange={(field) => {
          const nextOperators = operatorsForField(fields, field);
          const operator = nextOperators.includes(rule.operator)
            ? rule.operator
            : (nextOperators[0] ?? "");
          updateRule(rule.id, { field, operator });
        }}
      >
        <SelectTrigger
          size="sm"
          data-slot="query-rule-field"
          className="w-36"
          aria-label="Field"
        >
          <SelectValue placeholder="Field" />
        </SelectTrigger>
        <SelectContent>
          {fields.map((field) => (
            <SelectItem key={field.name} value={field.name}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={rule.operator}
        onValueChange={(operator) => updateRule(rule.id, { operator })}
      >
        <SelectTrigger
          size="sm"
          data-slot="query-rule-operator"
          className="w-36"
          aria-label="Operator"
        >
          <SelectValue placeholder="Operator" />
        </SelectTrigger>
        <SelectContent>
          {operators.map((operator) => (
            <SelectItem key={operator} value={operator}>
              {operator}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        data-slot="query-rule-value"
        className="h-8 w-40 flex-1"
        value={rule.value}
        placeholder="Value"
        aria-label="Value"
        onChange={(event) => updateRule(rule.id, { value: event.target.value })}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="ms-auto text-muted-foreground hover:text-destructive"
        onClick={() => removeRule(rule.id)}
        aria-label="Remove rule"
      >
        <X />
      </Button>
    </div>
  );
}

export {
  QueryBuilder,
  QueryGroup,
  QueryRule,
  QueryCombinator,
  DEFAULT_OPERATORS,
};
export type {
  QueryBuilderProps,
  QueryGroupProps,
  QueryRuleProps,
  QueryCombinatorProps,
  QueryField,
  QueryNode,
  QueryGroupNode,
  QueryCombinatorValue,
};

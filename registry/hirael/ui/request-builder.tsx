"use client";

import * as React from "react";
import { Plus, Send, X } from "lucide-react";

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
import { TabsContent } from "@/registry/hirael/ui/tabs";

type RequestMethodName = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const METHODS: readonly RequestMethodName[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
];

type RequestKeyValue = {
  id: string;
  name: string;
  value: string;
  enabled: boolean;
};

type RequestBuilderContextValue = {
  method: RequestMethodName;
  setMethod: (method: RequestMethodName) => void;
  url: string;
  setUrl: (url: string) => void;
  body: string;
  setBody: (body: string) => void;
  createId: () => string;
};

const RequestBuilderContext =
  React.createContext<RequestBuilderContextValue | null>(null);

function useRequestBuilder() {
  const context = React.useContext(RequestBuilderContext);
  if (!context) {
    throw new Error("RequestBuilder parts must be used within <RequestBuilder>.");
  }
  return context;
}

type RequestBuilderProps = React.ComponentProps<"div"> & {
  /** Method selected when the builder first renders. */
  defaultMethod?: RequestMethodName;
  /** URL shown in the address input when the builder first renders. */
  defaultUrl?: string;
};

function RequestBuilder({
  defaultMethod = "GET",
  defaultUrl = "",
  className,
  ...props
}: RequestBuilderProps) {
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
    return `${idPrefix}row-${counter.current}`;
  }, [idPrefix]);

  const [method, setMethod] = React.useState<RequestMethodName>(defaultMethod);
  const [url, setUrl] = React.useState(defaultUrl);
  const [body, setBody] = React.useState("");

  const value = React.useMemo<RequestBuilderContextValue>(
    () => ({ method, setMethod, url, setUrl, body, setBody, createId }),
    [method, url, body, createId],
  );

  return (
    <RequestBuilderContext.Provider value={value}>
      <div
        data-slot="request-builder"
        className={cn(
          "flex w-full flex-col gap-3 rounded-lg border border-border bg-card text-card-foreground",
          className,
        )}
        {...props}
      />
    </RequestBuilderContext.Provider>
  );
}

type RequestBarProps = React.ComponentProps<"div">;

function RequestBar({ className, ...props }: RequestBarProps) {
  return (
    <div
      data-slot="request-bar"
      className={cn(
        "flex flex-wrap items-center gap-2 border-b border-border p-3",
        className,
      )}
      {...props}
    />
  );
}

type RequestMethodProps = Omit<
  React.ComponentProps<typeof SelectTrigger>,
  "value" | "defaultValue" | "onValueChange"
>;

function RequestMethod({ className, ...props }: RequestMethodProps) {
  const { method, setMethod } = useRequestBuilder();
  return (
    <Select
      value={method}
      onValueChange={(next) => setMethod(next as RequestMethodName)}
    >
      <SelectTrigger
        data-slot="request-method"
        aria-label="Request method"
        className={cn("w-28 font-mono text-xs tracking-[0.08em]", className)}
        {...props}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {METHODS.map((name) => (
          <SelectItem
            key={name}
            value={name}
            className="font-mono text-xs tracking-[0.08em]"
          >
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

type RequestUrlProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "defaultValue" | "onChange"
>;

function RequestUrl({ className, ...props }: RequestUrlProps) {
  const { url, setUrl } = useRequestBuilder();
  return (
    <Input
      data-slot="request-url"
      type="text"
      inputMode="url"
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      aria-label="Request URL"
      placeholder="https://api.example.com/v1/users"
      value={url}
      onChange={(event) => setUrl(event.target.value)}
      className={cn("min-w-48 flex-1 font-mono text-xs", className)}
      {...props}
    />
  );
}

type RequestSendProps = React.ComponentProps<typeof Button> & {
  /** Show a busy state and disable the control while a request is in flight. */
  pending?: boolean;
};

function RequestSend({
  pending = false,
  disabled,
  className,
  children,
  ...props
}: RequestSendProps) {
  return (
    <Button
      type="button"
      data-slot="request-send"
      data-pending={pending ? "" : undefined}
      disabled={disabled ?? pending}
      className={cn(className)}
      {...props}
    >
      <Send className={cn(pending && "animate-pulse")} aria-hidden />
      {children ?? (pending ? "Sending" : "Send")}
    </Button>
  );
}

type RequestSectionProps = React.ComponentProps<typeof TabsContent>;

function RequestSection({ className, ...props }: RequestSectionProps) {
  return (
    <TabsContent
      data-slot="request-section"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

type RequestKeyValuesProps = Omit<
  React.ComponentProps<"div">,
  "onChange"
> & {
  /** The rows to render. Each needs a stable `id`. */
  rows: RequestKeyValue[];
  /** Called with the next rows whenever a value, toggle, add, or remove fires. */
  onChange: (rows: RequestKeyValue[]) => void;
  /** Label for the add-row button. */
  addLabel?: string;
  /** Placeholder for the key field. */
  namePlaceholder?: string;
  /** Placeholder for the value field. */
  valuePlaceholder?: string;
};

function RequestKeyValues({
  rows,
  onChange,
  addLabel = "Add row",
  namePlaceholder = "Key",
  valuePlaceholder = "Value",
  className,
  ...props
}: RequestKeyValuesProps) {
  const { createId } = useRequestBuilder();

  const update = React.useCallback(
    (id: string, patch: Partial<RequestKeyValue>) => {
      onChange(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
    },
    [onChange, rows],
  );

  const remove = React.useCallback(
    (id: string) => {
      onChange(rows.filter((row) => row.id !== id));
    },
    [onChange, rows],
  );

  const add = React.useCallback(() => {
    onChange([
      ...rows,
      { id: createId(), name: "", value: "", enabled: true },
    ]);
  }, [createId, onChange, rows]);

  return (
    <div
      data-slot="request-key-values"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {rows.length === 0 ? (
        <p
          data-slot="request-key-values-empty"
          className="px-1 py-2 text-xs text-muted-foreground"
        >
          No rows yet.
        </p>
      ) : (
        rows.map((row) => (
          <RequestKeyValueRow
            key={row.id}
            row={row}
            namePlaceholder={namePlaceholder}
            valuePlaceholder={valuePlaceholder}
            onNameChange={(name) => update(row.id, { name })}
            onValueChange={(value) => update(row.id, { value })}
            onEnabledChange={(enabled) => update(row.id, { enabled })}
            onRemove={() => remove(row.id)}
          />
        ))
      )}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={add}
        className="self-start text-muted-foreground"
      >
        <Plus aria-hidden />
        {addLabel}
      </Button>
    </div>
  );
}

type RequestKeyValueRowProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  /** The row this control edits. */
  row: RequestKeyValue;
  onNameChange: (name: string) => void;
  onValueChange: (value: string) => void;
  onEnabledChange: (enabled: boolean) => void;
  onRemove: () => void;
  namePlaceholder?: string;
  valuePlaceholder?: string;
};

function RequestKeyValueRow({
  row,
  onNameChange,
  onValueChange,
  onEnabledChange,
  onRemove,
  namePlaceholder = "Key",
  valuePlaceholder = "Value",
  className,
  ...props
}: RequestKeyValueRowProps) {
  return (
    <div
      data-slot="request-key-value-row"
      data-enabled={row.enabled ? "" : undefined}
      className={cn(
        "flex items-center gap-2 data-[enabled]:opacity-100",
        !row.enabled && "opacity-60",
        className,
      )}
      {...props}
    >
      <input
        type="checkbox"
        data-slot="request-key-value-toggle"
        checked={row.enabled}
        onChange={(event) => onEnabledChange(event.target.checked)}
        aria-label={
          row.name ? `Enable ${row.name}` : "Enable row"
        }
        className="size-4 shrink-0 rounded-sm border border-input bg-transparent accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      />
      <Input
        type="text"
        data-slot="request-key-value-name"
        value={row.name}
        onChange={(event) => onNameChange(event.target.value)}
        placeholder={namePlaceholder}
        autoComplete="off"
        spellCheck={false}
        className="h-8 flex-1 font-mono text-xs"
      />
      <Input
        type="text"
        data-slot="request-key-value-value"
        value={row.value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={valuePlaceholder}
        autoComplete="off"
        spellCheck={false}
        className="h-8 flex-1 font-mono text-xs"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        aria-label={row.name ? `Remove ${row.name}` : "Remove row"}
        className="shrink-0 text-muted-foreground"
      >
        <X aria-hidden />
      </Button>
    </div>
  );
}

type RequestBodyProps = Omit<
  React.ComponentProps<"textarea">,
  "value" | "defaultValue" | "onChange"
>;

function RequestBody({ className, rows = 6, ...props }: RequestBodyProps) {
  const { body, setBody } = useRequestBuilder();
  return (
    <textarea
      data-slot="request-body"
      value={body}
      onChange={(event) => setBody(event.target.value)}
      rows={rows}
      spellCheck={false}
      placeholder={'{\n  "key": "value"\n}'}
      aria-label="Request body"
      className={cn(
        "w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs leading-relaxed text-foreground shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
        className,
      )}
      {...props}
    />
  );
}

type RequestResponseProps = React.ComponentProps<"div"> & {
  /** Response time, formatted by the caller (for example "142 ms"). */
  time?: React.ReactNode;
  /** Response size, formatted by the caller (for example "1.2 KB"). */
  size?: React.ReactNode;
};

function RequestResponse({
  time,
  size,
  className,
  children,
  ...props
}: RequestResponseProps) {
  const hasMeta = time != null || size != null;
  return (
    <div
      data-slot="request-response"
      className={cn(
        "flex flex-col gap-2 border-t border-border p-3",
        className,
      )}
      {...props}
    >
      {hasMeta ? (
        <div
          data-slot="request-response-meta"
          className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground"
        >
          {children}
          <span className="ms-auto flex items-center gap-x-4">
            {time != null ? (
              <span data-slot="request-response-time">{time}</span>
            ) : null}
            {size != null ? (
              <span data-slot="request-response-size">{size}</span>
            ) : null}
          </span>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

type RequestStatusProps = React.ComponentProps<"span"> & {
  /** HTTP status code. 2xx/3xx read as success, 4xx/5xx as error. */
  status: number;
};

const STATUS_TEXT: Record<number, string> = {
  200: "OK",
  201: "Created",
  202: "Accepted",
  204: "No Content",
  301: "Moved Permanently",
  302: "Found",
  304: "Not Modified",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
};

function RequestStatus({ status, className, children, ...props }: RequestStatusProps) {
  const isError = status >= 400;
  const label = STATUS_TEXT[status];
  return (
    <span
      data-slot="request-status"
      data-tone={isError ? "error" : "success"}
      className={cn(
        "inline-flex shrink-0 items-center rounded-sm border px-1.5 py-0.5 font-mono text-[11px] leading-none",
        isError
          ? "border-destructive/30 text-destructive"
          : "border-primary/30 text-foreground",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          {status}
          {label ? <span className="ms-1.5 opacity-70">{label}</span> : null}
        </>
      )}
    </span>
  );
}

function RequestBodyPre({ className, ...props }: React.ComponentProps<"pre">) {
  return (
    <pre
      data-slot="request-response-body"
      className={cn(
        "overflow-x-auto rounded-md border border-border bg-muted/30 p-3 font-mono text-xs leading-relaxed text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  RequestBuilder,
  RequestBar,
  RequestMethod,
  RequestUrl,
  RequestSend,
  RequestSection,
  RequestKeyValues,
  RequestKeyValueRow,
  RequestBody,
  RequestBodyPre,
  RequestResponse,
  RequestStatus,
  type RequestKeyValue,
  type RequestMethodName,
};

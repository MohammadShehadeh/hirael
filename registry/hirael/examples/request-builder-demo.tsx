"use client";

import * as React from "react";

import {
  RequestBar,
  RequestBody,
  RequestBodyPre,
  RequestBuilder,
  RequestKeyValues,
  RequestMethod,
  RequestResponse,
  RequestSection,
  RequestSend,
  RequestStatus,
  RequestUrl,
  type RequestKeyValue,
} from "@/registry/hirael/ui/request-builder";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/registry/hirael/ui/tabs";

type MockResponse = {
  status: number;
  time: string;
  size: string;
  body: string;
};

export default function RequestBuilderDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <BasicRequest />
      <BodyRequest />
    </div>
  );
}

function BasicRequest() {
  const [params, setParams] = React.useState<RequestKeyValue[]>([
    { id: "param-page", name: "page", value: "1", enabled: true },
    { id: "param-limit", name: "limit", value: "20", enabled: true },
  ]);
  const [headers, setHeaders] = React.useState<RequestKeyValue[]>([
    { id: "header-accept", name: "Accept", value: "application/json", enabled: true },
  ]);
  const [pending, setPending] = React.useState(false);
  const [response, setResponse] = React.useState<MockResponse | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const send = React.useCallback(() => {
    setPending(true);
    timer.current = setTimeout(() => {
      setResponse({
        status: 200,
        time: "142 ms",
        size: "1.1 KB",
        body: `{
  "page": 1,
  "limit": 20,
  "total": 2,
  "users": [
    { "id": "u_01", "name": "Lena Ortiz" },
    { "id": "u_02", "name": "Sam Bell" }
  ]
}`,
      });
      setPending(false);
    }, 600);
  }, []);

  return (
    <RequestBuilder defaultMethod="GET" defaultUrl="https://api.example.com/v1/users">
      <RequestBar>
        <RequestMethod />
        <RequestUrl />
        <RequestSend pending={pending} onClick={send} />
      </RequestBar>

      <Tabs defaultValue="params" className="px-3">
        <TabsList className="w-full">
          <TabsTrigger value="params">Params</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
        </TabsList>

        <RequestSection value="params">
          <RequestKeyValues
            rows={params}
            onChange={setParams}
            addLabel="Add param"
            namePlaceholder="Key"
            valuePlaceholder="Value"
          />
        </RequestSection>

        <RequestSection value="headers">
          <RequestKeyValues
            rows={headers}
            onChange={setHeaders}
            addLabel="Add header"
            namePlaceholder="Header"
            valuePlaceholder="Value"
          />
        </RequestSection>

        <RequestSection value="body">
          <RequestBody />
        </RequestSection>
      </Tabs>

      {response ? (
        <RequestResponse time={response.time} size={response.size}>
          <RequestStatus status={response.status} />
        </RequestResponse>
      ) : null}
      {response ? (
        <div className="px-3 pb-3">
          <RequestBodyPre>{response.body}</RequestBodyPre>
        </div>
      ) : null}
    </RequestBuilder>
  );
}

function BodyRequest() {
  const [headers, setHeaders] = React.useState<RequestKeyValue[]>([
    {
      id: "post-content-type",
      name: "Content-Type",
      value: "application/json",
      enabled: true,
    },
  ]);
  const [pending, setPending] = React.useState(false);
  const [response, setResponse] = React.useState<MockResponse | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const send = React.useCallback(() => {
    setPending(true);
    timer.current = setTimeout(() => {
      setResponse({
        status: 201,
        time: "208 ms",
        size: "312 B",
        body: `{
  "id": "u_03",
  "name": "Ada Reyes",
  "email": "ada@example.com",
  "createdAt": "2026-06-18T09:24:00Z"
}`,
      });
      setPending(false);
    }, 600);
  }, []);

  return (
    <RequestBuilder defaultMethod="POST" defaultUrl="https://api.example.com/v1/users">
      <RequestBar>
        <RequestMethod />
        <RequestUrl />
        <RequestSend pending={pending} onClick={send} />
      </RequestBar>

      <Tabs defaultValue="body" className="px-3">
        <TabsList className="w-full">
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
        </TabsList>

        <RequestSection value="headers">
          <RequestKeyValues
            rows={headers}
            onChange={setHeaders}
            addLabel="Add header"
            namePlaceholder="Header"
            valuePlaceholder="Value"
          />
        </RequestSection>

        <RequestSection value="body">
          <RequestBody />
        </RequestSection>
      </Tabs>

      {response ? (
        <RequestResponse time={response.time} size={response.size}>
          <RequestStatus status={response.status} />
        </RequestResponse>
      ) : null}
      {response ? (
        <div className="px-3 pb-3">
          <RequestBodyPre>{response.body}</RequestBodyPre>
        </div>
      ) : null}
    </RequestBuilder>
  );
}

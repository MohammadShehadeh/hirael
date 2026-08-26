"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { YamlEditor } from "@/registry/hirael/components/yaml-editor";

const SAMPLE = `# deploy/api.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  labels:
    app: api
    tier: backend
spec:
  replicas: 3 # scale with load
  strategy:
    type: RollingUpdate
  template:
    spec:
      containers:
        - name: api
          image: "registry.example.com/api:2.4.0"
          ports:
            - containerPort: 8080
          env:
            - name: LOG_LEVEL
              value: info
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
          resources:
            requests:
              cpu: "500m"
              memory: 512Mi
`;

const YamlEditorDemo = () => {
  const t = useT();
  const [value, setValue] = React.useState(SAMPLE);
  const lines = value.split("\n").length;

  return (
    <div className="w-full max-w-2xl">
      <YamlEditor value={value} onValueChange={setValue} rows={14} />
      <p className="mt-2 text-xs text-muted-foreground">
        {t({
          en: `Editable — ${lines} lines. Tab inserts two spaces.`,
          ar: `قابل للتحرير — ${lines} أسطر. زر Tab يُدرج مسافتين.`,
        })}
      </p>
    </div>
  );
};

export default YamlEditorDemo;

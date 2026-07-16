"use client";

import { useT } from "@/lib/demo-locale";
import {
  K8sPodName,
  K8sPodPhase,
  K8sPodRestarts,
  K8sPodTable,
  K8sPodTableBody,
  K8sPodTableCell,
  K8sPodTableHead,
  K8sPodTableHeader,
  K8sPodTableRow,
} from "@/registry/hirael/components/k8s-pod-table";

export default function K8sPodTableDemo() {
  const t = useT();

  const pods = [
    {
      name: "api-7d9f8c-2xk4p",
      ns: "default",
      phase: "Running" as const,
      ready: "2/2",
      restarts: 0,
      age: "6d",
      node: "node-1",
    },
    {
      name: "api-7d9f8c-9m1qz",
      ns: "default",
      phase: "Running" as const,
      ready: "2/2",
      restarts: 1,
      age: "6d",
      node: "node-2",
    },
    {
      name: "worker-5b6a-jj20d",
      ns: "jobs",
      phase: "ContainerCreating" as const,
      ready: "0/1",
      restarts: 0,
      age: "12s",
      node: "node-3",
    },
    {
      name: "cache-0",
      ns: "data",
      phase: "CrashLoopBackOff" as const,
      ready: "0/1",
      restarts: 7,
      age: "3h",
      node: "node-1",
    },
    {
      name: "migrate-28471",
      ns: "jobs",
      phase: "Succeeded" as const,
      ready: "0/1",
      restarts: 0,
      age: "1h",
      node: "node-2",
    },
  ];

  return (
    <div className="w-full max-w-3xl">
      <K8sPodTable
        caption={t({ en: "kubectl get pods -A", ar: "kubectl get pods -A" })}
      >
        <K8sPodTableHeader>
          <K8sPodTableRow>
            <K8sPodTableHead>{t({ en: "Pod", ar: "الحاوية" })}</K8sPodTableHead>
            <K8sPodTableHead>
              {t({ en: "Status", ar: "الحالة" })}
            </K8sPodTableHead>
            <K8sPodTableHead>{t({ en: "Ready", ar: "جاهز" })}</K8sPodTableHead>
            <K8sPodTableHead>
              {t({ en: "Restarts", ar: "إعادة التشغيل" })}
            </K8sPodTableHead>
            <K8sPodTableHead>{t({ en: "Age", ar: "العمر" })}</K8sPodTableHead>
            <K8sPodTableHead>{t({ en: "Node", ar: "العقدة" })}</K8sPodTableHead>
          </K8sPodTableRow>
        </K8sPodTableHeader>
        <K8sPodTableBody>
          {pods.map((pod) => (
            <K8sPodTableRow key={pod.name}>
              <K8sPodName namespace={pod.ns}>{pod.name}</K8sPodName>
              <K8sPodTableCell>
                <K8sPodPhase phase={pod.phase} />
              </K8sPodTableCell>
              <K8sPodTableCell>{pod.ready}</K8sPodTableCell>
              <K8sPodRestarts count={pod.restarts} />
              <K8sPodTableCell>{pod.age}</K8sPodTableCell>
              <K8sPodTableCell>{pod.node}</K8sPodTableCell>
            </K8sPodTableRow>
          ))}
        </K8sPodTableBody>
      </K8sPodTable>
    </div>
  );
}

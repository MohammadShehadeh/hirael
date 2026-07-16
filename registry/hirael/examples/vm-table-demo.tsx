"use client";

import { useT } from "@/lib/demo-locale";
import {
  VmStatus,
  VmTable,
  VmTableBody,
  VmTableCell,
  VmTableHead,
  VmTableHeader,
  VmTableName,
  VmTableRow,
} from "@/registry/hirael/components/vm-table";

export default function VmTableDemo() {
  const t = useT();

  const rows = [
    {
      name: "web-prod-01",
      id: "i-0a1b2c3d",
      state: "running" as const,
      size: "c6i.2xlarge",
      region: "us-east-1",
      ip: "10.0.1.24",
      uptime: "42d",
    },
    {
      name: "worker-prod-02",
      id: "i-0e4f5a6b",
      state: "running" as const,
      size: "c6i.xlarge",
      region: "us-east-1",
      ip: "10.0.1.51",
      uptime: "42d",
    },
    {
      name: "batch-runner-07",
      id: "i-0c7d8e9f",
      state: "starting" as const,
      size: "m6i.large",
      region: "eu-west-2",
      ip: "10.1.2.13",
      uptime: "—",
    },
    {
      name: "db-replica-03",
      id: "i-0b3c4d5e",
      state: "error" as const,
      size: "r6i.4xlarge",
      region: "eu-west-2",
      ip: "10.1.2.44",
      uptime: "—",
    },
    {
      name: "sandbox-14",
      id: "i-0f6a7b8c",
      state: "stopped" as const,
      size: "t3.medium",
      region: "ap-south-1",
      ip: "—",
      uptime: "—",
    },
  ];

  return (
    <div className="w-full max-w-3xl">
      <VmTable
        caption={t({
          en: "5 instances across 3 regions",
          ar: "5 مثيلات في 3 مناطق",
        })}
      >
        <VmTableHeader>
          <VmTableRow>
            <VmTableHead>{t({ en: "Instance", ar: "المثيل" })}</VmTableHead>
            <VmTableHead>{t({ en: "Status", ar: "الحالة" })}</VmTableHead>
            <VmTableHead>{t({ en: "Size", ar: "الحجم" })}</VmTableHead>
            <VmTableHead>{t({ en: "Region", ar: "المنطقة" })}</VmTableHead>
            <VmTableHead>{t({ en: "IP", ar: "العنوان" })}</VmTableHead>
            <VmTableHead className="text-end">
              {t({ en: "Uptime", ar: "التشغيل" })}
            </VmTableHead>
          </VmTableRow>
        </VmTableHeader>
        <VmTableBody>
          {rows.map((row) => (
            <VmTableRow key={row.id}>
              <VmTableName id={row.id}>{row.name}</VmTableName>
              <VmTableCell>
                <VmStatus state={row.state} />
              </VmTableCell>
              <VmTableCell className="font-mono text-xs text-muted-foreground">
                {row.size}
              </VmTableCell>
              <VmTableCell className="text-muted-foreground">
                {row.region}
              </VmTableCell>
              <VmTableCell className="font-mono text-xs text-muted-foreground">
                {row.ip}
              </VmTableCell>
              <VmTableCell className="text-end font-mono text-xs text-muted-foreground">
                {row.uptime}
              </VmTableCell>
            </VmTableRow>
          ))}
        </VmTableBody>
      </VmTable>
    </div>
  );
}

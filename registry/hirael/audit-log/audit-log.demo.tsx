"use client";

import {
  AuditLog,
  AuditLogAction,
  AuditLogActor,
  AuditLogDetail,
  AuditLogField,
  AuditLogItem,
  AuditLogStatus,
  AuditLogTime,
  AuditLogTrigger,
} from "@/registry/hirael/ui/audit-log";

export default function AuditLogDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        Recent events
      </p>
      <AuditLog>
        <AuditLogItem defaultOpen>
          <AuditLogTrigger>
            <AuditLogActor>lena.park</AuditLogActor>
            <AuditLogAction>updated billing settings</AuditLogAction>
            <AuditLogStatus tone="success" className="ms-auto">
              200
            </AuditLogStatus>
            <AuditLogTime className="ms-0">14:20 UTC</AuditLogTime>
          </AuditLogTrigger>
          <AuditLogDetail>
            <AuditLogField label="Actor">lena.park@acme.co</AuditLogField>
            <AuditLogField label="IP">192.0.2.51</AuditLogField>
            <AuditLogField label="Location">Lisbon, PT</AuditLogField>
            <AuditLogField label="Changed">
              plan: pro → scale, seats: 10 → 25
            </AuditLogField>
          </AuditLogDetail>
        </AuditLogItem>

        <AuditLogItem>
          <AuditLogTrigger>
            <AuditLogActor>api/token</AuditLogActor>
            <AuditLogAction>created a new API key</AuditLogAction>
            <AuditLogStatus tone="success" className="ms-auto">
              201
            </AuditLogStatus>
            <AuditLogTime className="ms-0">13:02 UTC</AuditLogTime>
          </AuditLogTrigger>
          <AuditLogDetail>
            <AuditLogField label="Key">sk_live_••••8f21</AuditLogField>
            <AuditLogField label="Scopes">read, write</AuditLogField>
            <AuditLogField label="IP">203.0.113.9</AuditLogField>
          </AuditLogDetail>
        </AuditLogItem>

        <AuditLogItem>
          <AuditLogTrigger>
            <AuditLogActor>theo.adams</AuditLogActor>
            <AuditLogAction>failed sign-in attempt</AuditLogAction>
            <AuditLogStatus tone="danger" className="ms-auto">
              401
            </AuditLogStatus>
            <AuditLogTime className="ms-0">11:47 UTC</AuditLogTime>
          </AuditLogTrigger>
          <AuditLogDetail>
            <AuditLogField label="Reason">invalid password</AuditLogField>
            <AuditLogField label="IP">198.51.100.7</AuditLogField>
            <AuditLogField label="Attempts">3 in 5 min</AuditLogField>
          </AuditLogDetail>
        </AuditLogItem>
      </AuditLog>
    </div>
  );
}

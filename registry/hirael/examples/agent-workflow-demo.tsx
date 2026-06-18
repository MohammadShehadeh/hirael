"use client";

import { Database, Globe } from "lucide-react";

import {
  AgentWorkflow,
  AgentWorkflowContent,
  AgentWorkflowDetail,
  AgentWorkflowMarker,
  AgentWorkflowMeta,
  AgentWorkflowStep,
  AgentWorkflowTitle,
} from "@/registry/hirael/ui/agent-workflow";

export default function AgentWorkflowDemo() {
  return (
    <div className="grid w-full max-w-xl gap-8">
      <AgentWorkflow>
        <AgentWorkflowStep status="done" kind="thought">
          <AgentWorkflowMarker status="done" kind="thought" />
          <AgentWorkflowContent>
            <AgentWorkflowTitle>Plan the lookup</AgentWorkflowTitle>
            <AgentWorkflowMeta>
              <span>Thought</span>
              <span>0.4s</span>
            </AgentWorkflowMeta>
            <AgentWorkflowDetail>
              The user wants last quarter&apos;s revenue. Query the orders table,
              then sum by month.
            </AgentWorkflowDetail>
          </AgentWorkflowContent>
        </AgentWorkflowStep>

        <AgentWorkflowStep status="done" kind="tool">
          <AgentWorkflowMarker status="done" kind="tool" />
          <AgentWorkflowContent>
            <AgentWorkflowTitle>Call search_orders</AgentWorkflowTitle>
            <AgentWorkflowMeta>
              <span>Tool</span>
              <span>1.1s</span>
            </AgentWorkflowMeta>
            <AgentWorkflowDetail className="font-mono text-xs">
              search_orders(range: &quot;2024-Q4&quot;, group_by: &quot;month&quot;)
            </AgentWorkflowDetail>
          </AgentWorkflowContent>
        </AgentWorkflowStep>

        <AgentWorkflowStep status="done" kind="output">
          <AgentWorkflowMarker status="done" kind="output" />
          <AgentWorkflowContent>
            <AgentWorkflowTitle>Read 3 rows</AgentWorkflowTitle>
            <AgentWorkflowMeta>
              <span>Result</span>
              <span>312 tokens</span>
            </AgentWorkflowMeta>
            <AgentWorkflowDetail className="font-mono text-xs">
              Oct 84.2k, Nov 91.0k, Dec 103.7k
            </AgentWorkflowDetail>
          </AgentWorkflowContent>
        </AgentWorkflowStep>

        <AgentWorkflowStep status="running" kind="output">
          <AgentWorkflowMarker status="running" kind="output" />
          <AgentWorkflowContent>
            <AgentWorkflowTitle>Write the summary</AgentWorkflowTitle>
            <AgentWorkflowMeta>
              <span>Output</span>
              <span>claude-opus</span>
            </AgentWorkflowMeta>
          </AgentWorkflowContent>
        </AgentWorkflowStep>

        <AgentWorkflowStep status="pending" kind="tool">
          <AgentWorkflowMarker status="pending" kind="tool" />
          <AgentWorkflowContent>
            <AgentWorkflowTitle>Send to Slack</AgentWorkflowTitle>
            <AgentWorkflowMeta>
              <span>Queued</span>
            </AgentWorkflowMeta>
          </AgentWorkflowContent>
        </AgentWorkflowStep>
      </AgentWorkflow>

      <AgentWorkflow>
        <AgentWorkflowStep status="done" kind="tool">
          <AgentWorkflowMarker status="done">
            <Globe />
          </AgentWorkflowMarker>
          <AgentWorkflowContent>
            <AgentWorkflowTitle>Fetch the changelog</AgentWorkflowTitle>
            <AgentWorkflowMeta>
              <span>HTTP</span>
              <span>200</span>
              <span>0.8s</span>
            </AgentWorkflowMeta>
          </AgentWorkflowContent>
        </AgentWorkflowStep>

        <AgentWorkflowStep status="error" kind="tool">
          <AgentWorkflowMarker status="error">
            <Database />
          </AgentWorkflowMarker>
          <AgentWorkflowContent>
            <AgentWorkflowTitle>Write to cache</AgentWorkflowTitle>
            <AgentWorkflowMeta>
              <span>Redis</span>
              <span>Timeout</span>
            </AgentWorkflowMeta>
            <AgentWorkflowDetail className="border-destructive/30 text-destructive">
              Connection refused after 5s. Retrying with backoff.
            </AgentWorkflowDetail>
          </AgentWorkflowContent>
        </AgentWorkflowStep>

        <AgentWorkflowStep status="running" kind="tool">
          <AgentWorkflowMarker status="running" kind="tool" />
          <AgentWorkflowContent>
            <AgentWorkflowTitle>Retry the write</AgentWorkflowTitle>
            <AgentWorkflowMeta>
              <span>Attempt 2 of 3</span>
            </AgentWorkflowMeta>
          </AgentWorkflowContent>
        </AgentWorkflowStep>
      </AgentWorkflow>
    </div>
  );
}

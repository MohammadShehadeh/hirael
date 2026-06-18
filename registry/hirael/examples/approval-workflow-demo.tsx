"use client";

import * as React from "react";
import { Check, X } from "lucide-react";

import {
  ApprovalStep,
  ApprovalStepActions,
  ApprovalStepComment,
  ApprovalStepContent,
  ApprovalStepMarker,
  ApprovalStepMeta,
  ApprovalStepTitle,
  ApprovalWorkflow,
} from "@/registry/hirael/ui/approval-workflow";
import { Button } from "@/registry/hirael/ui/button";

type Decision = "current" | "approved" | "rejected";

export default function ApprovalWorkflowDemo() {
  const [decision, setDecision] = React.useState<Decision>("current");

  return (
    <div className="grid w-full max-w-xl gap-8">
      <ApprovalWorkflow>
        <ApprovalStep status="approved">
          <ApprovalStepMarker status="approved" />
          <ApprovalStepContent>
            <ApprovalStepTitle>Submitted by Dana Okafor</ApprovalStepTitle>
            <ApprovalStepMeta>
              <span>Reporter</span>
              <span>Jun 12, 9:14 AM</span>
            </ApprovalStepMeta>
            <ApprovalStepComment>
              Q2 conference travel. Receipts attached.
            </ApprovalStepComment>
          </ApprovalStepContent>
        </ApprovalStep>

        <ApprovalStep status="approved">
          <ApprovalStepMarker status="approved" />
          <ApprovalStepContent>
            <ApprovalStepTitle>Maya Lindqvist</ApprovalStepTitle>
            <ApprovalStepMeta>
              <span>Team lead</span>
              <span>Jun 12, 2:30 PM</span>
            </ApprovalStepMeta>
            <ApprovalStepComment>
              Looks reasonable, within the team budget.
            </ApprovalStepComment>
          </ApprovalStepContent>
        </ApprovalStep>

        <ApprovalStep status={decision}>
          <ApprovalStepMarker status={decision} />
          <ApprovalStepContent>
            <ApprovalStepTitle>You</ApprovalStepTitle>
            <ApprovalStepMeta>
              <span>Finance</span>
              <span>
                {decision === "current" ? "Awaiting your review" : "Just now"}
              </span>
            </ApprovalStepMeta>
            {decision === "current" ? (
              <ApprovalStepActions>
                <Button size="sm" onClick={() => setDecision("approved")}>
                  <Check />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDecision("rejected")}
                >
                  <X />
                  Reject
                </Button>
              </ApprovalStepActions>
            ) : (
              <ApprovalStepComment>
                {decision === "approved"
                  ? "Approved. Reimbursement is on the way."
                  : "Rejected. Please split this across two cost centers."}
              </ApprovalStepComment>
            )}
          </ApprovalStepContent>
        </ApprovalStep>

        <ApprovalStep status="pending">
          <ApprovalStepMarker status="pending" />
          <ApprovalStepContent>
            <ApprovalStepTitle>Payroll</ApprovalStepTitle>
            <ApprovalStepMeta>
              <span>Final payout</span>
              <span>Pending</span>
            </ApprovalStepMeta>
          </ApprovalStepContent>
        </ApprovalStep>
      </ApprovalWorkflow>

      <ApprovalWorkflow>
        <ApprovalStep status="approved">
          <ApprovalStepMarker status="approved" />
          <ApprovalStepContent>
            <ApprovalStepTitle>Priya Raman</ApprovalStepTitle>
            <ApprovalStepMeta>
              <span>Author</span>
              <span>Mar 4, 10:02 AM</span>
            </ApprovalStepMeta>
            <ApprovalStepComment>
              Opened the pull request for the new auth flow.
            </ApprovalStepComment>
          </ApprovalStepContent>
        </ApprovalStep>

        <ApprovalStep status="rejected">
          <ApprovalStepMarker status="rejected" />
          <ApprovalStepContent>
            <ApprovalStepTitle>Theo Marchetti</ApprovalStepTitle>
            <ApprovalStepMeta>
              <span>Reviewer</span>
              <span>Mar 4, 4:48 PM</span>
            </ApprovalStepMeta>
            <ApprovalStepComment>
              Changes requested. The token refresh has a race condition under
              concurrent requests.
            </ApprovalStepComment>
          </ApprovalStepContent>
        </ApprovalStep>

        <ApprovalStep status="pending">
          <ApprovalStepMarker status="pending" />
          <ApprovalStepContent>
            <ApprovalStepTitle>Security</ApprovalStepTitle>
            <ApprovalStepMeta>
              <span>Sign-off</span>
              <span>Blocked</span>
            </ApprovalStepMeta>
          </ApprovalStepContent>
        </ApprovalStep>
      </ApprovalWorkflow>
    </div>
  );
}

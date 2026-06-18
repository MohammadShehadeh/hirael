"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";

import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import {
  ReviewQueue,
  ReviewQueueActions,
  ReviewQueueEmpty,
  ReviewQueueItem,
  ReviewQueueProgress,
  ReviewQueueRemaining,
} from "@/registry/hirael/ui/review-queue";

type FlaggedComment = {
  id: string;
  author: string;
  handle: string;
  body: string;
  reason: string;
};

const FLAGGED: FlaggedComment[] = [
  {
    id: "c1",
    author: "Mara Quinn",
    handle: "@maraq",
    body: "This guide saved me hours. Dropping my referral link below for anyone who wants the same setup.",
    reason: "Possible spam",
  },
  {
    id: "c2",
    author: "Dev Okafor",
    handle: "@devo",
    body: "Pretty sure half of this is wrong, but whatever, do your own research I guess.",
    reason: "Low quality",
  },
  {
    id: "c3",
    author: "Priya Raman",
    handle: "@priya.r",
    body: "Following up here since support never replied. Has anyone actually gotten a refund?",
    reason: "Reported by user",
  },
  {
    id: "c4",
    author: "Anon",
    handle: "@throwaway91",
    body: "Contact me on telegram for cheap keys, link in bio, fast delivery guaranteed.",
    reason: "Possible spam",
  },
  {
    id: "c5",
    author: "Lena Hart",
    handle: "@lenah",
    body: "Small typo in step 4, the flag should be --prod not --production. Otherwise great.",
    reason: "Needs a look",
  },
];

type AccessRequest = {
  id: string;
  requester: string;
  resource: string;
  role: string;
};

const REQUESTS: AccessRequest[] = [
  {
    id: "r1",
    requester: "tomas.vance",
    resource: "Billing dashboard",
    role: "Editor",
  },
  {
    id: "r2",
    requester: "sasha.lin",
    resource: "Production database",
    role: "Read only",
  },
  {
    id: "r3",
    requester: "noah.kerr",
    resource: "Deploy keys",
    role: "Admin",
  },
];

export default function ReviewQueueDemo() {
  const [commentRound, setCommentRound] = React.useState(0);
  const [requestRound, setRequestRound] = React.useState(0);

  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Flagged comments · A approve, R reject, S skip
        </p>
        <ReviewQueue
          key={`comments-${commentRound}`}
          items={FLAGGED}
          onDecision={(id, decision) => {
            console.log(decision, id);
          }}
        >
          <ReviewQueueProgress />
          <ReviewQueueItem>
            {(comment: FlaggedComment) => (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {comment.author}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {comment.handle}
                    </span>
                  </div>
                  <Badge variant="outline">{comment.reason}</Badge>
                </div>
                <p className="text-sm text-foreground">{comment.body}</p>
              </>
            )}
          </ReviewQueueItem>
          <ReviewQueueActions />
          <ReviewQueueEmpty>
            <p className="text-sm font-medium text-foreground">All clear</p>
            <p className="text-sm text-muted-foreground">
              No more comments in the queue.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommentRound((n) => n + 1)}
            >
              <RotateCcw aria-hidden className="rtl:rotate-180" />
              Start over
            </Button>
          </ReviewQueueEmpty>
        </ReviewQueue>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Access requests · grant, deny, or come back later
        </p>
        <ReviewQueue
          key={`requests-${requestRound}`}
          items={REQUESTS}
          onDecision={(id, decision) => {
            console.log(decision, id);
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <ReviewQueueProgress className="flex-1">
              {(position, total) => (
                <>
                  Request {position} / {total}
                </>
              )}
            </ReviewQueueProgress>
            <ReviewQueueRemaining />
          </div>
          <ReviewQueueItem className="gap-2">
            {(request: AccessRequest) => (
              <>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-sm text-foreground">
                    {request.requester}
                  </span>
                  <Badge variant="secondary">{request.role}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Wants access to{" "}
                  <span className="text-foreground">{request.resource}</span>
                </p>
              </>
            )}
          </ReviewQueueItem>
          <ReviewQueueActions
            approveLabel="Grant"
            rejectLabel="Deny"
            skipLabel="Later"
          />
          <ReviewQueueEmpty>
            <p className="text-sm font-medium text-foreground">
              Nothing pending
            </p>
            <p className="text-sm text-muted-foreground">
              Every request has an answer.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRequestRound((n) => n + 1)}
            >
              <RotateCcw aria-hidden className="rtl:rotate-180" />
              Replay
            </Button>
          </ReviewQueueEmpty>
        </ReviewQueue>
      </div>
    </div>
  );
}

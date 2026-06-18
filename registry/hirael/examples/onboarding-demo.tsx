"use client";

import * as React from "react";

import {
  Onboarding,
  OnboardingActions,
  OnboardingComplete,
  OnboardingProgress,
  OnboardingStep,
  OnboardingStepBody,
  OnboardingStepDescription,
  OnboardingStepTitle,
} from "@/registry/hirael/ui/onboarding";

export default function OnboardingDemo() {
  return (
    <div className="grid w-full max-w-md gap-8">
      <Onboarding>
        <OnboardingProgress />

        <OnboardingStep value={0}>
          <OnboardingStepTitle>Welcome to Hirael</OnboardingStepTitle>
          <OnboardingStepDescription>
            A few quick steps and your workspace is ready.
          </OnboardingStepDescription>
        </OnboardingStep>

        <OnboardingStep value={1}>
          <OnboardingStepTitle>Set up your profile</OnboardingStepTitle>
          <OnboardingStepDescription>
            Add a name and a photo so teammates know who you are.
          </OnboardingStepDescription>
          <OnboardingStepBody>
            <input
              type="text"
              placeholder="Full name"
              className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </OnboardingStepBody>
        </OnboardingStep>

        <OnboardingStep value={2}>
          <OnboardingStepTitle>Invite your team</OnboardingStepTitle>
          <OnboardingStepDescription>
            Work is better together. Add a few people now or later.
          </OnboardingStepDescription>
          <OnboardingStepBody>
            <input
              type="email"
              placeholder="name@company.com"
              className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </OnboardingStepBody>
        </OnboardingStep>

        <OnboardingStep value={3}>
          <OnboardingStepTitle>You are all set</OnboardingStepTitle>
          <OnboardingStepDescription>
            Press Finish to open your new workspace.
          </OnboardingStepDescription>
        </OnboardingStep>

        <OnboardingComplete>
          <OnboardingStepTitle>Workspace ready</OnboardingStepTitle>
          <OnboardingStepDescription>
            Everything is set up. Welcome aboard.
          </OnboardingStepDescription>
        </OnboardingComplete>

        <OnboardingActions />
      </Onboarding>

      <Onboarding>
        <OnboardingProgress variant="bar" />

        <OnboardingStep value={0}>
          <OnboardingStepTitle>Pick a plan</OnboardingStepTitle>
          <OnboardingStepDescription>
            Start free. Upgrade whenever you need more.
          </OnboardingStepDescription>
        </OnboardingStep>

        <OnboardingStep value={1}>
          <OnboardingStepTitle>Confirm details</OnboardingStepTitle>
          <OnboardingStepDescription>
            Review your choice, then finish to continue.
          </OnboardingStepDescription>
        </OnboardingStep>

        <OnboardingComplete>
          <OnboardingStepTitle>All done</OnboardingStepTitle>
          <OnboardingStepDescription>
            Your plan is active.
          </OnboardingStepDescription>
        </OnboardingComplete>

        <OnboardingActions showSkip={false} finishLabel="Done" />
      </Onboarding>
    </div>
  );
}

"use client";

import {
  SubscriptionPlan,
  SubscriptionPlanAction,
  SubscriptionPlanBadge,
  SubscriptionPlanDescription,
  SubscriptionPlanFeature,
  SubscriptionPlanFeatures,
  SubscriptionPlanName,
  SubscriptionPlanPrice,
  SubscriptionPlans,
} from "@/registry/hirael/ui/subscription-plans";

export default function SubscriptionPlansDemo() {
  return (
    <SubscriptionPlans className="w-full max-w-3xl">
      <SubscriptionPlan>
        <SubscriptionPlanName>Starter</SubscriptionPlanName>
        <SubscriptionPlanPrice cycle="mo">$0</SubscriptionPlanPrice>
        <SubscriptionPlanDescription>
          For side projects and trials.
        </SubscriptionPlanDescription>
        <SubscriptionPlanFeatures>
          <SubscriptionPlanFeature>1 project</SubscriptionPlanFeature>
          <SubscriptionPlanFeature>Community support</SubscriptionPlanFeature>
          <SubscriptionPlanFeature>1k requests / day</SubscriptionPlanFeature>
        </SubscriptionPlanFeatures>
        <SubscriptionPlanAction>Choose Starter</SubscriptionPlanAction>
      </SubscriptionPlan>

      <SubscriptionPlan featured>
        <SubscriptionPlanBadge>Popular</SubscriptionPlanBadge>
        <SubscriptionPlanName>Pro</SubscriptionPlanName>
        <SubscriptionPlanPrice cycle="mo">$29</SubscriptionPlanPrice>
        <SubscriptionPlanDescription>
          For growing teams shipping fast.
        </SubscriptionPlanDescription>
        <SubscriptionPlanFeatures>
          <SubscriptionPlanFeature>Unlimited projects</SubscriptionPlanFeature>
          <SubscriptionPlanFeature>Priority support</SubscriptionPlanFeature>
          <SubscriptionPlanFeature>100k requests / day</SubscriptionPlanFeature>
          <SubscriptionPlanFeature>Audit log</SubscriptionPlanFeature>
        </SubscriptionPlanFeatures>
        <SubscriptionPlanAction variant="primary">
          Upgrade to Pro
        </SubscriptionPlanAction>
      </SubscriptionPlan>

      <SubscriptionPlan current>
        <SubscriptionPlanBadge>Current</SubscriptionPlanBadge>
        <SubscriptionPlanName>Scale</SubscriptionPlanName>
        <SubscriptionPlanPrice cycle="mo">$99</SubscriptionPlanPrice>
        <SubscriptionPlanDescription>
          For high-volume production.
        </SubscriptionPlanDescription>
        <SubscriptionPlanFeatures>
          <SubscriptionPlanFeature>Everything in Pro</SubscriptionPlanFeature>
          <SubscriptionPlanFeature>SSO &amp; SAML</SubscriptionPlanFeature>
          <SubscriptionPlanFeature>Unlimited requests</SubscriptionPlanFeature>
        </SubscriptionPlanFeatures>
        <SubscriptionPlanAction disabled>Current plan</SubscriptionPlanAction>
      </SubscriptionPlan>
    </SubscriptionPlans>
  );
}

"use client";

import { VendorComparison } from "@/registry/hirael/ui/vendor-comparison";

const vendors = [
  { id: "starter", name: "Starter" },
  { id: "team", name: "Team", recommended: true },
  { id: "scale", name: "Scale" },
];

const features = [
  {
    id: "seats",
    label: "Seats",
    group: "Plan",
    values: { starter: "3", team: "25", scale: "Unlimited" },
  },
  {
    id: "history",
    label: "History",
    group: "Plan",
    values: { starter: "30 days", team: "1 year", scale: "Forever" },
  },
  {
    id: "sso",
    label: "Single sign-on",
    group: "Security",
    values: { starter: false, team: true, scale: true },
  },
  {
    id: "audit",
    label: "Audit log",
    group: "Security",
    values: { starter: false, team: true, scale: true },
  },
  {
    id: "roles",
    label: "Custom roles",
    group: "Security",
    values: { starter: false, team: false, scale: true },
  },
  {
    id: "support",
    label: "Priority support",
    group: "Support",
    values: { starter: false, team: true, scale: true },
  },
];

const smallVendors = [
  { id: "free", name: "Free" },
  { id: "pro", name: "Pro", recommended: true },
];

const smallFeatures = [
  {
    id: "projects",
    label: "Projects",
    values: { free: "1", pro: "10" },
  },
  {
    id: "analytics",
    label: "Analytics",
    values: { free: false, pro: true },
  },
  {
    id: "export",
    label: "Data export",
    values: { free: false, pro: true },
  },
];

export default function VendorComparisonDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <VendorComparison vendors={vendors} features={features} />

      <VendorComparison vendors={smallVendors} features={smallFeatures} />
    </div>
  );
}

"use client";

import { BreadcrumbGenerator } from "@/registry/hirael/ui/breadcrumb-generator";

export default function BreadcrumbGeneratorDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <BreadcrumbGenerator
        showHome
        items={[
          { label: "Settings", href: "/settings" },
          { label: "Billing", href: "/settings/billing" },
          { label: "Invoices" },
        ]}
      />

      <BreadcrumbGenerator
        path="/docs/components/navigation/breadcrumb/examples/collapsed"
        basePath="/app"
        maxItems={3}
      />
    </div>
  );
}

"use client";

import { JsonViewer } from "@/registry/hirael/ui/json-viewer";

const response = {
  id: "usr_8f2a",
  name: "Ada Lovelace",
  active: true,
  plan: "pro",
  seats: 12,
  trialEndsAt: null,
  roles: ["owner", "admin"],
  projects: [
    { id: "prj_01", name: "Analytics", archived: false },
    { id: "prj_02", name: "Billing", archived: true },
  ],
  settings: {
    theme: "dark",
    notifications: { email: true, push: false },
  },
};

export default function JsonViewerDemo() {
  return (
    <div className="grid w-full max-w-xl gap-8">
      <JsonViewer data={response} />

      <JsonViewer data={response} rootName="user" defaultExpandedDepth={3} />
    </div>
  );
}

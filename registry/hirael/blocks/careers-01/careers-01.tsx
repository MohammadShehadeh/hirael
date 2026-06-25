"use client";

import * as React from "react";
import { MapPin, Clock, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Role = {
  title: string;
  department: string;
  location: string;
  type: string;
  href: string;
};

const ROLES: readonly Role[] = [
  {
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    href: "#",
  },
  {
    title: "Design Systems Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    href: "#",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    href: "#",
  },
  {
    title: "Developer Advocate",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    href: "#",
  },
  {
    title: "Technical Writer",
    department: "Marketing",
    location: "Remote",
    type: "Contract",
    href: "#",
  },
  {
    title: "Founding Account Executive",
    department: "Sales",
    location: "Remote",
    type: "Full-time",
    href: "#",
  },
];

const DEPARTMENTS = ["All", "Engineering", "Design", "Marketing", "Sales"];

export default function Careers01() {
  const [department, setDepartment] = React.useState("All");

  const roles =
    department === "All"
      ? ROLES
      : ROLES.filter((role) => role.department === department);

  return (
    <section data-slot="careers" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-4xl px-6 md:px-10">
        <div className="flex flex-col gap-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            careers
          </span>
          <h2 className="font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl">
            Open roles.
          </h2>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            We are a small, remote-first team building the components shadcn/ui
            leaves out. {ROLES.length} roles open right now.
          </p>
        </div>

        <div data-slot="careers-filter" className="mt-10 flex flex-wrap gap-2">
          {DEPARTMENTS.map((dept) => {
            const active = dept === department;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setDepartment(dept)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-150 ease-out",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {dept}
              </button>
            );
          })}
        </div>

        <ul data-slot="careers-list" className="mt-8 border-t border-border">
          {roles.map((role) => (
            <li key={role.title}>
              <a
                href={role.href}
                data-slot="careers-role"
                className="group flex items-center justify-between gap-4 border-b border-border py-5 transition-colors duration-150 ease-out hover:bg-accent/40"
              >
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-medium tracking-[-0.01em] sm:text-lg">
                    {role.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                    <span className="font-mono uppercase tracking-[0.08em]">
                      {role.department}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {role.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {role.type}
                    </span>
                  </div>
                </div>
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-foreground/40 group-hover:text-foreground">
                  <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

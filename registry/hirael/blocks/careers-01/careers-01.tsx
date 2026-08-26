"use client";

import * as React from "react";
import { MapPin, Clock, ArrowRight } from "lucide-react";

import { Badge } from "@/registry/hirael/ui/badge";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/hirael/ui/toggle-group";

interface Role {
  title: string;
  department: string;
  location: string;
  type: string;
  href: string;
}

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

const Careers01 = () => {
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

        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          spacing={2}
          value={department}
          onValueChange={(next) => {
            if (next) setDepartment(next);
          }}
          aria-label="Filter roles by department"
          data-slot="careers-filter"
          className="mt-10 flex-wrap"
        >
          {DEPARTMENTS.map((dept) => (
            <ToggleGroupItem key={dept} value={dept} className="rounded-full">
              {dept}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <ul data-slot="careers-list" className="mt-8 border-t border-border">
          {roles.map((role) => (
            <li key={role.title} className="border-b border-border">
              <a
                href={role.href}
                data-slot="careers-role"
                className="group -mx-4 flex items-center justify-between gap-4 rounded-lg px-4 py-5 transition-colors duration-150 ease-out hover:bg-accent/50"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-medium tracking-[-0.01em] sm:text-lg">
                    {role.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                    <Badge
                      variant="outline"
                      className="bg-card font-mono text-[10px] font-normal uppercase tracking-[0.08em] text-muted-foreground"
                    >
                      {role.department}
                    </Badge>
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
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-150 ease-out group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                  <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Careers01;

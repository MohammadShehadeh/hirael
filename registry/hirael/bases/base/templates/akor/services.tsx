import * as React from 'react';

import { CtaButton, SectionLabel } from './primitives';

const SERVICES = [
  {
    icon: '/media/templates/akor/service-1.webp',
    title: 'AI-Driven\nSecurity Solutions',
    description:
      'Camera, access and sensor networks watched by models trained on real incidents, so threats are flagged before they become events.',
  },
  {
    icon: '/media/templates/akor/service-2.webp',
    title: 'Smart Building\nAutomation',
    description:
      'Lighting, climate, access and alarms run from one control plane that adapts to occupancy, schedules and live risk.',
  },
  {
    icon: '/media/templates/akor/service-3.webp',
    title: 'AI Consulting\nand Integration',
    description:
      'We audit what you already run, design the target system and integrate it with the platforms your teams use today.',
  },
  {
    icon: '/media/templates/akor/service-4.webp',
    title: 'Training\nand Support',
    description:
      'Operator training, runbooks and round-the-clock support, so the system keeps working the way it was designed to.',
  },
] as const;

const ROWS = [SERVICES.slice(0, 2), SERVICES.slice(2)];

export const Services = () => {
  return (
    <section id="services" data-slot="services" className="bg-foreground px-8 py-24 text-background lg:px-16 lg:py-32">
      <SectionLabel>Services</SectionLabel>

      <div className="flex flex-col gap-16 lg:flex-row lg:gap-24">
        <div className="flex flex-col justify-center lg:w-[38%]">
          <h2 className="text-3xl font-normal leading-[1.15] tracking-tight text-background sm:text-4xl">
            Security, automation, and AI, helping businesses enhance efficiency
          </h2>
          <div className="mt-10">
            <CtaButton>Get Consultation</CtaButton>
          </div>
        </div>

        <div className="lg:w-[62%]">
          {ROWS.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {rowIndex > 0 ? <div aria-hidden className="my-12 h-px w-full bg-muted-foreground/20" /> : null}
              <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
                {row.map((service, index) => {
                  const number = rowIndex * 2 + index + 1;
                  return (
                    <article key={service.title} className="border-s border-border/20 ps-8">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.icon}
                        alt=""
                        width={64}
                        height={64}
                        className="size-16 object-contain mix-blend-multiply"
                      />
                      <p className="mt-6 text-xs tabular-nums text-muted-foreground/40">
                        {String(number).padStart(2, '0')}
                      </p>
                      <h3 className="mt-2 whitespace-pre-line text-xl font-medium leading-tight text-background">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground/50">{service.description}</p>
                    </article>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

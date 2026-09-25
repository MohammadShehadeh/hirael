'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  FileDropzone,
  FileDropzoneErrors,
  FileDropzoneList,
  FileDropzoneZone,
} from '@/registry/hirael/bases/radix/components/file-dropzone';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import { Input } from '@/registry/hirael/bases/radix/ui/input';
import { Separator } from '@/registry/hirael/bases/radix/ui/separator';
import { Textarea } from '@/registry/hirael/bases/radix/ui/textarea';

const ENTER =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';
const SWAP =
  'animate-in fade-in zoom-in-97 duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

const stagger = (index: number, step = 60, offset = 0): React.CSSProperties => ({
  animationDelay: `${offset + index * step}ms`,
});

const ROLE = {
  title: 'Senior Product Designer',
  meta: [
    { label: 'Team', value: 'Design' },
    { label: 'Location', value: 'Remote, UTC-2 to UTC+4' },
    { label: 'Type', value: 'Full-time' },
    { label: 'Salary', value: '€85k to €105k' },
  ],
  summary: 'Design, remote in Europe and Africa',
  salary: '€85k to €105k',
  posted: 'Posted 2 September 2026',
};

const RESPONSIBILITIES = [
  'Own the design of our scheduling product end to end, from the first sketch to the release notes.',
  'Run short research rounds with customers every sprint and share what you learn in writing.',
  'Keep the component library honest: propose new patterns, retire the ones nobody uses.',
  'Pair with two frontend engineers daily and review their pull requests for the details that matter.',
];

const REQUIREMENTS = [
  'Six or more years designing software that people use every working day.',
  'A portfolio that shows the messy middle, not only the final screens.',
  'Comfort writing: most of our decisions happen in documents, not meetings.',
  'Working knowledge of Figma variables and how design tokens reach code.',
];

const NICE_TO_HAVE = [
  'You have shipped a product in a right-to-left language.',
  'You can prototype in React when a static mockup will not settle an argument.',
];

const STAGES = [
  {
    title: 'Intro call',
    detail: 'A conversation with the hiring manager about the role and your goals.',
    duration: '30 min call',
  },
  {
    title: 'Portfolio review',
    detail: 'Walk three designers through one project you know inside out.',
    duration: '60 min',
  },
  { title: 'Paid exercise', detail: 'A scoped problem from our backlog, paid at €400 flat.', duration: '4 hours' },
  {
    title: 'Meet the team',
    detail: 'Two short chats with engineering and support, then an offer or clear feedback.',
    duration: '2 calls, 30 min',
  },
];

const NOTE_MAX = 500;
const CV_MAX_BYTES = 10 * 1024 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  name: string;
  email: string;
  portfolio: string;
  note: string;
  cv: File[];
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = { name: '', email: '', portfolio: '', note: '', cv: [] };

const isUrl = (value: string) => {
  try {
    const url = new URL(value.includes('://') ? value : `https://${value}`);

    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.');
  } catch {
    return false;
  }
};

const validate = (state: FormState): FormErrors => {
  const errors: FormErrors = {};
  if (!state.name.trim()) errors.name = 'Add your name.';
  if (!state.email.trim()) errors.email = 'Add an email so we can reply.';
  else if (!EMAIL_PATTERN.test(state.email.trim())) errors.email = 'That email is missing something.';
  if (!state.portfolio.trim()) errors.portfolio = 'Add a link to your portfolio.';
  else if (!isUrl(state.portfolio.trim()))
    errors.portfolio = 'That link does not look right. Try mohammadshehadeh.com.';
  if (state.cv.length === 0) errors.cv = 'Attach your CV as a PDF.';
  if (state.note.length > NOTE_MAX) errors.note = `Keep the note under ${NOTE_MAX} characters.`;

  return errors;
};

const scrollToForm = () => {
  const form = document.getElementById('careers-02-apply');
  if (!form) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  form.querySelector<HTMLInputElement>('input:not([type=file])')?.focus({ preventScroll: true });
};

interface RoleSectionProps {
  title: string;
  index: number;
  children: React.ReactNode;
}

const RoleSection = ({ title, index, children }: RoleSectionProps) => {
  return (
    <section
      data-slot="careers-role-section"
      style={stagger(index, 60, 240)}
      className={cn(ENTER, 'flex flex-col gap-4 border-t border-border pt-8')}
    >
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      {children}
    </section>
  );
};

interface RoleListProps {
  items: string[];
}

const RoleList = ({ items }: RoleListProps) => {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base leading-relaxed text-muted-foreground">
          <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-primary" />
          <span className="text-pretty">{item}</span>
        </li>
      ))}
    </ul>
  );
};

type SubmitStatus = 'idle' | 'submitting' | 'sent';

const ApplyForm = () => {
  const [state, setState] = React.useState<FormState>(INITIAL);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [status, setStatus] = React.useState<SubmitStatus>('idle');

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    const next = { ...state, [key]: value };
    setState(next);
    if (submitted) setErrors(validate(next));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const next = validate(state);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const firstInvalid = Object.keys(next)[0];
      event.currentTarget.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus();

      return;
    }
    setStatus('submitting');
    await new Promise((resolve) => setTimeout(resolve, 1100));
    setStatus('sent');
  };

  const reset = () => {
    setState(INITIAL);
    setErrors({});
    setSubmitted(false);
    setStatus('idle');
  };

  const firstName = state.name.trim().split(/\s+/)[0];
  const submitting = status === 'submitting';

  if (status === 'sent') {
    return (
      <div
        role="status"
        aria-live="polite"
        data-slot="careers-apply-success"
        className={cn(SWAP, 'flex flex-col items-start gap-4 py-6')}
      >
        <CheckCircle2 aria-hidden className="size-6 text-success" />
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-semibold">Application sent</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Thanks, {firstName}. We reply within 5 working days.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A copy is on its way to <span className="text-foreground">{state.email.trim()}</span>.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={reset}>
          Start a new application
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} data-slot="careers-apply-form" aria-busy={submitting || undefined}>
      <FieldGroup className="gap-5">
        <Field data-invalid={Boolean(errors.name) || undefined} className="gap-2">
          <FieldLabel htmlFor="careers-02-name">Full name</FieldLabel>
          <Input
            id="careers-02-name"
            data-field="name"
            autoComplete="name"
            placeholder="Mohammad Shehadeh"
            value={state.name}
            disabled={submitting}
            onChange={(event) => set('name', event.target.value)}
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={errors.name ? 'careers-02-name-error' : undefined}
          />
          <FieldError id="careers-02-name-error">{errors.name}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.email) || undefined} className="gap-2">
          <FieldLabel htmlFor="careers-02-email">Email</FieldLabel>
          <Input
            id="careers-02-email"
            data-field="email"
            type="email"
            autoComplete="email"
            placeholder="hello@mohammadshehadeh.com"
            value={state.email}
            disabled={submitting}
            onChange={(event) => set('email', event.target.value)}
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={errors.email ? 'careers-02-email-error' : undefined}
          />
          <FieldError id="careers-02-email-error">{errors.email}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.portfolio) || undefined} className="gap-2">
          <FieldLabel htmlFor="careers-02-portfolio">Portfolio link</FieldLabel>
          <Input
            id="careers-02-portfolio"
            data-field="portfolio"
            type="url"
            inputMode="url"
            autoComplete="url"
            dir="ltr"
            placeholder="https://mohammadshehadeh.com"
            value={state.portfolio}
            disabled={submitting}
            onChange={(event) => set('portfolio', event.target.value)}
            aria-invalid={Boolean(errors.portfolio) || undefined}
            aria-describedby={errors.portfolio ? 'careers-02-portfolio-error' : undefined}
            className="rtl:text-end"
          />
          <FieldError id="careers-02-portfolio-error">{errors.portfolio}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.cv) || undefined} className="gap-2">
          <FieldLabel id="careers-02-cv-label">CV</FieldLabel>
          <FileDropzone
            accept=".pdf,application/pdf"
            maxSize={CV_MAX_BYTES}
            value={state.cv}
            onValueChange={(files) => set('cv', files)}
            disabled={submitting}
          >
            <FileDropzoneZone
              data-field="cv"
              aria-labelledby="careers-02-cv-label"
              aria-describedby={errors.cv ? 'careers-02-cv-error' : undefined}
              headline="Drop your CV here, or browse"
              subline="PDF, up to 10 MB"
            />
            <FileDropzoneList className="mt-2" />
            <FileDropzoneErrors />
          </FileDropzone>
          <FieldError id="careers-02-cv-error">{errors.cv}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.note) || undefined} className="gap-2">
          <FieldLabel htmlFor="careers-02-note">
            Note <span className="font-normal text-muted-foreground">(optional)</span>
          </FieldLabel>
          <Textarea
            id="careers-02-note"
            data-field="note"
            rows={3}
            placeholder="Anything the CV does not say"
            value={state.note}
            disabled={submitting}
            onChange={(event) => set('note', event.target.value)}
            aria-invalid={Boolean(errors.note) || undefined}
            aria-describedby="careers-02-note-count careers-02-note-error"
            className="max-h-40 resize-none"
          />
          <div className="flex items-center justify-between gap-3">
            <FieldDescription>Two or three sentences is plenty.</FieldDescription>
            <span
              id="careers-02-note-count"
              dir="ltr"
              className={cn(
                'shrink-0 text-xs tabular-nums transition-colors duration-150',
                state.note.length > NOTE_MAX ? 'text-destructive' : 'text-muted-foreground',
              )}
            >
              {state.note.length} / {NOTE_MAX}
            </span>
          </div>
          <FieldError id="careers-02-note-error">{errors.note}</FieldError>
        </Field>

        <Button type="submit" size="lg" disabled={submitting} className="group w-full">
          {submitting ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
              Sending application
            </>
          ) : (
            <>
              Send application
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
              />
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
};

const Careers02 = () => {
  return (
    <section data-slot="careers" className="bg-background py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
        <div data-slot="careers-role" className="flex min-w-0 flex-col">
          <a
            href="#"
            className={cn(
              ENTER,
              'group inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground',
            )}
          >
            <ArrowLeft
              aria-hidden
              className="size-4 transition-transform duration-150 ease-out group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5"
            />
            All roles
          </a>

          <div data-slot="careers-role-header" className="mt-8 flex flex-col gap-4">
            <span style={stagger(1)} className={cn(ENTER, 'text-xs text-muted-foreground uppercase')}>
              {ROLE.posted}
            </span>
            <h2
              style={stagger(2)}
              className={cn(ENTER, 'text-3xl font-semibold tracking-tight text-balance sm:text-4xl')}
            >
              {ROLE.title}
            </h2>
          </div>

          <dl
            data-slot="careers-role-meta"
            style={stagger(3)}
            className={cn(ENTER, 'mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4')}
          >
            {ROLE.meta.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className="text-xs text-muted-foreground uppercase">{item.label}</dt>
                <dd className="text-sm font-medium text-pretty tabular-nums">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 flex flex-col gap-10">
            <RoleSection title="About the role" index={0}>
              <p className="text-base leading-relaxed text-pretty text-muted-foreground">
                We make scheduling software for clinics with two to forty practitioners. The product works, customers
                renew, and the interface has grown one feature at a time for six years. You will be the second designer
                on a team of fourteen, with room to decide what the next version looks like and the time to do it
                properly.
              </p>
            </RoleSection>

            <RoleSection title="What you will do" index={1}>
              <RoleList items={RESPONSIBILITIES} />
            </RoleSection>

            <RoleSection title="What we look for" index={2}>
              <RoleList items={REQUIREMENTS} />
            </RoleSection>

            <RoleSection title="Nice to have" index={3}>
              <RoleList items={NICE_TO_HAVE} />
            </RoleSection>

            <RoleSection title="How we hire" index={4}>
              <p className="text-base leading-relaxed text-muted-foreground">
                Four steps, usually finished within three weeks. You hear from us after each one.
              </p>
              <ol data-slot="careers-stages" className="mt-2 flex flex-col">
                {STAGES.map((stage, index) => (
                  <li
                    key={stage.title}
                    className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 border-t border-border py-5 first:border-t-0 first:pt-0 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto]"
                  >
                    <span dir="ltr" className="pt-0.5 text-xs text-primary tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-medium">{stage.title}</h4>
                      <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{stage.detail}</p>
                    </div>
                    <span className="col-start-2 text-xs text-muted-foreground tabular-nums sm:col-start-3 sm:pt-0.5 sm:text-end">
                      {stage.duration}
                    </span>
                  </li>
                ))}
              </ol>
            </RoleSection>
          </div>

          <div
            data-slot="careers-mobile-apply"
            className="sticky bottom-0 z-10 -mx-6 mt-12 border-t border-border bg-background/90 px-6 py-3 backdrop-blur-sm md:-mx-10 md:px-10 lg:hidden"
          >
            <Button type="button" size="lg" className="w-full" onClick={scrollToForm}>
              Apply for this role
            </Button>
          </div>
        </div>

        <aside
          id="careers-02-apply"
          data-slot="careers-apply"
          style={stagger(0, 0, 320)}
          className={cn(
            ENTER,
            'scroll-mt-6 lg:sticky lg:top-6 lg:max-h-[calc(100svh-3rem)] lg:[scrollbar-width:thin] lg:[scrollbar-color:var(--border)_transparent] lg:self-start lg:overflow-y-auto lg:overscroll-contain',
          )}
        >
          <div className="rounded-xl border border-border bg-card/40 p-6">
            <div data-slot="careers-apply-summary" className="hidden flex-col gap-3 lg:flex">
              <span className="text-xs text-muted-foreground uppercase">Apply</span>
              <p className="text-base font-semibold tracking-tight">{ROLE.title}</p>
              <p className="text-sm text-muted-foreground">{ROLE.summary}</p>
              <p className="text-sm tabular-nums">{ROLE.salary}</p>
            </div>
            <div className="flex flex-col gap-1.5 lg:hidden">
              <span className="text-xs text-muted-foreground uppercase">Apply</span>
              <h3 className="text-lg font-semibold tracking-tight">Send your application</h3>
            </div>
            <Separator className="my-6" />
            <ApplyForm />
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Careers02;

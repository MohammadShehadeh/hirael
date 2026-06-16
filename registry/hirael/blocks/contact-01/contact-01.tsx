"use client";

import * as React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";

import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/hirael/ui/card";
import { Checkbox } from "@/registry/hirael/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/hirael/ui/field";
import { Input } from "@/registry/hirael/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/hirael/ui/select";
import { Separator } from "@/registry/hirael/ui/separator";
import { Textarea } from "@/registry/hirael/ui/textarea";

const MESSAGE_MAX = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
  name: "",
  email: "",
  company: "",
  topic: "general",
  message: "",
  consent: false,
};

const TOPICS = [
  { value: "general", label: "General question" },
  { value: "sales", label: "Sales / pricing" },
  { value: "partnerships", label: "Partnership" },
  { value: "support", label: "Technical support" },
] as const;

type Channel = {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
};

const CHANNELS: readonly Channel[] = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@hirael.com",
    href: "mailto:hello@hirael.com",
  },
  {
    icon: MessageCircle,
    label: "Discord",
    value: "hirael · #help",
    href: "#",
  },
];

function validate(state: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!state.name.trim()) errors.name = "Tell us who you are.";
  if (!state.email.trim()) errors.email = "We need a way to reply.";
  else if (!EMAIL_PATTERN.test(state.email))
    errors.email = "That doesn't look like a valid email.";
  if (state.message.trim().length < 20)
    errors.message = "A little more detail helps us route your note.";
  if (state.message.length > MESSAGE_MAX)
    errors.message = `Keep it under ${MESSAGE_MAX} characters.`;
  if (!state.consent) errors.consent = "Please accept the privacy notice.";
  return errors;
}

export default function Contact01() {
  const [state, setState] = React.useState<FormState>(INITIAL);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [touched, setTouched] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent">(
    "idle",
  );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
    if (touched) {
      setErrors(validate({ ...state, [key]: value }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const next = validate(state);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  };

  const reset = () => {
    setState(INITIAL);
    setErrors({});
    setTouched(false);
    setStatus("idle");
  };

  const messageRemaining = MESSAGE_MAX - state.message.length;

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div className="flex max-w-2xl flex-col gap-5">
          <Badge variant="outline" className="w-fit">
            <span className="size-1 rounded-full bg-foreground" />
            Talk to us
          </Badge>
          <h2 className="text-balance font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl">
            Have a question we haven&apos;t answered yet?
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Drop a note and we&apos;ll route it to the right person. Engineering
            questions, sales, partnerships: all the same form.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
              <CardDescription>
                We reply within one business day, usually faster.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status === "sent" ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col items-start gap-4 rounded-md border border-dashed border-border bg-card/40 p-6"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-success/10 text-success">
                    <CheckCircle2 className="size-5" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold tracking-[-0.01em]">
                      Message sent.
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Thanks{state.name ? `, ${state.name.split(" ")[0]}` : ""}.
                      We&apos;ll be in touch at{" "}
                      <span className="font-mono text-foreground">
                        {state.email}
                      </span>
                      .
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={reset}>
                    Send another
                  </Button>
                </div>
              ) : (
                <form noValidate onSubmit={onSubmit} className="contents">
                  <FieldGroup>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field data-invalid={Boolean(errors.name) || undefined}>
                        <FieldLabel htmlFor="contact-name">Name</FieldLabel>
                        <Input
                          id="contact-name"
                          name="name"
                          autoComplete="name"
                          placeholder="Ada Lovelace"
                          value={state.name}
                          onChange={(e) => set("name", e.target.value)}
                          aria-invalid={Boolean(errors.name) || undefined}
                          aria-describedby={
                            errors.name ? "contact-name-error" : undefined
                          }
                        />
                        <FieldError id="contact-name-error">
                          {errors.name}
                        </FieldError>
                      </Field>
                      <Field data-invalid={Boolean(errors.email) || undefined}>
                        <FieldLabel htmlFor="contact-email">
                          Work email
                        </FieldLabel>
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="ada@studio.io"
                          value={state.email}
                          onChange={(e) => set("email", e.target.value)}
                          aria-invalid={Boolean(errors.email) || undefined}
                          aria-describedby={
                            errors.email ? "contact-email-error" : undefined
                          }
                        />
                        <FieldError id="contact-email-error">
                          {errors.email}
                        </FieldError>
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="contact-company">
                          Company{" "}
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                            optional
                          </span>
                        </FieldLabel>
                        <Input
                          id="contact-company"
                          name="company"
                          autoComplete="organization"
                          placeholder="Plinth Labs"
                          value={state.company}
                          onChange={(e) => set("company", e.target.value)}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="contact-topic">Topic</FieldLabel>
                        <Select
                          value={state.topic}
                          onValueChange={(v) => set("topic", v)}
                        >
                          <SelectTrigger id="contact-topic" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TOPICS.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>

                    <Field data-invalid={Boolean(errors.message) || undefined}>
                      <FieldLabel htmlFor="contact-message">Message</FieldLabel>
                      <Textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        maxLength={MESSAGE_MAX + 50}
                        placeholder="Tell us what you&rsquo;re building, and what&rsquo;s in your way…"
                        value={state.message}
                        onChange={(e) => set("message", e.target.value)}
                        aria-invalid={Boolean(errors.message) || undefined}
                        aria-describedby="contact-message-help contact-message-error"
                      />
                      <div className="flex items-center justify-between">
                        <FieldDescription id="contact-message-help">
                          Plain text. Code snippets welcome.
                        </FieldDescription>
                        <span
                          className={`font-mono text-[10px] tabular-nums ${
                            messageRemaining < 0
                              ? "text-destructive"
                              : "text-muted-foreground"
                          }`}
                          aria-live="polite"
                        >
                          {messageRemaining} / {MESSAGE_MAX}
                        </span>
                      </div>
                      <FieldError id="contact-message-error">
                        {errors.message}
                      </FieldError>
                    </Field>

                    <Field
                      orientation="horizontal"
                      data-invalid={Boolean(errors.consent) || undefined}
                    >
                      <Checkbox
                        id="contact-consent"
                        checked={state.consent}
                        onCheckedChange={(v) => set("consent", v === true)}
                        aria-describedby={
                          errors.consent ? "contact-consent-error" : undefined
                        }
                      />
                      <div className="flex flex-1 flex-col gap-1">
                        <FieldLabel htmlFor="contact-consent">
                          I&apos;ve read the{" "}
                          <a
                            href="#"
                            className="underline underline-offset-4 hover:text-primary"
                          >
                            privacy notice
                          </a>
                          .
                        </FieldLabel>
                        <FieldError id="contact-consent-error">
                          {errors.consent}
                        </FieldError>
                      </div>
                    </Field>

                    <Separator />

                    <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                        Routed to the right team automatically.
                      </p>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={status === "sending"}
                        className="group sm:w-fit"
                      >
                        {status === "sending" ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send message
                            <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </FieldGroup>
                </form>
              )}
            </CardContent>
          </Card>

          <aside className="flex flex-col gap-6 lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  other ways to reach us
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <ul className="flex flex-col">
                  {CHANNELS.map((c, i) => {
                    const Icon = c.icon;
                    return (
                      <li key={c.label}>
                        <a
                          href={c.href}
                          className={`group flex items-center justify-between gap-4 px-6 py-3.5 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:bg-accent/60 ${i < CHANNELS.length - 1 ? "border-b border-border" : ""}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="inline-flex size-8 items-center justify-center rounded-sm border border-border bg-background text-foreground">
                              <Icon className="size-3.5" />
                            </span>
                            <span className="flex flex-col">
                              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                                {c.label}
                              </span>
                              <span className="text-sm font-medium text-foreground">
                                {c.value}
                              </span>
                            </span>
                          </span>
                          <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-all duration-150 ease-out group-hover:translate-x-0.5 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-dashed bg-card/30">
              <CardContent>
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-8 items-center justify-center rounded-sm border border-border bg-background text-foreground">
                    <MapPin className="size-3.5" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      Remote, mostly
                    </p>
                    <p className="text-sm text-foreground">
                      Distributed across UTC-5 → UTC+3.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Office hours 09:00–17:00 local time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
}

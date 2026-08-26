"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/hirael/ui/button";
import {
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/registry/hirael/ui/field";
import { Input } from "@/registry/hirael/ui/input";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;
const MASKED_EMAIL = "a•••@studio.com";

const BrandMark = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M16 78 V40 a24 24 0 0 1 48 0 V78" />
      <path d="M40 44 L43.2 52 L51 55 L43.2 58 L40 66 L36.8 58 L29 55 L36.8 52 Z" />
      <path d="M22 86 H58" opacity="0.7" />
      <path d="M28 92 H52" opacity="0.45" />
      <path d="M34 96 H46" opacity="0.25" />
    </svg>
  );
};

const OtpVerify01 = () => {
  const [code, setCode] = React.useState<string[]>(
    Array.from({ length: CODE_LENGTH }, () => ""),
  );
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"idle" | "verifying" | "success">(
    "idle",
  );
  const [secondsLeft, setSecondsLeft] = React.useState(RESEND_SECONDS);
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setTimeout(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft]);

  const applyDigits = (start: number, raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, CODE_LENGTH - start);
    if (!digits) return;
    setCode((prev) => {
      const next = [...prev];
      for (let j = 0; j < digits.length; j++) {
        next[start + j] = digits[j];
      }
      return next;
    });
    setError(null);
    inputsRef.current[
      Math.min(start + digits.length, CODE_LENGTH - 1)
    ]?.focus();
  };

  const clearDigit = (index: number) => {
    setCode((prev) => {
      const next = [...prev];
      next[index] = "";
      return next;
    });
  };

  const onChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      clearDigit(index);
      return;
    }
    applyDigits(index, raw);
  };

  const onKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && e.currentTarget.value === "" && index > 0) {
      e.preventDefault();
      clearDigit(index - 1);
      inputsRef.current[index - 1]?.focus();
      return;
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
      return;
    }
    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const onPaste = (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    applyDigits(index, e.clipboardData.getData("text"));
  };

  const resend = () => {
    setCode(Array.from({ length: CODE_LENGTH }, () => ""));
    setError(null);
    setSecondsLeft(RESEND_SECONDS);
    inputsRef.current[0]?.focus();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.some((d) => d === "")) {
      setError("Enter all six digits to continue.");
      return;
    }
    setError(null);
    setStatus("verifying");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
  };

  return (
    <section className="relative isolate flex min-h-svh items-center justify-center bg-background py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="mx-auto w-full max-w-md px-6">
        <div
          className="rounded-sm border border-border bg-card"
          style={{ boxShadow: "8px 8px 0 0 var(--border)" }}
        >
          {status === "success" ? (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col items-center gap-4 px-8 py-10 text-center"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-sm border border-border bg-background text-foreground">
                <CheckCircle2 className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <h1 className="font-serif text-3xl font-medium tracking-tight">
                  You&apos;re verified
                </h1>
                <p className="text-xs text-muted-foreground">
                  Code accepted. Redirecting you to your workspace…
                </p>
              </div>
              <a
                href="#"
                className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Continue to dashboard
              </a>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4 border-b border-border px-8 pb-6 pt-8">
                <div className="flex size-10 items-center justify-center rounded-sm border border-border bg-background">
                  <BrandMark className="size-6 text-foreground" />
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="font-serif text-3xl font-medium tracking-tight">
                    Check your email
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    We sent a 6-digit code to{" "}
                    <span className="font-mono text-foreground">
                      {MASKED_EMAIL}
                    </span>
                    . It expires in 10 minutes.
                  </p>
                </div>
              </div>

              <form noValidate className="p-8" onSubmit={onSubmit}>
                <FieldGroup className="gap-5">
                  <FieldSet className="gap-1.5">
                    <FieldLegend
                      variant="label"
                      className="mb-1.5 font-mono font-normal uppercase tracking-[0.12em] text-muted-foreground data-[variant=label]:text-[10px]"
                    >
                      Verification code
                    </FieldLegend>
                    <div dir="ltr" className="flex justify-between gap-2">
                      {code.map((digit, i) => (
                        <Input
                          key={i}
                          ref={(el) => {
                            inputsRef.current[i] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          autoComplete={i === 0 ? "one-time-code" : "off"}
                          aria-label={`Digit ${i + 1}`}
                          aria-invalid={Boolean(error) || undefined}
                          aria-describedby={
                            error ? "otp01-code-error" : undefined
                          }
                          value={digit}
                          onChange={(e) => onChange(i, e)}
                          onKeyDown={(e) => onKeyDown(i, e)}
                          onPaste={(e) => onPaste(i, e)}
                          onFocus={(e) => e.target.select()}
                          className={cn(
                            "size-11 px-0 text-center font-mono text-base tabular-nums",
                            digit && "border-foreground",
                          )}
                        />
                      ))}
                    </div>
                    <FieldError id="otp01-code-error" className="text-xs">
                      {error}
                    </FieldError>
                  </FieldSet>

                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={status === "verifying"}
                    className="group"
                  >
                    {status === "verifying" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      <>
                        Verify code
                        <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                      </>
                    )}
                  </Button>

                  <p
                    className="text-center text-xs text-muted-foreground"
                    aria-live="polite"
                  >
                    {secondsLeft > 0 ? (
                      <>
                        Resend code in{" "}
                        <span className="font-mono tabular-nums text-foreground">
                          0:{String(secondsLeft).padStart(2, "0")}
                        </span>
                      </>
                    ) : (
                      <>
                        Didn&apos;t get it?{" "}
                        <Button
                          type="button"
                          variant="link"
                          size="xs"
                          onClick={resend}
                          className="h-auto p-0"
                        >
                          Resend code
                        </Button>
                      </>
                    )}
                  </p>
                </FieldGroup>
              </form>

              <div className="border-t border-border px-8 py-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Wrong address?{" "}
                  <a
                    href="#"
                    className="font-medium text-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Back to sign in
                  </a>
                </p>
              </div>
            </>
          )}
        </div>

        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          One-time codes · Never shared with anyone
        </p>
      </div>
    </section>
  );
};

export default OtpVerify01;

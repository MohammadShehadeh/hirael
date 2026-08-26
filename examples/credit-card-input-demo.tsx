"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Button } from "@/registry/hirael/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/registry/hirael/ui/field";
import {
  CreditCardInput,
  CreditCardInputBrand,
  CreditCardInputCvc,
  CreditCardInputExpiry,
  CreditCardInputNumber,
  type CreditCardChange,
} from "@/registry/hirael/components/credit-card-input";

const CreditCardInputDemo = () => {
  const t = useT();
  const [card, setCard] = React.useState<CreditCardChange | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  const errors = submitted ? (card?.errors ?? ["number", "expiry", "cvc"]) : [];
  const messages = {
    number: t({
      en: "Enter a valid card number.",
      ar: "أدخل رقم بطاقة صحيحًا.",
    }),
    expiry: t({
      en: "Expiry must be in the future.",
      ar: "يجب أن يكون تاريخ الانتهاء في المستقبل.",
    }),
    cvc: t({ en: "Check the security code.", ar: "تحقق من رمز الأمان." }),
  } as const;

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Checkout row · brand detection",
            ar: "صف الدفع · كشف العلامة",
          })}
        </p>
        <form
          className="rounded-md border border-border bg-card p-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <FieldGroup className="gap-3">
            <Field
              className="gap-2"
              data-invalid={errors.length > 0 || undefined}
            >
              <FieldLabel htmlFor="checkout-card-number">
                {t({ en: "Card details", ar: "بيانات البطاقة" })}
              </FieldLabel>
              <CreditCardInput id="checkout-card" onValueChange={setCard}>
                <CreditCardInputNumber
                  aria-label={t({ en: "Card number", ar: "رقم البطاقة" })}
                />
                <CreditCardInputExpiry
                  aria-label={t({ en: "Expiry date", ar: "تاريخ الانتهاء" })}
                />
                <CreditCardInputCvc
                  aria-label={t({ en: "Security code", ar: "رمز الأمان" })}
                />
              </CreditCardInput>
              {errors.length > 0 && (
                <FieldError className="text-[11px]">
                  <ul className="grid gap-1">
                    {errors.map((field) => (
                      <li key={field}>{messages[field]}</li>
                    ))}
                  </ul>
                </FieldError>
              )}
              {card?.valid && (
                <FieldDescription className="text-[11px] text-success">
                  {t({ en: "Looks good.", ar: "كل شيء صحيح." })}
                </FieldDescription>
              )}
            </Field>
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] text-muted-foreground">
                {t({
                  en: "Try 4242 4242 4242 4242",
                  ar: "جرّب 4242 4242 4242 4242",
                })}
              </p>
              <Button type="submit" size="sm">
                {t({ en: "Pay $48.00", ar: "ادفع 48.00$" })}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Stacked · own labels", ar: "مكدّس · تسميات مخصصة" })}
        </p>
        <CreditCardInput
          variant="stack"
          defaultValue={{ number: "378282246310005", expiry: "12/29", cvc: "" }}
          className="rounded-md border border-border bg-card p-4"
        >
          <Field className="gap-1.5">
            <div className="flex items-center justify-between">
              <FieldTitle>
                {t({ en: "Card number", ar: "رقم البطاقة" })}
              </FieldTitle>
              <CreditCardInputBrand
                labels={t({
                  en: { amex: "American Express" },
                  ar: { amex: "أمريكان إكسبريس" },
                })}
              />
            </div>
            <CreditCardInputNumber
              aria-label={t({ en: "Card number", ar: "رقم البطاقة" })}
            >
              <span aria-hidden />
            </CreditCardInputNumber>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field className="gap-1.5">
              <FieldTitle>{t({ en: "Expires", ar: "تنتهي في" })}</FieldTitle>
              <CreditCardInputExpiry
                aria-label={t({ en: "Expiry date", ar: "تاريخ الانتهاء" })}
              />
            </Field>
            <Field className="gap-1.5">
              <FieldTitle>{t({ en: "CVC", ar: "رمز الأمان" })}</FieldTitle>
              <CreditCardInputCvc
                aria-label={t({ en: "Security code", ar: "رمز الأمان" })}
              />
            </Field>
          </div>
          <FieldDescription className="text-[11px]">
            {t({
              en: "Amex cards take a 4-digit code on the front.",
              ar: "بطاقات أمريكان إكسبريس تستخدم رمزًا من 4 أرقام على الوجه.",
            })}
          </FieldDescription>
        </CreditCardInput>
      </div>
    </div>
  );
};

export default CreditCardInputDemo;

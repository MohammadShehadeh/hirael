"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/hirael/ui/field";
import {
  CountrySelect,
  CountrySelectContent,
  CountrySelectFlag,
  CountrySelectList,
  CountrySelectSearch,
  CountrySelectTrigger,
  CountrySelectValue,
} from "@/registry/hirael/components/country-select";

const CountrySelectDemo = () => {
  const t = useT();
  const [country, setCountry] = React.useState("JO");
  const [markets, setMarkets] = React.useState<string[]>(["AE", "SA"]);
  const [shipping, setShipping] = React.useState("");

  const searchPlaceholder = t({
    en: "Search by name or code",
    ar: "ابحث بالاسم أو الرمز",
  });
  const emptyLabel = t({ en: "No country found.", ar: "لا توجد دولة." });

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Single · with dial code",
            ar: "اختيار مفرد · مع رمز الاتصال",
          })}
        </p>
        <CountrySelect value={country} onValueChange={setCountry} showDialCode>
          <CountrySelectTrigger>
            <CountrySelectValue
              placeholder={t({ en: "Select a country", ar: "اختر دولة" })}
            />
          </CountrySelectTrigger>
          <CountrySelectContent>
            <CountrySelectSearch placeholder={searchPlaceholder} />
            <CountrySelectList emptyLabel={emptyLabel} />
          </CountrySelectContent>
        </CountrySelect>
        <p className="font-mono text-[11px] text-muted-foreground">
          ISO: {country || "-"}
        </p>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Multiple · pinned Gulf markets",
            ar: "اختيار متعدد · أسواق الخليج مثبتة",
          })}
        </p>
        <CountrySelect
          multiple
          value={markets}
          onValueChange={setMarkets}
          priority={["AE", "SA", "QA", "KW", "BH", "OM"]}
        >
          <CountrySelectTrigger>
            <CountrySelectValue
              placeholder={t({ en: "Pick markets", ar: "اختر الأسواق" })}
              countLabel={(n) => t({ en: `${n} markets`, ar: `${n} أسواق` })}
            />
          </CountrySelectTrigger>
          <CountrySelectContent>
            <CountrySelectSearch placeholder={searchPlaceholder} />
            <CountrySelectList
              emptyLabel={emptyLabel}
              priorityLabel={t({ en: "Gulf", ar: "الخليج" })}
              allLabel={t({ en: "All countries", ar: "كل الدول" })}
            />
          </CountrySelectContent>
        </CountrySelect>
        <div className="flex flex-wrap gap-1.5">
          {markets.map((iso2) => (
            <span
              key={iso2}
              className="inline-flex items-center gap-1 rounded-sm bg-accent px-1.5 py-0.5 font-mono text-[11px] text-foreground"
            >
              <CountrySelectFlag iso2={iso2} className="w-4 text-sm" />
              {iso2}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({
            en: "Form row · label and hint",
            ar: "صف نموذج · تسمية وتلميح",
          })}
        </p>
        <Field className="gap-2 rounded-md border border-border bg-card p-4">
          <FieldLabel htmlFor="ship-country">
            {t({ en: "Shipping country", ar: "دولة الشحن" })}
          </FieldLabel>
          <CountrySelect
            id="ship-country"
            value={shipping}
            onValueChange={setShipping}
            priority={["US", "GB", "DE"]}
          >
            <CountrySelectTrigger className="w-full sm:max-w-xs">
              <CountrySelectValue
                placeholder={t({ en: "Where to?", ar: "إلى أين؟" })}
              />
            </CountrySelectTrigger>
            <CountrySelectContent>
              <CountrySelectSearch placeholder={searchPlaceholder} />
              <CountrySelectList
                emptyLabel={emptyLabel}
                priorityLabel={t({ en: "Popular", ar: "شائعة" })}
              />
            </CountrySelectContent>
          </CountrySelect>
          <FieldDescription className="text-[11px]">
            {t({
              en: "We ship to 64 countries. Duties are shown at checkout.",
              ar: "نشحن إلى 64 دولة. تُعرض الرسوم عند الدفع.",
            })}
          </FieldDescription>
        </Field>
      </div>
    </div>
  );
};

export default CountrySelectDemo;

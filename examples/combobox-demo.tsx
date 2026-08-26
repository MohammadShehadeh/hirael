"use client";

import * as React from "react";
import { GlobeIcon } from "lucide-react";

import { useT } from "@/lib/demo-locale";
import { Field, FieldGroup, FieldLabel } from "@/registry/hirael/ui/field";
import { InputGroupAddon } from "@/registry/hirael/ui/input-group";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/registry/hirael/components/combobox";

const FRAMEWORKS = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
  "Gatsby",
];

const ComboboxDemo = () => {
  const t = useT();

  const TIMEZONES = [
    {
      value: t({ en: "Americas", ar: "الأمريكتان" }),
      items: [
        t({ en: "(GMT-5) New York", ar: "(GMT-5) نيويورك" }),
        t({ en: "(GMT-8) Los Angeles", ar: "(GMT-8) لوس أنجلوس" }),
        t({ en: "(GMT-3) São Paulo", ar: "(GMT-3) ساو باولو" }),
      ],
    },
    {
      value: t({ en: "Europe", ar: "أوروبا" }),
      items: [
        t({ en: "(GMT+0) London", ar: "(GMT+0) لندن" }),
        t({ en: "(GMT+1) Paris", ar: "(GMT+1) باريس" }),
        t({ en: "(GMT+1) Berlin", ar: "(GMT+1) برلين" }),
      ],
    },
    {
      value: t({ en: "Asia/Pacific", ar: "آسيا/المحيط الهادئ" }),
      items: [
        t({ en: "(GMT+9) Tokyo", ar: "(GMT+9) طوكيو" }),
        t({ en: "(GMT+4) Dubai", ar: "(GMT+4) دبي" }),
        t({ en: "(GMT+11) Sydney", ar: "(GMT+11) سيدني" }),
      ],
    },
  ];

  const anchor = useComboboxAnchor();

  return (
    <FieldGroup className="max-w-xs gap-8">
      <Field className="gap-2">
        <FieldLabel htmlFor="cb-single">
          {t({ en: "Single with clear", ar: "مفرد مع مسح" })}
        </FieldLabel>
        <Combobox items={FRAMEWORKS} defaultValue="Next.js">
          <ComboboxInput
            id="cb-single"
            placeholder={t({ en: "Select a framework", ar: "اختر إطار عمل" })}
            showClear
          />
          <ComboboxContent>
            <ComboboxEmpty>
              {t({ en: "No frameworks found.", ar: "لا أطر عمل." })}
            </ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="cb-grouped">
          {t({ en: "Grouped with an addon", ar: "مجمّع مع إضافة" })}
        </FieldLabel>
        <Combobox items={TIMEZONES}>
          <ComboboxInput
            id="cb-grouped"
            placeholder={t({
              en: "Select a timezone",
              ar: "اختر منطقة زمنية",
            })}
          >
            <InputGroupAddon>
              <GlobeIcon />
            </InputGroupAddon>
          </ComboboxInput>
          <ComboboxContent>
            <ComboboxEmpty>
              {t({ en: "No timezones found.", ar: "لا مناطق زمنية." })}
            </ComboboxEmpty>
            <ComboboxList>
              {(group: (typeof TIMEZONES)[number]) => (
                <ComboboxGroup key={group.value} items={group.items}>
                  <ComboboxLabel>{group.value}</ComboboxLabel>
                  <ComboboxCollection>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="cb-multiple">
          {t({ en: "Multiple", ar: "متعدد" })}
        </FieldLabel>
        <Combobox multiple items={FRAMEWORKS} defaultValue={["Next.js"]}>
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              {(values: string[]) => (
                <>
                  {values.map((value) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    id="cb-multiple"
                    placeholder={t({
                      en: "Add framework…",
                      ar: "أضف إطار عمل…",
                    })}
                  />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>
              {t({ en: "No frameworks found.", ar: "لا أطر عمل." })}
            </ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
    </FieldGroup>
  );
};

export default ComboboxDemo;

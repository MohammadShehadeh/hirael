"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Field, FieldLabel } from "@/registry/hirael/ui/field";
import {
  TagInput,
  TagInputContainer,
  TagInputError,
  TagInputField,
  TagInputTag,
} from "@/registry/hirael/components/tag-input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TagInputEmails = () => {
  const t = useT();

  const [emails, setEmails] = React.useState<string[]>(["jane@hirael.com"]);

  return (
    <Field className="max-w-md gap-2">
      <FieldLabel htmlFor="email-tags-field">
        {t({ en: "Email tags · validated", ar: "وسوم بريد · مُتحقق منها" })}
      </FieldLabel>
      <TagInput
        value={emails}
        onValueChange={setEmails}
        validate={(tag) =>
          EMAIL_RE.test(tag)
            ? true
            : t({
                en: `Not a valid email: ${tag}`,
                ar: `بريد غير صالح: ${tag}`,
              })
        }
        maxTags={5}
      >
        <TagInputContainer>
          {emails.map((_, i) => (
            <TagInputTag key={i} index={i} />
          ))}
          <TagInputField id="email-tags-field" placeholder="you@example.com" />
        </TagInputContainer>
        <TagInputError className="mt-1" />
      </TagInput>
    </Field>
  );
};

export default TagInputEmails;

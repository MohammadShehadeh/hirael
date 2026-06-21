"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Label } from "@/registry/hirael/ui/label";
import {
  TagInput,
  TagInputContainer,
  TagInputError,
  TagInputField,
  TagInputTag,
} from "@/registry/hirael/components/tag-input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function TagInputEmails() {
  const t = useT();

  const [emails, setEmails] = React.useState<string[]>(["jane@hirael.com"]);

  return (
    <div className="grid w-full max-w-md gap-2">
      <Label>
        {t({ en: "Email tags · validated", ar: "وسوم بريد · مُتحقق منها" })}
      </Label>
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
          <TagInputField placeholder="you@example.com" />
        </TagInputContainer>
        <TagInputError className="mt-1" />
      </TagInput>
    </div>
  );
}

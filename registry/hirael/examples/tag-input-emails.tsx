"use client";

import * as React from "react";

import { Label } from "@/registry/hirael/ui/label";
import {
  TagInput,
  TagInputContainer,
  TagInputError,
  TagInputField,
  TagInputTag,
} from "@/registry/hirael/ui/tag-input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function TagInputEmails() {
  const [emails, setEmails] = React.useState<string[]>(["jane@hirael.com"]);

  return (
    <div className="grid w-full max-w-md gap-2">
      <Label>Email tags · validated</Label>
      <TagInput
        value={emails}
        onValueChange={setEmails}
        validate={(tag) =>
          EMAIL_RE.test(tag) ? true : `Not a valid email: ${tag}`
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

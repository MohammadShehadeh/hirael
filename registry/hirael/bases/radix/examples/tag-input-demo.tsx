'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Field, FieldLabel } from '@/registry/hirael/bases/radix/ui/field';
import {
  TagInput,
  TagInputContainer,
  TagInputError,
  TagInputField,
  TagInputTag,
} from '@/registry/hirael/bases/radix/components/tag-input';

const TagInputDemo = () => {
  const t = useT();

  const [tags, setTags] = React.useState<string[]>(['typescript', 'react']);

  return (
    <Field className="max-w-md gap-2">
      <FieldLabel htmlFor="tags-field">{t({ en: 'Tags · max 6', ar: 'الوسوم · 6 كحد أقصى' })}</FieldLabel>
      <TagInput value={tags} onValueChange={setTags} maxTags={6}>
        <TagInputContainer>
          {tags.map((_, i) => (
            <TagInputTag key={i} index={i} />
          ))}
          <TagInputField
            id="tags-field"
            placeholder={t({
              en: 'Enter, comma, or paste to split',
              ar: 'اضغط Enter أو فاصلة أو ألصق للتقسيم',
            })}
          />
        </TagInputContainer>
        <TagInputError className="mt-1" />
      </TagInput>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        {t({
          en: <>{tags.length} / 6 · paste &ldquo;a, b, c&rdquo; to split</>,
          ar: <>{tags.length} / 6 · ألصق &ldquo;a, b, c&rdquo; للتقسيم</>,
        })}
      </p>
    </Field>
  );
};

export default TagInputDemo;

'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { composeRefs } from '@/registry/hirael/lib/compose-refs';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import { Input } from '@/registry/hirael/bases/base/ui/input';

/** Selects its text on focus through its own ref, and still forwards the element to the parent. */
const SelectOnFocusInput = ({ ref, ...props }: React.ComponentProps<typeof Input>) => {
  const ownRef = React.useRef<HTMLInputElement>(null);
  const composedRef = React.useMemo(() => composeRefs(ownRef, ref), [ref]);

  return <Input ref={composedRef} onFocus={() => ownRef.current?.select()} {...props} />;
};

const ComposeRefsDemo = () => {
  const t = useT();
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="grid w-full max-w-md gap-3">
      <p className="text-sm text-muted-foreground">
        {t({
          en: 'The input selects its text with its own ref. The button reaches the same element through the forwarded one.',
          ar: 'يحدد الحقل نصّه عبر مرجعه الخاص. ويصل الزر إلى العنصر نفسه عبر المرجع المُمرَّر.',
        })}
      </p>
      <div className="flex items-center gap-2">
        <SelectOnFocusInput
          ref={inputRef}
          defaultValue="hirael.com/r/compose-refs.json"
          aria-label={t({ en: 'Registry URL', ar: 'رابط السجل' })}
        />
        <Button variant="outline" onClick={() => inputRef.current?.focus()}>
          {t({ en: 'Focus', ar: 'تركيز' })}
        </Button>
      </div>
    </div>
  );
};

export default ComposeRefsDemo;

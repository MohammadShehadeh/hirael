'use client';

import * as React from 'react';
import { ArrowUp } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorTrigger,
  type ModelOption,
} from '@/registry/hirael/bases/base/components/model-selector';

const ModelSelectorDemo = () => {
  const t = useT();
  const [model, setModel] = React.useState('claude-sonnet-5-5');

  const models: ModelOption[] = [
    {
      id: 'claude-opus-5-5',
      name: 'Claude Opus 5.5',
      provider: 'Anthropic',
      description: t({ en: 'Hardest problems and long agent runs', ar: 'لأصعب المسائل والمهام الطويلة' }),
      capabilities: ['vision', 'tools', 'reasoning', 'files'],
      contextWindow: 1_000_000,
    },
    {
      id: 'claude-sonnet-5-5',
      name: 'Claude Sonnet 5.5',
      provider: 'Anthropic',
      description: t({ en: 'Fast and capable for most work', ar: 'سريع وقادر لمعظم الأعمال' }),
      capabilities: ['vision', 'tools', 'reasoning', 'files'],
      contextWindow: 1_000_000,
    },
    {
      id: 'claude-haiku-4-5',
      name: 'Claude Haiku 4.5',
      provider: 'Anthropic',
      description: t({ en: 'Quick answers at low cost', ar: 'إجابات سريعة بتكلفة منخفضة' }),
      capabilities: ['vision', 'tools'],
      contextWindow: 200_000,
    },
    {
      id: 'local-small',
      name: t({ en: 'On-device small', ar: 'نموذج محلي صغير' }),
      provider: t({ en: 'Local', ar: 'محلي' }),
      description: t({ en: 'Runs offline, text only', ar: 'يعمل دون اتصال، نص فقط' }),
      contextWindow: 32_000,
    },
    {
      id: 'local-vision',
      name: t({ en: 'On-device vision', ar: 'نموذج رؤية محلي' }),
      provider: t({ en: 'Local', ar: 'محلي' }),
      description: t({ en: 'Needs a GPU', ar: 'يحتاج إلى معالج رسومي' }),
      capabilities: ['vision'],
      contextWindow: 8_000,
      disabled: true,
    },
  ];

  return (
    <div className="w-full max-w-lg rounded-xl border border-border bg-card p-2 text-card-foreground shadow-xs">
      <textarea
        rows={3}
        placeholder={t({ en: 'Ask anything', ar: 'اسأل أي شيء' })}
        aria-label={t({ en: 'Message', ar: 'الرسالة' })}
        className="w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
      />
      <div className="flex items-center justify-between gap-2">
        <ModelSelector
          models={models}
          value={model}
          onValueChange={setModel}
          labels={{
            placeholder: t({ en: 'Choose a model', ar: 'اختر نموذجًا' }),
            search: t({ en: 'Search models', ar: 'ابحث عن نموذج' }),
            empty: t({ en: 'No model found', ar: 'لا يوجد نموذج' }),
            capabilities: {
              vision: t({ en: 'Reads images', ar: 'يقرأ الصور' }),
              tools: t({ en: 'Uses tools', ar: 'يستخدم الأدوات' }),
              reasoning: t({ en: 'Reasons step by step', ar: 'يستنتج خطوة بخطوة' }),
              files: t({ en: 'Reads files', ar: 'يقرأ الملفات' }),
            },
          }}
        >
          <ModelSelectorTrigger />
          <ModelSelectorContent />
        </ModelSelector>
        <Button type="button" size="icon-sm" aria-label={t({ en: 'Send', ar: 'إرسال' })}>
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
};

export default ModelSelectorDemo;

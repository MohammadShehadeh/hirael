'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { ToolCall, type ToolCallStatus } from '@/registry/hirael/bases/radix/components/tool-call';

const ToolCallDemo = () => {
  const t = useT();
  const [deploy, setDeploy] = React.useState<ToolCallStatus>('approval');

  const labels = {
    status: {
      pending: t({ en: 'Pending', ar: 'قيد الانتظار' }),
      approval: t({ en: 'Needs approval', ar: 'بحاجة لموافقة' }),
      running: t({ en: 'Running', ar: 'قيد التشغيل' }),
      done: t({ en: 'Done', ar: 'تم' }),
      error: t({ en: 'Failed', ar: 'فشل' }),
      denied: t({ en: 'Denied', ar: 'مرفوض' }),
    },
    input: t({ en: 'Input', ar: 'المدخلات' }),
    output: t({ en: 'Output', ar: 'المخرجات' }),
    error: t({ en: 'Error', ar: 'الخطأ' }),
    approve: t({ en: 'Allow', ar: 'السماح' }),
    deny: t({ en: 'Deny', ar: 'رفض' }),
    approvalPrompt: t({
      en: 'This tool wants to run with the input above.',
      ar: 'تريد هذه الأداة العمل بالمدخلات أعلاه.',
    }),
  };

  return (
    <div className="grid w-full max-w-lg gap-3">
      <ToolCall
        name="search_docs"
        status="done"
        durationMs={420}
        input={{ query: 'filter builder date range', limit: 3 }}
        output={[
          { title: 'Filter Builder', url: '/components/inputs/filter-builder' },
          { title: 'Date Range Picker', url: '/components/pickers/date-range-picker' },
        ]}
        labels={labels}
      />
      <ToolCall
        name="deploy_preview"
        status={deploy}
        durationMs={2300}
        input={{ branch: 'feat/filter-builder', environment: 'preview' }}
        output={{ url: 'https://preview.hirael.com', status: 'ready' }}
        onApprove={() => {
          setDeploy('running');
          window.setTimeout(() => setDeploy('done'), 1600);
        }}
        onDeny={() => setDeploy('denied')}
        labels={labels}
      />
      <ToolCall
        name="read_file"
        status="error"
        input={{ path: 'registry/hirael/missing.ts' }}
        error="ENOENT: no such file or directory"
        labels={labels}
      />
      {(deploy === 'done' || deploy === 'denied') && (
        <button
          type="button"
          onClick={() => setDeploy('approval')}
          className="justify-self-start text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          {t({ en: 'Ask again', ar: 'اطلب مجددًا' })}
        </button>
      )}
    </div>
  );
};

export default ToolCallDemo;

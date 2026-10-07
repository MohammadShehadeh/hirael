'use client';

import * as React from 'react';
import { CalendarDays, Circle, CircleCheck, CircleDashed, CircleDot, Hash, Tag, Text, User } from 'lucide-react';

import { useDemoLocale, useT } from '@/lib/demo-locale';
import { Badge } from '@/registry/hirael/bases/base/ui/badge';
import {
  FilterBuilder,
  FilterBuilderAdd,
  FilterBuilderClear,
  FilterBuilderList,
  applyFilters,
  type Filter,
  type FilterField,
} from '@/registry/hirael/bases/base/components/filter-builder';

interface Issue {
  id: string;
  title: { en: string; ar: string };
  status: string;
  labels: string[];
  assignee: string;
  estimate: number;
  created: string;
}

const ISSUES: Issue[] = [
  {
    id: 'HIR-142',
    title: { en: 'Time slot picker keyboard focus', ar: 'تركيز لوحة المفاتيح في منتقي المواعيد' },
    status: 'progress',
    labels: ['feature'],
    assignee: 'mohammad',
    estimate: 5,
    created: '2026-09-28',
  },
  {
    id: 'HIR-139',
    title: { en: 'Filter chips wrap in RTL', ar: 'التفاف شرائح التصفية في RTL' },
    status: 'todo',
    labels: ['bug', 'rtl'],
    assignee: 'sara',
    estimate: 2,
    created: '2026-09-25',
  },
  {
    id: 'HIR-137',
    title: { en: 'Map markers in dark mode', ar: 'علامات الخريطة في الوضع الداكن' },
    status: 'done',
    labels: ['bug'],
    assignee: 'omar',
    estimate: 1,
    created: '2026-09-21',
  },
  {
    id: 'HIR-133',
    title: { en: 'Upload queue retries', ar: 'إعادة المحاولة في قائمة الرفع' },
    status: 'progress',
    labels: ['feature', 'files'],
    assignee: 'mohammad',
    estimate: 3,
    created: '2026-09-18',
  },
  {
    id: 'HIR-128',
    title: { en: 'PDF viewer zoom shortcuts', ar: 'اختصارات تكبير عارض PDF' },
    status: 'backlog',
    labels: ['feature', 'files'],
    assignee: 'sara',
    estimate: 2,
    created: '2026-09-11',
  },
  {
    id: 'HIR-121',
    title: { en: 'Kanban column limits', ar: 'حدود أعمدة كانبان' },
    status: 'done',
    labels: ['feature'],
    assignee: 'omar',
    estimate: 1,
    created: '2026-09-04',
  },
];

const FilterBuilderDemo = () => {
  const t = useT();
  const locale = useDemoLocale() === 'ar' ? 'ar' : 'en-US';
  const [filters, setFilters] = React.useState<Filter[]>([
    { id: 'status-1', field: 'status', operator: 'isNot', values: ['done'] },
  ]);

  const statusOptions = [
    {
      value: 'backlog',
      label: t({ en: 'Backlog', ar: 'مؤجلة' }),
      icon: <CircleDashed className="text-muted-foreground" />,
    },
    { value: 'todo', label: t({ en: 'To do', ar: 'للتنفيذ' }), icon: <Circle className="text-muted-foreground" /> },
    {
      value: 'progress',
      label: t({ en: 'In progress', ar: 'قيد التنفيذ' }),
      icon: <CircleDot className="text-warning" />,
    },
    { value: 'done', label: t({ en: 'Done', ar: 'منجزة' }), icon: <CircleCheck className="text-success" /> },
  ];
  const people = [
    { value: 'mohammad', label: 'Mohammad' },
    { value: 'sara', label: t({ en: 'Sara', ar: 'سارة' }) },
    { value: 'omar', label: t({ en: 'Omar', ar: 'عمر' }) },
  ];
  const fields: FilterField[] = [
    {
      id: 'status',
      label: t({ en: 'Status', ar: 'الحالة' }),
      icon: <CircleDot />,
      type: 'option',
      options: statusOptions,
    },
    {
      id: 'labels',
      label: t({ en: 'Labels', ar: 'الوسوم' }),
      icon: <Tag />,
      type: 'multiOption',
      options: [
        { value: 'bug', label: t({ en: 'Bug', ar: 'خلل' }) },
        { value: 'feature', label: t({ en: 'Feature', ar: 'ميزة' }) },
        { value: 'files', label: t({ en: 'Files', ar: 'ملفات' }) },
        { value: 'rtl', label: 'RTL' },
      ],
    },
    { id: 'assignee', label: t({ en: 'Assignee', ar: 'المسؤول' }), icon: <User />, type: 'option', options: people },
    { id: 'title', label: t({ en: 'Title', ar: 'العنوان' }), icon: <Text />, type: 'text' },
    { id: 'estimate', label: t({ en: 'Estimate', ar: 'التقدير' }), icon: <Hash />, type: 'number' },
    { id: 'created', label: t({ en: 'Created', ar: 'تاريخ الإنشاء' }), icon: <CalendarDays />, type: 'date' },
  ];

  const rows = applyFilters(ISSUES, filters, (issue, field) =>
    field === 'title' ? t(issue.title) : issue[field as keyof Issue],
  );

  return (
    <div className="grid w-full max-w-2xl gap-4">
      <FilterBuilder
        fields={fields}
        value={filters}
        onValueChange={setFilters}
        locale={locale}
        labels={{
          add: t({ en: 'Filter', ar: 'تصفية' }),
          clear: t({ en: 'Clear', ar: 'مسح' }),
          remove: t({ en: 'Remove filter', ar: 'إزالة عامل التصفية' }),
          searchFields: t({ en: 'Filter by…', ar: 'تصفية حسب…' }),
          searchOptions: t({ en: 'Search…', ar: 'بحث…' }),
          noResults: t({ en: 'No results', ar: 'لا نتائج' }),
          empty: t({ en: 'Any', ar: 'أي' }),
          back: t({ en: 'Back', ar: 'رجوع' }),
          and: t({ en: 'and', ar: 'و' }),
          selected: (count) => t({ en: `${count} selected`, ar: `${count} محددة` }),
        }}
        operatorLabels={t({
          en: {},
          ar: {
            is: 'هي',
            isNot: 'ليست',
            includesAny: 'تتضمن أيًا من',
            includesAll: 'تتضمن كل',
            excludes: 'تستثني',
            contains: 'يحتوي',
            notContains: 'لا يحتوي',
            equals: 'يساوي',
            between: 'بين',
            before: 'قبل',
            after: 'بعد',
          },
        })}
      >
        <FilterBuilderList />
        <FilterBuilderAdd />
        <FilterBuilderClear />
      </FilterBuilder>

      <ul className="divide-y divide-border rounded-md border border-border bg-card text-card-foreground">
        {rows.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-muted-foreground">
            {t({ en: 'No issues match these filters.', ar: 'لا توجد مهام تطابق عوامل التصفية.' })}
          </li>
        ) : (
          rows.map((issue) => {
            const status = statusOptions.find((s) => s.value === issue.status);

            return (
              <li key={issue.id} className="flex items-center gap-3 px-4 py-2.5 text-sm [&_svg]:size-4">
                {status?.icon}
                <span className="w-16 shrink-0 text-xs text-muted-foreground tabular-nums">{issue.id}</span>
                <span className="min-w-0 flex-1 truncate">{t(issue.title)}</span>
                <span className="hidden gap-1 sm:flex">
                  {issue.labels.map((label) => (
                    <Badge key={label} variant="outline">
                      {fields[1].options?.find((o) => o.value === label)?.label}
                    </Badge>
                  ))}
                </span>
              </li>
            );
          })
        )}
      </ul>
      <p className="text-xs text-muted-foreground tabular-nums">
        {t({ en: `${rows.length} of ${ISSUES.length} issues`, ar: `${rows.length} من ${ISSUES.length} مهام` })}
      </p>
    </div>
  );
};

export default FilterBuilderDemo;

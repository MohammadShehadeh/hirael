'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import {
  TreeSelect,
  TreeSelectContent,
  TreeSelectTrigger,
  type TreeSelectNode,
} from '@/registry/hirael/bases/base/components/tree-select';

const TreeSelectDemo = () => {
  const t = useT();
  const [region, setRegion] = React.useState<string | null>('fra');
  const [folders, setFolders] = React.useState<string[]>(['q3-report', 'brand-kit']);

  const regions: TreeSelectNode[] = [
    {
      value: 'europe',
      label: t({ en: 'Europe', ar: 'أوروبا' }),
      children: [
        {
          value: 'germany',
          label: t({ en: 'Germany', ar: 'ألمانيا' }),
          children: [
            { value: 'fra', label: t({ en: 'Frankfurt', ar: 'فرانكفورت' }) },
            { value: 'ber', label: t({ en: 'Berlin', ar: 'برلين' }) },
          ],
        },
        {
          value: 'france',
          label: t({ en: 'France', ar: 'فرنسا' }),
          children: [{ value: 'par', label: t({ en: 'Paris', ar: 'باريس' }) }],
        },
      ],
    },
    {
      value: 'middle-east',
      label: t({ en: 'Middle East', ar: 'الشرق الأوسط' }),
      children: [
        { value: 'ruh', label: t({ en: 'Riyadh', ar: 'الرياض' }) },
        { value: 'dxb', label: t({ en: 'Dubai', ar: 'دبي' }) },
        { value: 'amm', label: t({ en: 'Amman', ar: 'عمّان' }), disabled: true },
      ],
    },
    {
      value: 'americas',
      label: t({ en: 'Americas', ar: 'الأمريكتان' }),
      children: [
        { value: 'iad', label: t({ en: 'Virginia', ar: 'فرجينيا' }) },
        { value: 'sfo', label: t({ en: 'San Francisco', ar: 'سان فرانسيسكو' }) },
      ],
    },
  ];

  const drive: TreeSelectNode[] = [
    {
      value: 'finance',
      label: t({ en: 'Finance', ar: 'المالية' }),
      children: [
        { value: 'q3-report', label: t({ en: 'Q3 report', ar: 'تقرير الربع الثالث' }) },
        { value: 'invoices', label: t({ en: 'Invoices', ar: 'الفواتير' }) },
        { value: 'budget', label: t({ en: 'Budget 2027', ar: 'ميزانية 2027' }) },
      ],
    },
    {
      value: 'design',
      label: t({ en: 'Design', ar: 'التصميم' }),
      children: [
        { value: 'brand-kit', label: t({ en: 'Brand kit', ar: 'هوية العلامة' }) },
        {
          value: 'web',
          label: t({ en: 'Website', ar: 'الموقع' }),
          children: [
            { value: 'home', label: t({ en: 'Home page', ar: 'الصفحة الرئيسية' }) },
            { value: 'pricing', label: t({ en: 'Pricing page', ar: 'صفحة الأسعار' }) },
          ],
        },
      ],
    },
  ];

  return (
    <div className="grid w-full max-w-xs gap-8">
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({ en: 'Single, shows the path', ar: 'اختيار واحد مع المسار' })}
        </p>
        <TreeSelect options={regions} value={region} onValueChange={setRegion}>
          <TreeSelectTrigger placeholder={t({ en: 'Pick a region', ar: 'اختر منطقة' })} />
          <TreeSelectContent
            label={t({ en: 'Regions', ar: 'المناطق' })}
            searchPlaceholder={t({ en: 'Search regions', ar: 'ابحث في المناطق' })}
            emptyMessage={t({ en: 'No region found', ar: 'لا توجد منطقة' })}
          />
        </TreeSelect>
      </div>
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({ en: 'Multiple, branches check their leaves', ar: 'اختيار متعدد، الفروع تحدد عناصرها' })}
        </p>
        <TreeSelect multiple options={drive} value={folders} onValueChange={setFolders}>
          <TreeSelectTrigger placeholder={t({ en: 'Share files', ar: 'شارك الملفات' })} />
          <TreeSelectContent
            defaultExpanded
            label={t({ en: 'Files', ar: 'الملفات' })}
            searchPlaceholder={t({ en: 'Search files', ar: 'ابحث في الملفات' })}
            emptyMessage={t({ en: 'No file found', ar: 'لا يوجد ملف' })}
          />
        </TreeSelect>
      </div>
    </div>
  );
};

export default TreeSelectDemo;

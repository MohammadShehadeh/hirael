'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { DataGrid, type DataGridColumn } from '@/registry/hirael/bases/radix/components/data-grid';

interface Product extends Record<string, unknown> {
  sku: string;
  name: string;
  category: string;
  stock: number | null;
  price: number | null;
  active: boolean;
}

const NAMES = ['Desk lamp', 'Notebook', 'Mug', 'Backpack', 'Headphones', 'Water bottle', 'Keyboard', 'Plant pot'];
const CATEGORIES = ['home', 'office', 'travel', 'audio'];

// Deterministic rows, so the prerendered page and the browser agree.
const PRODUCTS: Product[] = Array.from({ length: 500 }, (_, i) => ({
  sku: `HRL-${String(1001 + i)}`,
  name: `${NAMES[i % NAMES.length]} ${Math.floor(i / NAMES.length) + 1}`,
  category: CATEGORIES[(i * 7) % CATEGORIES.length],
  stock: (i * 37) % 240,
  price: Math.round((((i * 53) % 180) + 9.99) * 100) / 100,
  active: i % 5 !== 0,
}));

const DataGridDemo = () => {
  const t = useT();
  const [data, setData] = React.useState(PRODUCTS);
  const [edits, setEdits] = React.useState(0);

  const columns: DataGridColumn<Product>[] = [
    { id: 'sku', header: 'SKU', width: 110, editable: false },
    { id: 'name', header: t({ en: 'Product', ar: 'المنتج' }), width: 200 },
    {
      id: 'category',
      header: t({ en: 'Category', ar: 'الفئة' }),
      type: 'select',
      width: 140,
      options: [
        { value: 'home', label: t({ en: 'Home', ar: 'المنزل' }) },
        { value: 'office', label: t({ en: 'Office', ar: 'المكتب' }) },
        { value: 'travel', label: t({ en: 'Travel', ar: 'السفر' }) },
        { value: 'audio', label: t({ en: 'Audio', ar: 'الصوت' }) },
      ],
    },
    { id: 'stock', header: t({ en: 'Stock', ar: 'المخزون' }), type: 'number', width: 100 },
    {
      id: 'price',
      header: t({ en: 'Price', ar: 'السعر' }),
      type: 'number',
      width: 110,
      format: (value) => (typeof value === 'number' ? `$${value.toFixed(2)}` : ''),
    },
    { id: 'active', header: t({ en: 'Listed', ar: 'معروض' }), type: 'checkbox', width: 90 },
  ];

  return (
    <div className="grid w-full max-w-3xl gap-3">
      <DataGrid
        label={t({ en: 'Products', ar: 'المنتجات' })}
        columns={columns}
        data={data}
        onDataChange={(next) => {
          setData(next);
          setEdits((n) => n + 1);
        }}
        height={360}
      />
      <p className="text-xs text-muted-foreground">
        {t({
          en: `500 rows. Arrow keys move, Enter or typing edits, Delete clears, and you can paste a block from a spreadsheet. ${edits} edits so far.`,
          ar: `500 صف. تنقّل بالأسهم، وعدّل بالضغط على Enter أو بالكتابة، وامسح بـ Delete، ويمكنك لصق كتلة من جدول بيانات. ${edits} تعديلات حتى الآن.`,
        })}
      </p>
    </div>
  );
};

export default DataGridDemo;

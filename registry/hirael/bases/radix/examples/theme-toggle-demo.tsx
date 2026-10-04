'use client';

import { useT } from '@/lib/demo-locale';
import { ThemeSelect, ThemeSwitcher, ThemeToggle } from '@/registry/hirael/bases/radix/components/theme-toggle';

const ThemeToggleDemo = () => {
  const t = useT();
  const labels = {
    light: t({ en: 'Light', ar: 'فاتح' }),
    dark: t({ en: 'Dark', ar: 'داكن' }),
    system: t({ en: 'System', ar: 'النظام' }),
    toggle: t({ en: 'Toggle theme', ar: 'تبديل السمة' }),
  };

  const rows = [
    {
      label: t({ en: 'Toggle', ar: 'زر تبديل' }),
      hint: t({ en: 'Flips light and dark', ar: 'يبدّل بين الفاتح والداكن' }),
      control: <ThemeToggle labels={labels} />,
    },
    {
      label: t({ en: 'Menu', ar: 'قائمة' }),
      hint: t({ en: 'Light, dark or system', ar: 'فاتح أو داكن أو النظام' }),
      control: <ThemeSelect labels={labels} />,
    },
    {
      label: t({ en: 'Switcher', ar: 'مبدّل' }),
      hint: t({ en: 'All three in view', ar: 'الخيارات الثلاثة ظاهرة' }),
      control: <ThemeSwitcher labels={labels} />,
    },
  ];

  return (
    <ul className="w-full max-w-sm divide-y divide-border rounded-md border border-border bg-card text-card-foreground">
      {rows.map((row) => (
        <li key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="grid gap-0.5">
            <span className="text-sm font-medium">{row.label}</span>
            <span className="text-xs text-muted-foreground">{row.hint}</span>
          </div>
          {row.control}
        </li>
      ))}
    </ul>
  );
};

export default ThemeToggleDemo;

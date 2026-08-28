'use client';

import { Calendar, Folder, Home, Mail, Music, Settings } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { Dock, DockItem, DockLabel } from '@/registry/hirael/bases/base/components/dock';

const DockDemo = () => {
  const t = useT();

  const APPS = [
    { key: 'home', label: t({ en: 'Home', ar: 'الرئيسية' }), icon: Home },
    { key: 'files', label: t({ en: 'Files', ar: 'الملفات' }), icon: Folder },
    { key: 'mail', label: t({ en: 'Mail', ar: 'البريد' }), icon: Mail },
    {
      key: 'calendar',
      label: t({ en: 'Calendar', ar: 'التقويم' }),
      icon: Calendar,
    },
    { key: 'music', label: t({ en: 'Music', ar: 'الموسيقى' }), icon: Music },
    {
      key: 'settings',
      label: t({ en: 'Settings', ar: 'الإعدادات' }),
      icon: Settings,
    },
  ];

  return (
    <div className="flex w-full max-w-xl items-end justify-center pt-12">
      <Dock>
        {APPS.map((app) => (
          <DockItem key={app.key} aria-label={app.label}>
            <DockLabel>{app.label}</DockLabel>
            <app.icon />
          </DockItem>
        ))}
      </Dock>
    </div>
  );
};

export default DockDemo;

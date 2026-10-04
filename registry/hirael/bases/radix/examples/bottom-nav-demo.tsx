'use client';

import * as React from 'react';
import { Bell, Home, Search, User } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { BottomNav, BottomNavItem } from '@/registry/hirael/bases/radix/components/bottom-nav';

const BottomNavDemo = () => {
  const t = useT();
  const [tab, setTab] = React.useState('home');
  const [unread, setUnread] = React.useState(3);

  const titles: Record<string, string> = {
    home: t({ en: 'Home', ar: 'الرئيسية' }),
    search: t({ en: 'Search', ar: 'البحث' }),
    inbox: t({ en: 'Notifications', ar: 'الإشعارات' }),
    profile: t({ en: 'Profile', ar: 'الملف الشخصي' }),
  };

  return (
    <div className="flex h-[30rem] w-full max-w-xs flex-col overflow-hidden rounded-[2rem] border-8 border-muted bg-background shadow-lg">
      <div className="border-b border-border px-4 py-3 text-sm font-semibold">{titles[tab]}</div>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
        {tab === 'inbox' && unread > 0
          ? t({ en: `${unread} new notifications`, ar: `${unread} إشعارات جديدة` })
          : t({ en: 'Tap a tab below.', ar: 'اضغط على تبويب في الأسفل.' })}
      </div>
      <BottomNav
        value={tab}
        onValueChange={(next) => {
          setTab(next);
          if (next === 'inbox') setUnread(0);
        }}
        aria-label={t({ en: 'Main', ar: 'الرئيسي' })}
      >
        <BottomNavItem value="home" icon={<Home />} label={titles.home} />
        <BottomNavItem value="search" icon={<Search />} label={titles.search} />
        <BottomNavItem value="inbox" icon={<Bell />} label={t({ en: 'Alerts', ar: 'التنبيهات' })} badge={unread} />
        <BottomNavItem value="profile" icon={<User />} label={titles.profile} badge />
      </BottomNav>
    </div>
  );
};

export default BottomNavDemo;

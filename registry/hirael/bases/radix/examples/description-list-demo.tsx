'use client';

import { CalendarDays, Globe, Mail, User } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { Avatar, AvatarFallback } from '@/registry/hirael/bases/radix/ui/avatar';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import {
  DescriptionList,
  DescriptionListDetails,
  DescriptionListItem,
  DescriptionListTerm,
} from '@/registry/hirael/bases/radix/components/description-list';

const DescriptionListDemo = () => {
  const t = useT();

  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Detail page', ar: 'صفحة التفاصيل' })}</p>
        <div className="rounded-md border border-border bg-card px-5 py-2 text-card-foreground">
          <DescriptionList divided>
            <DescriptionListItem>
              <DescriptionListTerm>
                <User />
                {t({ en: 'Owner', ar: 'المالك' })}
              </DescriptionListTerm>
              <DescriptionListDetails>
                <Avatar size="sm">
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                Mohammad Shehadeh
              </DescriptionListDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionListTerm>
                <Mail />
                {t({ en: 'Email', ar: 'البريد الإلكتروني' })}
              </DescriptionListTerm>
              <DescriptionListDetails>hello@mohammadshehadeh.com</DescriptionListDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionListTerm>
                <Globe />
                {t({ en: 'Region', ar: 'المنطقة' })}
              </DescriptionListTerm>
              <DescriptionListDetails>
                {t({ en: 'Frankfurt (eu-central-1)', ar: 'فرانكفورت (eu-central-1)' })}
              </DescriptionListDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionListTerm>
                <CalendarDays />
                {t({ en: 'Created', ar: 'تاريخ الإنشاء' })}
              </DescriptionListTerm>
              <DescriptionListDetails>
                <span className="tabular-nums">{t({ en: 'Sep 14, 2026', ar: '14 سبتمبر 2026' })}</span>
              </DescriptionListDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionListTerm>{t({ en: 'Status', ar: 'الحالة' })}</DescriptionListTerm>
              <DescriptionListDetails>
                <Badge variant="secondary">{t({ en: 'Active', ar: 'نشط' })}</Badge>
              </DescriptionListDetails>
            </DescriptionListItem>
          </DescriptionList>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">
          {t({ en: 'Stacked in columns', ar: 'مكدسة في أعمدة' })}
        </p>
        <div className="rounded-md border border-border bg-card p-5 text-card-foreground">
          <DescriptionList orientation="vertical" columns={3}>
            <DescriptionListItem>
              <DescriptionListTerm>{t({ en: 'Invoice', ar: 'الفاتورة' })}</DescriptionListTerm>
              <DescriptionListDetails>
                <span className="tabular-nums">INV-2048</span>
              </DescriptionListDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionListTerm>{t({ en: 'Amount', ar: 'المبلغ' })}</DescriptionListTerm>
              <DescriptionListDetails>
                <span className="tabular-nums">$1,240.00</span>
              </DescriptionListDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionListTerm>{t({ en: 'Due', ar: 'الاستحقاق' })}</DescriptionListTerm>
              <DescriptionListDetails>
                <span className="tabular-nums">{t({ en: 'Oct 30, 2026', ar: '30 أكتوبر 2026' })}</span>
              </DescriptionListDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionListTerm>{t({ en: 'Plan', ar: 'الخطة' })}</DescriptionListTerm>
              <DescriptionListDetails>{t({ en: 'Team, yearly', ar: 'الفريق، سنوي' })}</DescriptionListDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionListTerm>{t({ en: 'Seats', ar: 'المقاعد' })}</DescriptionListTerm>
              <DescriptionListDetails>
                <span className="tabular-nums">12</span>
              </DescriptionListDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionListTerm>{t({ en: 'Payment', ar: 'الدفع' })}</DescriptionListTerm>
              <DescriptionListDetails>
                <Badge variant="outline">{t({ en: 'Pending', ar: 'قيد الانتظار' })}</Badge>
              </DescriptionListDetails>
            </DescriptionListItem>
          </DescriptionList>
        </div>
      </div>
    </div>
  );
};

export default DescriptionListDemo;

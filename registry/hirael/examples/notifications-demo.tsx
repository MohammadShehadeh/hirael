"use client";

import { CreditCard, GitPullRequest, UserPlus } from "lucide-react";

import { useT } from "@/lib/demo-locale";
import {
  NotificationContent,
  NotificationDescription,
  NotificationItem,
  NotificationMedia,
  NotificationTime,
  NotificationTitle,
  Notifications,
  NotificationsHeader,
  NotificationsList,
  NotificationsTitle,
} from "@/registry/hirael/components/notifications";

export default function NotificationsDemo() {
  const t = useT();

  return (
    <Notifications className="w-full max-w-sm">
      <NotificationsHeader>
        <NotificationsTitle>
          {t({ en: "Notifications", ar: "الإشعارات" })}
        </NotificationsTitle>
        <button
          type="button"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {t({ en: "Mark all read", ar: "تعيين الكل كمقروء" })}
        </button>
      </NotificationsHeader>
      <NotificationsList>
        <NotificationItem unread>
          <NotificationMedia>
            <GitPullRequest />
          </NotificationMedia>
          <NotificationContent>
            <NotificationTitle>
              {t({
                en: (
                  <>
                    <span className="font-medium">Lena Park</span> requested
                    your review
                  </>
                ),
                ar: (
                  <>
                    طلبت <span className="font-medium">ليلى</span> مراجعتك
                  </>
                ),
              })}
            </NotificationTitle>
            <NotificationDescription>
              {t({
                en: "feat/billing-flow · 2 files changed",
                ar: "feat/billing-flow · تغيّر ملفّان",
              })}
            </NotificationDescription>
          </NotificationContent>
          <NotificationTime>
            {t({ en: "2m", ar: "قبل دقيقتين" })}
          </NotificationTime>
        </NotificationItem>

        <NotificationItem unread>
          <NotificationMedia>
            <CreditCard />
          </NotificationMedia>
          <NotificationContent>
            <NotificationTitle>
              {t({ en: "Payment received", ar: "تم استلام الدفعة" })}
            </NotificationTitle>
            <NotificationDescription>
              {t({
                en: "Invoice #3812 was paid in full.",
                ar: "تم سداد الفاتورة رقم 3812 بالكامل.",
              })}
            </NotificationDescription>
          </NotificationContent>
          <NotificationTime>{t({ en: "1h", ar: "قبل ساعة" })}</NotificationTime>
        </NotificationItem>

        <NotificationItem>
          <NotificationMedia>
            <UserPlus />
          </NotificationMedia>
          <NotificationContent>
            <NotificationTitle>
              {t({ en: "Theo Adams joined", ar: "انضمّ يوسف" })}
            </NotificationTitle>
            <NotificationDescription>
              {t({
                en: "Accepted your invite to the workspace.",
                ar: "قبِل دعوتك إلى مساحة العمل.",
              })}
            </NotificationDescription>
          </NotificationContent>
          <NotificationTime>
            {t({ en: "3h", ar: "قبل 3 ساعات" })}
          </NotificationTime>
        </NotificationItem>
      </NotificationsList>
    </Notifications>
  );
}

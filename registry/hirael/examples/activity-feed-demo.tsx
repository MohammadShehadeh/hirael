"use client";

import { GitMerge, MessageSquare, UserPlus } from "lucide-react";

import { useT } from "@/lib/demo-locale";
import {
  ActivityFeed,
  ActivityFeedAction,
  ActivityFeedActor,
  ActivityFeedAvatar,
  ActivityFeedBody,
  ActivityFeedContent,
  ActivityFeedDivider,
  ActivityFeedHeader,
  ActivityFeedItem,
  ActivityFeedTime,
} from "@/registry/hirael/components/activity-feed";

export default function ActivityFeedDemo() {
  const t = useT();

  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Team activity", ar: "نشاط الفريق" })}
        </p>
        <ActivityFeed>
          <ActivityFeedDivider>
            {t({ en: "Today", ar: "اليوم" })}
          </ActivityFeedDivider>
          <ActivityFeedItem>
            <ActivityFeedAvatar>
              <GitMerge className="text-foreground" />
            </ActivityFeedAvatar>
            <ActivityFeedContent>
              <ActivityFeedHeader>
                <ActivityFeedActor>
                  {t({ en: "Lena Park", ar: "ليلى" })}
                </ActivityFeedActor>
                <ActivityFeedAction>
                  {t({
                    en: (
                      <>
                        merged <span className="font-mono">feat/billing</span>{" "}
                        into main
                      </>
                    ),
                    ar: (
                      <>
                        دمجت <span className="font-mono">feat/billing</span> في
                        main
                      </>
                    ),
                  })}
                </ActivityFeedAction>
                <ActivityFeedTime className="ms-auto">14:20</ActivityFeedTime>
              </ActivityFeedHeader>
            </ActivityFeedContent>
          </ActivityFeedItem>
          <ActivityFeedItem>
            <ActivityFeedAvatar>
              {t({ en: "MS", ar: "م.س" })}
            </ActivityFeedAvatar>
            <ActivityFeedContent>
              <ActivityFeedHeader>
                <ActivityFeedActor>
                  {t({ en: "Mara Singh", ar: "مارا سينغ" })}
                </ActivityFeedActor>
                <ActivityFeedAction>
                  {t({
                    en: "commented on PR #1284",
                    ar: "علّقت على طلب السحب رقم 1284",
                  })}
                </ActivityFeedAction>
                <ActivityFeedTime className="ms-auto">13:58</ActivityFeedTime>
              </ActivityFeedHeader>
              <ActivityFeedBody>
                {t({
                  en: "Looks good. Can we add a test for the proration edge case before this ships?",
                  ar: "يبدو جيدًا. هل يمكننا إضافة اختبار لحالة احتساب التناسب قبل الإطلاق؟",
                })}
              </ActivityFeedBody>
            </ActivityFeedContent>
          </ActivityFeedItem>
          <ActivityFeedDivider>
            {t({ en: "Yesterday", ar: "أمس" })}
          </ActivityFeedDivider>
          <ActivityFeedItem>
            <ActivityFeedAvatar>
              <UserPlus className="text-foreground" />
            </ActivityFeedAvatar>
            <ActivityFeedContent>
              <ActivityFeedHeader>
                <ActivityFeedActor>
                  {t({ en: "Theo Adams", ar: "يوسف" })}
                </ActivityFeedActor>
                <ActivityFeedAction>
                  {t({
                    en: "joined the workspace",
                    ar: "انضمّ إلى مساحة العمل",
                  })}
                </ActivityFeedAction>
                <ActivityFeedTime className="ms-auto">17:02</ActivityFeedTime>
              </ActivityFeedHeader>
            </ActivityFeedContent>
          </ActivityFeedItem>
        </ActivityFeed>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Compact", ar: "مدمج" })}
        </p>
        <ActivityFeed>
          <ActivityFeedItem>
            <ActivityFeedAvatar>
              <MessageSquare className="text-foreground" />
            </ActivityFeedAvatar>
            <ActivityFeedContent>
              <ActivityFeedHeader>
                <ActivityFeedActor>
                  {t({ en: "Support", ar: "الدعم" })}
                </ActivityFeedActor>
                <ActivityFeedAction>
                  {t({
                    en: "replied to ticket 4821",
                    ar: "رد على التذكرة 4821",
                  })}
                </ActivityFeedAction>
              </ActivityFeedHeader>
              <ActivityFeedTime>
                {t({ en: "2 hours ago", ar: "قبل ساعتين" })}
              </ActivityFeedTime>
            </ActivityFeedContent>
          </ActivityFeedItem>
          <ActivityFeedItem>
            <ActivityFeedAvatar>
              {t({ en: "AK", ar: "آ.ك" })}
            </ActivityFeedAvatar>
            <ActivityFeedContent>
              <ActivityFeedHeader>
                <ActivityFeedActor>
                  {t({ en: "Aria Kettle", ar: "آريا كيتل" })}
                </ActivityFeedActor>
                <ActivityFeedAction>
                  {t({ en: "closed ticket 4820", ar: "أغلقت التذكرة 4820" })}
                </ActivityFeedAction>
              </ActivityFeedHeader>
              <ActivityFeedTime>
                {t({ en: "4 hours ago", ar: "قبل 4 ساعات" })}
              </ActivityFeedTime>
            </ActivityFeedContent>
          </ActivityFeedItem>
        </ActivityFeed>
      </div>
    </div>
  );
}

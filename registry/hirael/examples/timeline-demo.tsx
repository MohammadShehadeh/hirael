"use client";

import { Check, GitBranch, GitCommit, Rocket } from "lucide-react";

import { useT } from "@/lib/demo-locale";
import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/registry/hirael/ui/timeline";

export default function TimelineDemo() {
  const t = useT();

  return (
    <div className="grid w-full max-w-2xl gap-8">
      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "Activity feed", ar: "موجز النشاط" })}
        </p>
        <Timeline>
          <TimelineItem>
            <TimelineDot tone="success" />
            <TimelineContent>
              <TimelineTime>
                {t({ en: "Today · 14:02", ar: "اليوم · 14:02" })}
              </TimelineTime>
              <TimelineTitle>
                {t({
                  en: "Deployment shipped to production",
                  ar: "تم نشر الإصدار إلى الإنتاج",
                })}
              </TimelineTitle>
              <TimelineDescription>
                {t({
                  en: (
                    <>
                      Build <code className="font-mono">b-29f1</code> passed all
                      gates.
                    </>
                  ),
                  ar: (
                    <>
                      اجتاز الإصدار <code className="font-mono">b-29f1</code> كل
                      البوابات.
                    </>
                  ),
                })}
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot />
            <TimelineContent>
              <TimelineTime>
                {t({ en: "Today · 13:48", ar: "اليوم · 13:48" })}
              </TimelineTime>
              <TimelineTitle>
                {t({ en: "PR #1284 merged", ar: "تم دمج PR #1284" })}
              </TimelineTitle>
              <TimelineDescription>
                {t({
                  en: (
                    <>
                      <span className="font-medium text-foreground">
                        monica
                      </span>{" "}
                      merged{" "}
                      <span className="font-mono">feat/billing-flow</span> into{" "}
                      <span className="font-mono">main</span>.
                    </>
                  ),
                  ar: (
                    <>
                      دمجت{" "}
                      <span className="font-medium text-foreground">منى</span>{" "}
                      الفرع <span className="font-mono">feat/billing-flow</span>{" "}
                      في <span className="font-mono">main</span>.
                    </>
                  ),
                })}
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="warning" />
            <TimelineContent>
              <TimelineTime>
                {t({ en: "Today · 11:12", ar: "اليوم · 11:12" })}
              </TimelineTime>
              <TimelineTitle>
                {t({ en: "Slow query detected", ar: "رُصد استعلام بطيء" })}
              </TimelineTitle>
              <TimelineDescription>
                {t({
                  en: (
                    <>
                      <code className="font-mono">/api/reports</code> averaged
                      2.4s over the last 15 min.
                    </>
                  ),
                  ar: (
                    <>
                      بلغ متوسط <code className="font-mono">/api/reports</code>{" "}
                      2.4 ثانية خلال آخر 15 دقيقة.
                    </>
                  ),
                })}
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="muted" />
            <TimelineContent>
              <TimelineTime>
                {t({ en: "Yesterday · 17:30", ar: "أمس · 17:30" })}
              </TimelineTime>
              <TimelineTitle>
                {t({
                  en: "Release notes drafted",
                  ar: "صياغة ملاحظات الإصدار",
                })}
              </TimelineTitle>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>

      <div className="grid gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: "With icons", ar: "مع أيقونات" })}
        </p>
        <Timeline>
          <TimelineItem>
            <TimelineDot>
              <Rocket className="text-foreground" />
            </TimelineDot>
            <TimelineContent>
              <TimelineTitle>
                {t({ en: "v1.4 released", ar: "إصدار v1.4" })}
              </TimelineTitle>
              <TimelineDescription>
                {t({
                  en: "New billing flow, faster cold start.",
                  ar: "تدفق فوترة جديد، وبدء تشغيل أسرع.",
                })}
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot>
              <Check className="text-foreground" />
            </TimelineDot>
            <TimelineContent>
              <TimelineTitle>
                {t({ en: "QA sign-off", ar: "اعتماد ضمان الجودة" })}
              </TimelineTitle>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot>
              <GitBranch className="text-foreground" />
            </TimelineDot>
            <TimelineContent>
              <TimelineTitle>
                {t({
                  en: "Branch cut · release/1.4",
                  ar: "إنشاء فرع · release/1.4",
                })}
              </TimelineTitle>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot>
              <GitCommit className="text-foreground" />
            </TimelineDot>
            <TimelineContent>
              <TimelineTitle>
                {t({ en: "First commit", ar: "أول إيداع" })}
              </TimelineTitle>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  );
}

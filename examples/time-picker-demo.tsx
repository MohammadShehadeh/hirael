"use client";

import * as React from "react";

import { useT } from "@/lib/demo-locale";
import { Field, FieldGroup, FieldLabel } from "@/registry/hirael/ui/field";
import {
  TimePicker,
  TimePickerContent,
  TimePickerTrigger,
  type TimeValue,
} from "@/registry/hirael/components/time-picker";

const TimePickerDemo = () => {
  const t = useT();
  const [t24, setT24] = React.useState<TimeValue>({ hour: 14, minute: 30 });
  const [t12, setT12] = React.useState<TimeValue>({
    hour: 9,
    minute: 15,
    second: 0,
  });

  return (
    <FieldGroup className="grid max-w-md grid-cols-1 gap-8 sm:grid-cols-2">
      <Field className="gap-2">
        <FieldLabel htmlFor="tp-meeting">
          {t({ en: "Meeting time (24h)", ar: "وقت الاجتماع (24 ساعة)" })}
        </FieldLabel>
        <TimePicker
          value={t24}
          onValueChange={setT24}
          format="24h"
          minuteStep={5}
        >
          <TimePickerTrigger id="tp-meeting" />
          <TimePickerContent />
        </TimePicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {`${t24.hour}:${t24.minute.toString().padStart(2, "0")}`}
        </p>
      </Field>

      <Field className="gap-2">
        <FieldLabel htmlFor="tp-reminder">
          {t({ en: "Reminder (12h · seconds)", ar: "تذكير (12 ساعة · ثوانٍ)" })}
        </FieldLabel>
        <TimePicker
          value={t12}
          onValueChange={setT12}
          format="12h"
          showSeconds
          secondStep={15}
        >
          <TimePickerTrigger id="tp-reminder" />
          <TimePickerContent />
        </TimePicker>
        <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
          {`${t12.hour}:${t12.minute.toString().padStart(2, "0")}:${(
            t12.second ?? 0
          )
            .toString()
            .padStart(2, "0")}`}
        </p>
      </Field>
    </FieldGroup>
  );
};

export default TimePickerDemo;

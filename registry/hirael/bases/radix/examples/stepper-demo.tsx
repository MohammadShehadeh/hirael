'use client';

import * as React from 'react';

import { useT } from '@/lib/demo-locale';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/registry/hirael/bases/radix/components/stepper';

const StepperDemo = () => {
  const t = useT();
  const [current, setCurrent] = React.useState(2);

  const steps = [
    {
      step: 1,
      title: t({ en: 'Account', ar: 'الحساب' }),
      description: t({ en: 'Email & password', ar: 'البريد وكلمة المرور' }),
    },
    {
      step: 2,
      title: t({ en: 'Profile', ar: 'الملف الشخصي' }),
      description: t({ en: 'Name & avatar', ar: 'الاسم والصورة' }),
    },
    {
      step: 3,
      title: t({ en: 'Billing', ar: 'الفوترة' }),
      description: t({ en: 'Plan & card', ar: 'الخطة والبطاقة' }),
    },
    {
      step: 4,
      title: t({ en: 'Done', ar: 'تم' }),
      description: t({ en: 'Review & submit', ar: 'مراجعة وإرسال' }),
    },
  ];

  return (
    <div className="grid w-full max-w-2xl gap-10">
      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Horizontal · interactive', ar: 'أفقي · تفاعلي' })}
        </p>
        <Stepper value={current} onValueChange={setCurrent}>
          {steps.map(({ step, title }) => (
            <StepperItem key={step} step={step}>
              <StepperTrigger>
                <StepperIndicator />
                <StepperTitle>{title}</StepperTitle>
              </StepperTrigger>
              {step < steps.length && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrent((s) => Math.max(1, s - 1))}
            disabled={current === 1}
          >
            {t({ en: 'Back', ar: 'رجوع' })}
          </Button>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            {t({
              en: `Step ${current} of ${steps.length}`,
              ar: `خطوة ${current} من ${steps.length}`,
            })}
          </span>
          <Button
            type="button"
            size="sm"
            onClick={() => setCurrent((s) => Math.min(steps.length, s + 1))}
            disabled={current === steps.length}
          >
            {t({ en: 'Next', ar: 'التالي' })}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {t({ en: 'Vertical · with descriptions', ar: 'عمودي · مع أوصاف' })}
        </p>
        <Stepper value={current} onValueChange={setCurrent} orientation="vertical">
          {steps.map(({ step, title, description }) => (
            <StepperItem key={step} step={step}>
              <StepperTrigger>
                <StepperIndicator />
                <span>
                  <StepperTitle>{title}</StepperTitle>
                  <StepperDescription>{description}</StepperDescription>
                </span>
              </StepperTrigger>
              {step < steps.length && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>
      </div>
    </div>
  );
};

export default StepperDemo;

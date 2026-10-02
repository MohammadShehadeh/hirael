'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';
import { Button } from '@/registry/hirael/bases/base/ui/button';

interface QuantityProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
}

const Quantity = ({
  value: valueProp,
  defaultValue = 1,
  onValueChange,
  label,
  decreaseLabel,
  increaseLabel,
}: QuantityProps) => {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  return (
    <div role="group" aria-label={label} className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon-sm"
        aria-label={decreaseLabel}
        onClick={() => setValue(Math.max(0, value - 1))}
      >
        <Minus />
      </Button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">{value}</span>
      <Button variant="outline" size="icon-sm" aria-label={increaseLabel} onClick={() => setValue(value + 1)}>
        <Plus />
      </Button>
    </div>
  );
};

const UseControllableStateDemo = () => {
  const t = useT();
  const [quantity, setQuantity] = React.useState(3);

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Uncontrolled', ar: 'غير متحكَّم به' })}</p>
        <Quantity
          defaultValue={1}
          label={t({ en: 'Quantity', ar: 'الكمية' })}
          decreaseLabel={t({ en: 'Decrease', ar: 'إنقاص' })}
          increaseLabel={t({ en: 'Increase', ar: 'زيادة' })}
        />
        <p className="text-sm text-muted-foreground">{t({ en: 'Keeps its own count.', ar: 'يحتفظ بعدّه الخاص.' })}</p>
      </div>

      <div className="grid gap-2">
        <p className="text-xs text-muted-foreground uppercase">{t({ en: 'Controlled', ar: 'متحكَّم به' })}</p>
        <div className="flex items-center gap-3">
          <Quantity
            value={quantity}
            onValueChange={setQuantity}
            label={t({ en: 'Quantity', ar: 'الكمية' })}
            decreaseLabel={t({ en: 'Decrease', ar: 'إنقاص' })}
            increaseLabel={t({ en: 'Increase', ar: 'زيادة' })}
          />
          <Button variant="ghost" size="sm" onClick={() => setQuantity(0)}>
            {t({ en: 'Reset', ar: 'إعادة تعيين' })}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">
          {t({ en: `Parent state: ${quantity}`, ar: `حالة الأب: ${quantity}` })}
        </p>
      </div>
    </div>
  );
};

export default UseControllableStateDemo;

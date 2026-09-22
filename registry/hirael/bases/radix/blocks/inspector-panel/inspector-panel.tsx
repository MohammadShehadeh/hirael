'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/hirael/bases/radix/ui/collapsible';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/registry/hirael/bases/radix/ui/input-group';
import { NativeSelect, NativeSelectOption } from '@/registry/hirael/bases/radix/ui/native-select';

type InspectorPanelProps = React.ComponentProps<'aside'>;

const InspectorPanel = ({ className, ...props }: InspectorPanelProps) => {
  return (
    <aside
      data-slot="inspector-panel"
      className={cn(
        'flex w-full max-w-xs flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-card text-card-foreground',
        className,
      )}
      {...props}
    />
  );
};

type InspectorPanelHeaderProps = React.ComponentProps<'div'>;

const InspectorPanelHeader = ({ className, ...props }: InspectorPanelHeaderProps) => {
  return (
    <div
      data-slot="inspector-panel-header"
      className={cn('flex items-center justify-between gap-2 border-b border-border px-3 py-2.5', className)}
      {...props}
    />
  );
};

type InspectorPanelTitleProps = React.ComponentProps<'p'>;

const InspectorPanelTitle = ({ className, ...props }: InspectorPanelTitleProps) => {
  return (
    <p
      data-slot="inspector-panel-title"
      className={cn('text-xs uppercase text-muted-foreground', className)}
      {...props}
    />
  );
};

interface InspectorPanelSectionProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: React.ReactNode;
  defaultOpen?: boolean;
}

const InspectorPanelSection = ({
  title,
  defaultOpen = true,
  className,
  children,
  ...props
}: InspectorPanelSectionProps) => {
  return (
    <Collapsible defaultOpen={defaultOpen} data-slot="inspector-panel-section" className={className} {...props}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="group flex w-full items-center justify-between gap-2 px-3 py-2 text-start transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <span className="text-xs font-medium text-foreground">{title}</span>
          <ChevronDown
            aria-hidden
            className="size-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-2 px-3 pb-3 pt-1">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

interface InspectorPanelRowProps extends React.ComponentProps<'div'> {
  label: React.ReactNode;
}

const InspectorPanelRow = ({ label, className, children, ...props }: InspectorPanelRowProps) => {
  return (
    <div
      data-slot="inspector-panel-row"
      className={cn('grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-2', className)}
      {...props}
    >
      <span className="truncate text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center justify-end gap-1.5">{children}</div>
    </div>
  );
};

export { InspectorPanel, InspectorPanelHeader, InspectorPanelTitle, InspectorPanelSection, InspectorPanelRow };

const ENTER =
  'animate-in fade-in slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none';

interface InspectorFieldProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  /** Unit shown after the value, e.g. `px` or `%`. */
  unit?: React.ReactNode;
  /** Content shown before the value, e.g. a color swatch. */
  leading?: React.ReactNode;
}

const InspectorField = ({ unit, leading, className, ...props }: InspectorFieldProps) => {
  return (
    <InputGroup data-slot="inspector-field" className="h-7 w-full">
      {leading ? <InputGroupAddon>{leading}</InputGroupAddon> : null}
      <InputGroupInput className={cn('h-7', className)} {...props} />
      {unit ? (
        <InputGroupAddon align="inline-end">
          <span className="text-xs font-normal">{unit}</span>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );
};

const HEX_PATTERN = /^#[0-9a-f]{6}$/i;

const clampNumber = (raw: string, min: number, max: number) => {
  const digits = raw.replace(/[^0-9]/g, '');
  if (digits === '') return '';
  return String(Math.min(max, Math.max(min, Number(digits))));
};

const InspectorPanelBlock = () => {
  const [layout, setLayout] = React.useState({ width: '320', height: '192', radius: '12' });
  const [fill, setFill] = React.useState('#3F6FD8');
  const [opacity, setOpacity] = React.useState('100');
  const [fontSize, setFontSize] = React.useState('14');
  const [weight, setWeight] = React.useState('500');

  const validFill = HEX_PATTERN.test(fill);

  const layoutField = (key: keyof typeof layout, label: string, max: number) => (
    <InspectorPanelRow label={label}>
      <InspectorField
        aria-label={label}
        inputMode="numeric"
        unit="px"
        value={layout[key]}
        onChange={(event) => {
          const next = clampNumber(event.target.value, 0, max);
          setLayout((current) => ({ ...current, [key]: next }));
        }}
      />
    </InspectorPanelRow>
  );

  return (
    <section data-slot="inspector-panel-block" className="flex w-full justify-center bg-background p-6 sm:p-10">
      <InspectorPanel className={ENTER}>
        <InspectorPanelHeader>
          <InspectorPanelTitle>Inspector</InspectorPanelTitle>
          <span dir="ltr" className="text-xs tabular-nums text-muted-foreground">
            {layout.width || 0} x {layout.height || 0}
          </span>
        </InspectorPanelHeader>

        <InspectorPanelSection title="Layout">
          {layoutField('width', 'Width', 4096)}
          {layoutField('height', 'Height', 4096)}
          {layoutField('radius', 'Radius', 999)}
        </InspectorPanelSection>

        <InspectorPanelSection title="Appearance">
          <InspectorPanelRow label="Fill">
            <InspectorField
              aria-label="Fill color"
              aria-invalid={!validFill}
              spellCheck={false}
              maxLength={7}
              value={fill}
              onChange={(event) => {
                const next = event.target.value.startsWith('#') ? event.target.value : `#${event.target.value}`;
                setFill(next.toUpperCase());
              }}
              leading={
                <label className="relative block size-4 cursor-pointer overflow-hidden rounded-sm border border-border">
                  <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{ backgroundColor: validFill ? fill : 'transparent' }}
                  />
                  <input
                    type="color"
                    aria-label="Pick fill color"
                    value={validFill ? fill.toLowerCase() : '#000000'}
                    onChange={(event) => setFill(event.target.value.toUpperCase())}
                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                  />
                </label>
              }
            />
          </InspectorPanelRow>
          <InspectorPanelRow label="Opacity">
            <InspectorField
              aria-label="Opacity"
              inputMode="numeric"
              unit="%"
              value={opacity}
              onChange={(event) => setOpacity(clampNumber(event.target.value, 0, 100))}
            />
          </InspectorPanelRow>
        </InspectorPanelSection>

        <InspectorPanelSection title="Typography" defaultOpen={false}>
          <InspectorPanelRow label="Size">
            <InspectorField
              aria-label="Font size"
              inputMode="numeric"
              unit="px"
              value={fontSize}
              onChange={(event) => setFontSize(clampNumber(event.target.value, 1, 400))}
            />
          </InspectorPanelRow>
          <InspectorPanelRow label="Weight">
            <NativeSelect
              aria-label="Font weight"
              size="sm"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              className="h-7 data-[size=sm]:h-7"
            >
              <NativeSelectOption value="400">Regular</NativeSelectOption>
              <NativeSelectOption value="500">Medium</NativeSelectOption>
              <NativeSelectOption value="600">Semibold</NativeSelectOption>
              <NativeSelectOption value="700">Bold</NativeSelectOption>
            </NativeSelect>
          </InspectorPanelRow>
        </InspectorPanelSection>
      </InspectorPanel>
    </section>
  );
};

export default InspectorPanelBlock;

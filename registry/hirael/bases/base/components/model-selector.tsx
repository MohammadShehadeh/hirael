'use client';

import * as React from 'react';
import { Brain, Check, ChevronsUpDown, Eye, Paperclip, Sparkles, Wrench } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/hirael/bases/base/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/hirael/bases/base/ui/popover';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

export type ModelCapability = 'vision' | 'tools' | 'reasoning' | 'files';

export interface ModelOption {
  /** Value passed to your API, like `claude-opus-5-5`. */
  id: string;
  name: string;
  /** Heading the model is grouped under. */
  provider: string;
  /** One short line, like "Best for long documents". */
  description?: string;
  capabilities?: ModelCapability[];
  /** Tokens of context, shown as 200K or 1M. */
  contextWindow?: number;
  /** Provider or model logo. */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ModelSelectorLabels {
  placeholder: string;
  search: string;
  empty: string;
  capabilities: Record<ModelCapability, string>;
}

const DEFAULT_LABELS: ModelSelectorLabels = {
  placeholder: 'Choose a model',
  search: 'Search models',
  empty: 'No model found',
  capabilities: {
    vision: 'Reads images',
    tools: 'Uses tools',
    reasoning: 'Reasons step by step',
    files: 'Reads files',
  },
};

const CAPABILITY_ICON: Record<ModelCapability, typeof Eye> = {
  vision: Eye,
  tools: Wrench,
  reasoning: Brain,
  files: Paperclip,
};

const formatTokens = (tokens: number) =>
  tokens >= 1_000_000 ? `${+(tokens / 1_000_000).toFixed(1)}M` : `${Math.round(tokens / 1000)}K`;

interface ModelSelectorContextValue {
  models: ModelOption[];
  value: string | undefined;
  select: (id: string) => void;
  labels: ModelSelectorLabels;
  disabled?: boolean;
}

const ModelSelectorContext = React.createContext<ModelSelectorContextValue | null>(null);

const useModelSelector = () => {
  const ctx = React.useContext(ModelSelectorContext);
  if (!ctx) {
    throw new Error('ModelSelector compound parts must be used inside <ModelSelector>');
  }

  return ctx;
};

export type ModelSelectorLabelOverrides = Partial<Omit<ModelSelectorLabels, 'capabilities'>> & {
  capabilities?: Partial<ModelSelectorLabels['capabilities']>;
};

export interface ModelSelectorProps {
  models: ModelOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string, model: ModelOption | undefined) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  labels?: ModelSelectorLabelOverrides;
  disabled?: boolean;
  children?: React.ReactNode;
}

const ModelSelector = ({
  models,
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  labels,
  disabled,
  children,
}: ModelSelectorProps) => {
  const [value, setValue] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: (id) =>
      id &&
      onValueChange?.(
        id,
        models.find((m) => m.id === id),
      ),
  });
  const [open, setOpen] = useControllableState({ prop: openProp, defaultProp: defaultOpen, onChange: onOpenChange });

  const ctx = React.useMemo<ModelSelectorContextValue>(
    () => ({
      models,
      value,
      select: (id) => {
        setValue(id);
        setOpen(false);
      },
      labels: {
        ...DEFAULT_LABELS,
        ...labels,
        capabilities: { ...DEFAULT_LABELS.capabilities, ...labels?.capabilities },
      },
      disabled,
    }),
    [models, value, setValue, setOpen, labels, disabled],
  );

  return (
    <ModelSelectorContext.Provider value={ctx}>
      <Popover open={open} onOpenChange={setOpen}>
        {children ?? (
          <>
            <ModelSelectorTrigger />
            <ModelSelectorContent />
          </>
        )}
      </Popover>
    </ModelSelectorContext.Provider>
  );
};

const ModelSelectorTrigger = ({
  variant = 'ghost',
  size = 'sm',
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'children'>) => {
  const { models, value, labels, disabled } = useModelSelector();
  const model = models.find((m) => m.id === value);

  return (
    <PopoverTrigger
      render={
        <Button
          type="button"
          variant={variant}
          size={size}
          role="combobox"
          disabled={disabled}
          data-slot="model-selector-trigger"
          className={cn('max-w-full justify-between font-normal', className)}
          {...props}
        />
      }
    >
      <span aria-hidden className="flex shrink-0 [&_svg]:size-4">
        {model?.icon ?? <Sparkles />}
      </span>
      <span className={cn('truncate', !model && 'text-muted-foreground')}>{model?.name ?? labels.placeholder}</span>
      <ChevronsUpDown aria-hidden className="text-muted-foreground" />
    </PopoverTrigger>
  );
};

const ModelSelectorContent = ({
  align = 'start',
  className,
  ...props
}: Omit<React.ComponentProps<typeof PopoverContent>, 'children'>) => {
  const { models, value, select, labels } = useModelSelector();
  const providers = [...new Set(models.map((m) => m.provider))];

  return (
    <PopoverContent align={align} data-slot="model-selector-content" className={cn('w-80 p-0', className)} {...props}>
      <Command>
        <CommandInput placeholder={labels.search} />
        <CommandList className="max-h-80">
          <CommandEmpty>{labels.empty}</CommandEmpty>
          {providers.map((provider) => (
            <CommandGroup key={provider} heading={provider}>
              {models
                .filter((m) => m.provider === provider)
                .map((model) => (
                  <CommandItem
                    key={model.id}
                    value={`${model.name} ${model.id} ${provider}`}
                    disabled={model.disabled}
                    onSelect={() => select(model.id)}
                    data-slot="model-selector-item"
                    className="items-start gap-2.5 py-2"
                  >
                    <span aria-hidden className="mt-0.5 flex shrink-0 text-muted-foreground [&_svg]:size-4">
                      {model.icon ?? <Sparkles />}
                    </span>
                    <span className="grid min-w-0 flex-1 gap-0.5">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-medium">{model.name}</span>
                        {model.contextWindow !== undefined && (
                          <span className="ms-auto shrink-0 text-xs text-muted-foreground tabular-nums">
                            {formatTokens(model.contextWindow)}
                          </span>
                        )}
                      </span>
                      {model.description && (
                        <span className="truncate text-xs text-muted-foreground">{model.description}</span>
                      )}
                      {model.capabilities && model.capabilities.length > 0 && (
                        <span className="flex gap-1.5 pt-0.5">
                          {model.capabilities.map((capability) => {
                            const Icon = CAPABILITY_ICON[capability];

                            return (
                              <span
                                key={capability}
                                title={labels.capabilities[capability]}
                                className="inline-flex size-5 items-center justify-center rounded-sm bg-muted text-muted-foreground [&_svg]:size-3"
                              >
                                <Icon aria-hidden />
                                <span className="sr-only">{labels.capabilities[capability]}</span>
                              </span>
                            );
                          })}
                        </span>
                      )}
                    </span>
                    <Check
                      aria-hidden
                      className={cn('mt-0.5 size-4 shrink-0', value === model.id ? 'opacity-100' : 'opacity-0')}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </PopoverContent>
  );
};

export { ModelSelector, ModelSelectorTrigger, ModelSelectorContent, useModelSelector };

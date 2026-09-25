'use client';

import * as React from 'react';
import { Questionnaire as QuestionnairePrimitive } from '@shadcn/react/questionnaire';
import { RotateCcw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Kbd } from '@/registry/hirael/bases/radix/components/kbd';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@/registry/hirael/bases/radix/ui/questionnaire';

type NpsBand = 'detractor' | 'passive' | 'promoter';

const getNpsBand = (score: number): NpsBand => {
  if (score <= 6) return 'detractor';
  if (score <= 8) return 'passive';

  return 'promoter';
};

interface NpsScaleProps extends Omit<React.ComponentProps<typeof QuestionnairePrimitive.Choices>, 'onChange'> {
  /** Selected score, or `null` while nothing is picked. Leave undefined to let the Questionnaire track it. */
  value?: number | null;
  /** Called with the score the user picks. */
  onValueChange?: (value: number) => void;
  /** Highest score on the scale. The lowest is always 0. */
  max?: number;
}

const NpsScale = ({ value, onValueChange, max = 10, className, style, children, ...props }: NpsScaleProps) => {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="nps-scale"
      className={cn('grid gap-1 sm:gap-1.5', className)}
      style={{ gridTemplateColumns: `repeat(${max + 1}, minmax(0, 1fr))`, ...style }}
      {...props}
    >
      {children ??
        Array.from({ length: max + 1 }, (_, score) => (
          <NpsScaleChoice
            key={score}
            value={score}
            checked={value === undefined ? undefined : value === score}
            onChange={() => onValueChange?.(score)}
          />
        ))}
    </QuestionnairePrimitive.Choices>
  );
};

interface NpsScaleChoiceProps extends Omit<React.ComponentProps<typeof QuestionnairePrimitive.Choice>, 'value'> {
  /** The score this choice selects. */
  value: number;
}

const NpsScaleChoice = ({ value, className, children, ...props }: NpsScaleChoiceProps) => {
  return (
    <QuestionnairePrimitive.Choice
      data-slot="nps-scale-item"
      value={String(value)}
      className={cn(
        'relative inline-flex h-10 min-w-0 cursor-pointer items-center justify-center rounded-md border border-input bg-background text-sm font-medium tabular-nums shadow-xs transition-[color,background-color,border-color,box-shadow] duration-150 ease-out outline-none select-none hover:not-data-checked:bg-accent hover:not-data-checked:text-accent-foreground has-[>input:focus-visible]:border-ring has-[>input:focus-visible]:ring-[3px] has-[>input:focus-visible]:ring-ring/50 data-invalid:border-destructive dark:bg-input/30 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="nps-scale-item-input"
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
      />
      <QuestionnairePrimitive.ChoiceLabel data-slot="nps-scale-item-label">
        {children ?? value}
      </QuestionnairePrimitive.ChoiceLabel>
    </QuestionnairePrimitive.Choice>
  );
};

type NpsScaleLabelsProps = React.ComponentProps<'div'>;

const NpsScaleLabels = ({ className, ...props }: NpsScaleLabelsProps) => {
  return (
    <div
      data-slot="nps-scale-labels"
      className={cn('flex items-center justify-between gap-4 text-xs text-muted-foreground', className)}
      {...props}
    />
  );
};

export { NpsScale, NpsScaleChoice, NpsScaleLabels, getNpsBand, type NpsBand };

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in slide-in-from-bottom-2 duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;

const PRODUCT = 'Hirael';

const SCORES = Array.from({ length: 11 }, (_, score) => ({ value: String(score) }));

const ITEMS = [
  { name: 'score', required: true, choices: SCORES },
  { name: 'comment', required: true },
] as const;

const FOLLOW_UP: Record<NpsBand, { question: string; placeholder: string; thanks: string }> = {
  detractor: {
    question: 'What was missing or disappointing?',
    placeholder: 'Search was slow and we missed a Salesforce sync',
    thanks: 'Sorry it fell short. Someone from the product team may reach out to learn more.',
  },
  passive: {
    question: 'What would make it a 10?',
    placeholder: 'Rules that assign threads by customer tier',
    thanks: 'That tells us what to build next. We plan every cycle with answers like yours.',
  },
  promoter: {
    question: 'What do you value most?',
    placeholder: 'Saved replies. We answer most tickets in a minute',
    thanks: 'Glad it is working for your team. We will keep doing more of that.',
  },
};

const Survey01 = () => {
  const [item, setItem] = React.useState('score');
  const [score, setScore] = React.useState<number | null>(null);
  const [comment, setComment] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const band = getNpsBand(score ?? 0);

  // The built-in `shortcuts="numbers"` maps keys 1 to 9 onto choices in order, which can't reach 0 or line up with the scores.
  const handleShortcut = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (item !== 'score' || event.metaKey || event.ctrlKey || event.altKey || !/^[0-9]$/.test(event.key)) return;
    if ((event.target as HTMLElement).closest('input:not([type=radio]), textarea, select, [contenteditable="true"]')) {
      return;
    }
    const input = event.currentTarget.querySelector<HTMLInputElement>(
      `[data-slot="nps-scale-item-input"][value="${event.key}"]`,
    );
    if (!input) return;
    event.preventDefault();
    input.focus();
    input.click();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setComment(String(new FormData(event.currentTarget).get('comment') ?? '').trim());
    setSubmitted(true);
  };

  const changeAnswer = () => {
    setItem('score');
    setSubmitted(false);
  };

  return (
    <section data-slot="nps-survey" aria-labelledby="survey-01-heading" className="bg-background py-16 sm:py-24">
      <div className="mx-auto w-full max-w-xl px-6">
        <div
          data-slot="nps-survey-card"
          className={cn(ENTER, 'rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xs sm:p-8')}
        >
          {submitted && score !== null ? (
            <div data-slot="nps-survey-thanks" role="status" className={cn(SWAP, 'flex flex-col gap-6')}>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground uppercase">Response saved</span>
                <h2 id="survey-01-heading" className="text-xl font-semibold tracking-tight">
                  Thanks for the feedback
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{FOLLOW_UP[band].thanks}</p>
              </div>

              <dl className="flex flex-col gap-4 border-t border-border pt-5">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-muted-foreground">Your score</dt>
                  <dd className="flex items-baseline gap-1">
                    <span className="text-3xl font-semibold tabular-nums">{score}</span>
                    <span className="text-sm text-muted-foreground">out of 10</span>
                  </dd>
                </div>
                <div className="flex flex-col gap-1.5">
                  <dt className="text-sm text-muted-foreground">{FOLLOW_UP[band].question}</dt>
                  <dd className="border-s-2 border-border ps-3 text-sm leading-relaxed">{comment}</dd>
                </div>
              </dl>

              <Button type="button" variant="outline" className="w-fit" onClick={changeAnswer}>
                <RotateCcw aria-hidden />
                Change answer
              </Button>
            </div>
          ) : (
            <Questionnaire
              items={ITEMS}
              item={item}
              onItemChange={setItem}
              onKeyDown={handleShortcut}
              onSubmit={handleSubmit}
            >
              <QuestionnaireProgress />

              <QuestionnaireItem name="score" required className={SWAP}>
                <QuestionnaireTitle id="survey-01-heading">
                  How likely are you to recommend {PRODUCT} to a friend or colleague?
                </QuestionnaireTitle>
                <QuestionnaireDescription>
                  One score and one sentence. Your answer goes straight to the product team.
                </QuestionnaireDescription>
                <div className="flex flex-col gap-2">
                  <NpsScale value={score} onValueChange={setScore} />
                  <NpsScaleLabels aria-hidden>
                    <span>Not likely</span>
                    <span>Very likely</span>
                  </NpsScaleLabels>
                </div>
                <QuestionnaireError>Pick a score from 0 to 10.</QuestionnaireError>
                <p
                  data-slot="nps-survey-hint"
                  className="hidden flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:flex"
                >
                  Press
                  <Kbd>0</Kbd>
                  to
                  <Kbd>9</Kbd>
                  to pick a score, then
                  <Kbd>Enter</Kbd>
                  to continue.
                </p>
              </QuestionnaireItem>

              <QuestionnaireItem name="comment" required className={SWAP}>
                <QuestionnaireTitle>{FOLLOW_UP[band].question}</QuestionnaireTitle>
                <QuestionnaireDescription>
                  You picked <span className="font-medium text-foreground tabular-nums">{score}</span>. A sentence or
                  two is plenty.
                </QuestionnaireDescription>
                <QuestionnaireInput
                  aria-label={FOLLOW_UP[band].question}
                  placeholder={FOLLOW_UP[band].placeholder}
                  defaultValue={comment}
                />
                <QuestionnaireError>Add a short answer so we know what to change.</QuestionnaireError>
              </QuestionnaireItem>

              <QuestionnaireActions>
                <QuestionnairePrevious>Back</QuestionnairePrevious>
                <QuestionnaireNext>Next</QuestionnaireNext>
                <QuestionnaireSubmit>Send feedback</QuestionnaireSubmit>
              </QuestionnaireActions>
            </Questionnaire>
          )}
        </div>
      </div>
    </section>
  );
};

export default Survey01;

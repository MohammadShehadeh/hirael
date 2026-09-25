'use client';

import * as React from 'react';
import { Check, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Kbd } from '@/registry/hirael/bases/base/components/kbd';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@/registry/hirael/bases/base/ui/questionnaire';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const STEP_IN = `animate-in fade-in duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;
const ITEM_IN = `data-active:animate-in data-active:fade-in-0 data-active:duration-300 ${EASE} motion-reduce:data-active:animate-none`;

type QuestionId = 'name' | 'use' | 'team' | 'seats' | 'start';
type Answers = Record<QuestionId, string>;

interface Option {
  value: string;
  label: string;
}

interface ChoiceQuestion {
  id: Exclude<QuestionId, 'name'>;
  /** Short label for the summary on the last screen. */
  summary: string;
  title: string;
  description?: string;
  options: readonly Option[];
}

const USE: ChoiceQuestion = {
  id: 'use',
  summary: 'Using Relay for',
  title: 'What will you use Relay for?',
  options: [
    { value: 'support', label: 'Customer support' },
    { value: 'sales', label: 'Sales conversations' },
    { value: 'internal', label: 'Internal requests like IT or HR' },
    { value: 'other', label: 'Something else' },
  ],
};

const TEAM: ChoiceQuestion = {
  id: 'team',
  summary: 'Who uses it',
  title: 'Who will be working in Relay?',
  options: [
    { value: 'solo', label: 'Just me' },
    { value: 'team', label: 'My team' },
    { value: 'teams', label: 'Several teams' },
  ],
};

const SEATS: ChoiceQuestion = {
  id: 'seats',
  summary: 'Seats',
  title: 'How many seats do you need?',
  description: 'You can add or remove seats at any time.',
  options: [
    { value: '2-5', label: '2 to 5' },
    { value: '6-20', label: '6 to 20' },
    { value: '21-50', label: '21 to 50' },
    { value: '50+', label: 'More than 50' },
  ],
};

const START: ChoiceQuestion = {
  id: 'start',
  summary: 'Starting',
  title: 'When do you want to start?',
  options: [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This week' },
    { value: 'month', label: 'This month' },
    { value: 'exploring', label: 'Just looking around' },
  ],
};

const CHOICE_QUESTIONS = [USE, TEAM, SEATS, START] as const;
const ORDER: readonly QuestionId[] = ['name', 'use', 'team', 'seats', 'start'];

const toChoices = (question: ChoiceQuestion) => question.options.map((option) => ({ value: option.value }));

const ProgressTrack = ({ value, className }: { value: number; className?: string }) => (
  <span data-slot="question-flow-track" aria-hidden className={cn('block h-1 bg-muted', className)}>
    <span
      className="block h-full origin-left bg-primary transition-transform duration-300 ease-out motion-reduce:transition-none rtl:origin-right"
      style={{ transform: `scaleX(${value})` }}
    />
  </span>
);

// The styled title is sized for cards; a full-screen flow needs display type, so it goes on an inner span.
const ItemHeading = ({ title, description }: { title: string; description?: string }) => (
  <>
    <QuestionnaireTitle>
      <span className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</span>
    </QuestionnaireTitle>
    {description ? (
      <QuestionnaireDescription>
        <span className="text-base sm:text-lg">{description}</span>
      </QuestionnaireDescription>
    ) : null}
  </>
);

const Survey04 = () => {
  const [round, setRound] = React.useState(0);
  const [item, setItem] = React.useState<string>('name');
  const [direction, setDirection] = React.useState<'forward' | 'back'>('forward');
  const [name, setName] = React.useState('');
  const [team, setTeam] = React.useState('');
  const [answers, setAnswers] = React.useState<Answers | null>(null);

  const solo = team === 'solo';

  // Working alone makes the seat count meaningless, so that item drops out of the path.
  const items = React.useMemo(
    () => [
      { name: 'name', required: true },
      { name: 'use', required: true, choices: toChoices(USE) },
      { name: 'team', required: true, choices: toChoices(TEAM) },
      { name: 'seats', required: true, disabled: solo, choices: toChoices(SEATS) },
      { name: 'start', required: true, choices: toChoices(START) },
    ],
    [solo],
  );

  const changeItem = (next: string) => {
    setDirection(ORDER.indexOf(next as QuestionId) < ORDER.indexOf(item as QuestionId) ? 'back' : 'forward');
    setItem(next);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setAnswers(Object.fromEntries(ORDER.map((id) => [id, String(data.get(id) ?? '')])) as Answers);
  };

  const restart = () => {
    setRound((current) => current + 1);
    setItem('name');
    setDirection('forward');
    setName('');
    setTeam('');
    setAnswers(null);
  };

  const itemClass = cn(
    ITEM_IN,
    direction === 'forward' ? 'data-active:slide-in-from-bottom-6' : 'data-active:slide-in-from-top-6',
  );

  const renderChoices = (question: ChoiceQuestion) => (
    <QuestionnaireChoices className="sm:max-w-md">
      {question.options.map((option) => (
        <QuestionnaireChoice
          key={option.value}
          value={option.value}
          checked={question.id === 'team' ? team === option.value : undefined}
          onChange={question.id === 'team' ? () => setTeam(option.value) : undefined}
        >
          {option.label}
        </QuestionnaireChoice>
      ))}
    </QuestionnaireChoices>
  );

  const summary = answers
    ? [
        { id: 'name', summary: 'Name', value: answers.name.trim() },
        ...CHOICE_QUESTIONS.filter((question) => answers[question.id]).map((question) => ({
          id: question.id,
          summary: question.summary,
          value: question.options.find((option) => option.value === answers[question.id])?.label ?? '',
        })),
      ]
    : [];

  return (
    <section
      data-slot="question-flow"
      aria-labelledby="survey-04-heading"
      className="relative isolate flex min-h-[40rem] flex-col overflow-hidden bg-background"
    >
      <h2 id="survey-04-heading" className="sr-only">
        Set up Relay
      </h2>

      {answers ? (
        <>
          <ProgressTrack value={1} className="absolute inset-x-0 top-0" />
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 pt-20 pb-28">
            <div
              ref={(node) => node?.focus({ preventScroll: true })}
              tabIndex={-1}
              data-slot="question-flow-done"
              className={cn(STEP_IN, 'flex flex-col gap-8 outline-none slide-in-from-bottom-6')}
            >
              <div className="flex flex-col gap-3">
                <span className="text-xs text-muted-foreground uppercase">All set</span>
                <h3 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
                  Thanks, {answers.name.trim()}.
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  We will use your answers to set up sensible defaults for your workspace.
                </p>
              </div>
              <dl
                data-slot="question-flow-summary"
                className="flex flex-col divide-y divide-border border-y border-border"
              >
                {summary.map((row) => (
                  <div key={row.id} className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="text-sm text-muted-foreground">{row.summary}</dt>
                    <dd className="text-end text-sm font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <Button type="button" variant="outline" className="w-fit" onClick={restart}>
                <RotateCcw aria-hidden />
                Start over
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Questionnaire
          key={round}
          className="flex-1"
          item={item}
          items={items}
          shortcuts="letters"
          onItemChange={changeItem}
          onSubmit={handleSubmit}
        >
          <QuestionnaireProgress
            className="absolute inset-x-0 top-0 w-full"
            render={(props, state) => (
              <div {...props}>
                <ProgressTrack value={(state.current - 1) / (state.total || 1)} />
                <span className="absolute start-6 top-5">
                  Question {state.current} of {state.total}
                </span>
              </div>
            )}
          />

          <div
            data-slot="question-flow-step"
            className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 px-6 pt-20 pb-28"
          >
            <QuestionnaireItem name="name" required className={itemClass}>
              <ItemHeading title="First, what should we call you?" />
              <QuestionnaireInput
                aria-label="First name"
                autoComplete="given-name"
                maxLength={40}
                placeholder="Type your first name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <QuestionnaireError>Type your name to continue.</QuestionnaireError>
            </QuestionnaireItem>

            {CHOICE_QUESTIONS.map((question) => (
              <QuestionnaireItem
                key={question.id}
                name={question.id}
                required
                disabled={question.id === 'seats' && solo}
                className={itemClass}
              >
                <ItemHeading
                  title={question.id === 'use' ? `Nice to meet you, ${name.trim()}. ${question.title}` : question.title}
                  description={question.description}
                />
                {renderChoices(question)}
                <QuestionnaireError>Pick an answer to continue.</QuestionnaireError>
              </QuestionnaireItem>
            ))}

            <div data-slot="question-flow-actions" className="flex items-center gap-3">
              <QuestionnaireNext size="lg">
                OK
                <Check aria-hidden />
              </QuestionnaireNext>
              <QuestionnaireSubmit size="lg">
                Finish
                <Check aria-hidden />
              </QuestionnaireSubmit>
              <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
                press <Kbd>Enter</Kbd>
              </span>
            </div>
          </div>

          <div data-slot="question-flow-nav" className="absolute end-6 bottom-6 flex items-center gap-1">
            <QuestionnairePrevious size="icon" aria-label="Previous question">
              <ChevronUp aria-hidden />
            </QuestionnairePrevious>
            <QuestionnaireNext size="icon" variant="outline" aria-label="Next question">
              <ChevronDown aria-hidden />
            </QuestionnaireNext>
            <QuestionnaireSubmit size="icon" variant="outline" aria-label="Finish survey">
              <ChevronDown aria-hidden />
            </QuestionnaireSubmit>
          </div>
        </Questionnaire>
      )}
    </section>
  );
};

export default Survey04;

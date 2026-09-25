'use client';

import * as React from 'react';
import { ChevronLeft, RotateCcw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/base/ui/button';
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@/registry/hirael/bases/base/ui/questionnaire';

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const ENTER = `animate-in fade-in slide-in-from-bottom-4 duration-500 ${EASE} fill-mode-both motion-reduce:animate-none`;
const SWAP = `animate-in fade-in duration-300 ${EASE} fill-mode-both motion-reduce:animate-none`;
const ITEM_IN = `data-active:animate-in data-active:fade-in-0 data-active:slide-in-from-bottom-2 data-active:duration-300 ${EASE} motion-reduce:data-active:animate-none`;

type QuestionId = 'source' | 'features' | 'setup' | 'notes';

interface Answers {
  source: string;
  features: string[];
  setup: string;
  notes: string;
}

const QUESTIONS: readonly { name: QuestionId; title: string; required: boolean }[] = [
  { name: 'source', title: 'How did you first hear about Relay?', required: true },
  { name: 'features', title: 'Which features does your team use most?', required: true },
  { name: 'setup', title: 'How easy was it to set up your workspace?', required: true },
  { name: 'notes', title: 'Anything else we should know?', required: false },
];

const LAST_QUESTION = QUESTIONS[QUESTIONS.length - 1].name;

const SOURCES = [
  { value: 'colleague', label: 'A colleague recommended it' },
  { value: 'search', label: 'A search engine' },
  { value: 'review-site', label: 'A review site like G2' },
  { value: 'newsletter', label: 'A newsletter or blog post' },
  { value: 'other', label: 'Somewhere else' },
] as const;

const FEATURES = [
  { value: 'shared-inbox', label: 'Shared inbox' },
  { value: 'saved-replies', label: 'Saved replies' },
  { value: 'assignment', label: 'Assignment rules' },
  { value: 'comments', label: 'Inline comments' },
  { value: 'reports', label: 'Reports' },
  { value: 'integrations', label: 'Integrations' },
] as const;

const MAX_FEATURES = 3;

const SETUP_LABELS = ['Very hard', 'Hard', 'Okay', 'Easy', 'Very easy'] as const;

const EMPTY_ANSWERS: Answers = { source: '', features: [], setup: '', notes: '' };

const formatAnswer = (name: QuestionId, answers: Answers): string | null => {
  switch (name) {
    case 'source':
      return SOURCES.find((option) => option.value === answers.source)?.label ?? null;
    case 'features':
      return answers.features.length
        ? FEATURES.filter((option) => answers.features.includes(option.value))
            .map((option) => option.label)
            .join(', ')
        : null;
    case 'setup':
      return answers.setup ? `${answers.setup} of 5, ${SETUP_LABELS[Number(answers.setup) - 1]}` : null;
    case 'notes':
      return answers.notes.trim() || null;
  }
};

// Progress fills by translating left, which starts from the wrong edge in RTL; this track scales from the start edge.
const ProgressTrack = ({ value }: { value: number }) => (
  <span
    data-slot="feedback-survey-track"
    aria-hidden
    className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted"
  >
    <span
      className="block h-full origin-left rounded-full bg-primary transition-transform duration-300 ease-out motion-reduce:transition-none rtl:origin-right"
      style={{ transform: `scaleX(${value})` }}
    />
  </span>
);

const Survey02 = () => {
  const [round, setRound] = React.useState(0);
  const [item, setItem] = React.useState<string>(QUESTIONS[0].name);
  const [features, setFeatures] = React.useState<string[]>([]);
  const [answers, setAnswers] = React.useState<Answers>(EMPTY_ANSWERS);
  const [reviewing, setReviewing] = React.useState(false);
  const [returnToReview, setReturnToReview] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const atFeatureLimit = features.length >= MAX_FEATURES;

  const toggleFeature = (value: string, checked: boolean) =>
    setFeatures((current) =>
      checked ? [...current, value].slice(0, MAX_FEATURES) : current.filter((feature) => feature !== value),
    );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setAnswers({
      source: String(data.get('source') ?? ''),
      features,
      setup: String(data.get('setup') ?? ''),
      notes: String(data.get('notes') ?? ''),
    });
    setReturnToReview(false);
    setReviewing(true);
  };

  const edit = (name: QuestionId) => {
    setReturnToReview(true);
    setReviewing(false);
    setItem(name);
  };

  const backToQuestions = () => {
    setReviewing(false);
    setItem(LAST_QUESTION);
  };

  // Submitting re-validates every item and lands back on the review step.
  const saveAndReview = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!returnToReview) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  const restart = () => {
    setRound((current) => current + 1);
    setItem(QUESTIONS[0].name);
    setFeatures([]);
    setAnswers(EMPTY_ANSWERS);
    setReviewing(false);
    setReturnToReview(false);
    setSubmitted(false);
  };

  return (
    <section data-slot="feedback-survey" aria-labelledby="survey-02-heading" className="bg-background py-16 sm:py-24">
      <div className="mx-auto w-full max-w-xl px-6">
        <div
          data-slot="feedback-survey-card"
          className={cn(
            ENTER,
            'overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xs',
          )}
        >
          {submitted ? (
            <div data-slot="feedback-survey-done" role="status" className={cn(SWAP, 'flex flex-col gap-6 p-6 sm:p-8')}>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground uppercase">Response sent</span>
                <h2 id="survey-02-heading" className="text-xl font-semibold tracking-tight">
                  Thanks, your feedback is in
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  We read every response. If we ship something you asked for, we will let you know by email.
                </p>
              </div>
              <Button type="button" variant="outline" className="w-fit" onClick={restart}>
                <RotateCcw aria-hidden />
                Start over
              </Button>
            </div>
          ) : (
            <Questionnaire key={round} item={item} items={QUESTIONS} onItemChange={setItem} onSubmit={handleSubmit}>
              {/* One child, so the root's gap never splits the card's hairline sections. */}
              <div data-slot="feedback-survey-body" className="flex flex-col">
                <div
                  data-slot="feedback-survey-header"
                  className="flex items-center gap-4 border-b border-border px-6 py-4"
                >
                  <h2 id="survey-02-heading" className="shrink-0 text-sm font-medium">
                    Relay feedback
                  </h2>
                  <QuestionnaireProgress
                    className="flex-1"
                    render={(props, state) => (
                      <div {...props}>
                        <span className="flex items-center gap-4">
                          <ProgressTrack value={reviewing ? 1 : state.current / (state.total || 1)} />
                          <span className="shrink-0">
                            {reviewing ? 'Review' : `Question ${state.current} of ${state.total}`}
                          </span>
                        </span>
                      </div>
                    )}
                  />
                </div>

                <div data-slot="feedback-survey-step" hidden={reviewing} className="min-h-80 px-6 py-6">
                  <QuestionnaireItem name="source" required className={ITEM_IN}>
                    <QuestionnaireTitle>{QUESTIONS[0].title}</QuestionnaireTitle>
                    <QuestionnaireDescription>Pick one.</QuestionnaireDescription>
                    <QuestionnaireChoices>
                      {SOURCES.map((option) => (
                        <QuestionnaireChoice key={option.value} value={option.value}>
                          {option.label}
                        </QuestionnaireChoice>
                      ))}
                    </QuestionnaireChoices>
                    <QuestionnaireError>Pick one option to continue.</QuestionnaireError>
                  </QuestionnaireItem>

                  <QuestionnaireItem name="features" multiple required className={ITEM_IN}>
                    <QuestionnaireTitle>{QUESTIONS[1].title}</QuestionnaireTitle>
                    <QuestionnaireDescription aria-live="polite">
                      Pick up to {MAX_FEATURES}.{' '}
                      <span className="tabular-nums">
                        {features.length} of {MAX_FEATURES} picked.
                      </span>
                    </QuestionnaireDescription>
                    <QuestionnaireChoices className="sm:grid-cols-2">
                      {FEATURES.map((option) => {
                        const checked = features.includes(option.value);

                        return (
                          <QuestionnaireChoice
                            key={option.value}
                            value={option.value}
                            checked={checked}
                            disabled={!checked && atFeatureLimit}
                            onChange={(event) => toggleFeature(option.value, event.target.checked)}
                          >
                            {option.label}
                          </QuestionnaireChoice>
                        );
                      })}
                    </QuestionnaireChoices>
                    <QuestionnaireError>Pick at least one feature.</QuestionnaireError>
                  </QuestionnaireItem>

                  <QuestionnaireItem name="setup" required className={ITEM_IN}>
                    <QuestionnaireTitle>{QUESTIONS[2].title}</QuestionnaireTitle>
                    <QuestionnaireDescription>From 1, very hard, to 5, very easy.</QuestionnaireDescription>
                    <QuestionnaireChoices>
                      {SETUP_LABELS.map((label, index) => (
                        <QuestionnaireChoice key={label} value={String(index + 1)}>
                          <span className="flex items-baseline gap-2">
                            <span className="font-medium tabular-nums">{index + 1}</span>{' '}
                            <QuestionnaireChoiceDescription>{label}</QuestionnaireChoiceDescription>
                          </span>
                        </QuestionnaireChoice>
                      ))}
                    </QuestionnaireChoices>
                    <QuestionnaireError>Pick a rating from 1 to 5.</QuestionnaireError>
                  </QuestionnaireItem>

                  <QuestionnaireItem name="notes" className={ITEM_IN}>
                    <QuestionnaireTitle>{QUESTIONS[3].title}</QuestionnaireTitle>
                    <QuestionnaireDescription>
                      Optional. A bug, an idea, or something that got in your way.
                    </QuestionnaireDescription>
                    <QuestionnaireInput
                      aria-label="Your comment"
                      maxLength={600}
                      placeholder="The Zendesk import skipped our closed tickets."
                    />
                    <QuestionnaireError>Write a comment or skip this question.</QuestionnaireError>
                  </QuestionnaireItem>
                </div>

                {reviewing ? (
                  <div
                    data-slot="feedback-survey-review"
                    className={cn(SWAP, 'flex min-h-80 flex-col gap-4 px-6 py-6')}
                  >
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-medium">Check your answers</h3>
                      <p className="text-sm text-muted-foreground">Nothing is sent until you submit.</p>
                    </div>
                    <dl className="flex flex-col divide-y divide-border border-y border-border">
                      {QUESTIONS.map((question, index) => {
                        const answer = formatAnswer(question.name, answers);

                        return (
                          <div
                            key={question.name}
                            data-slot="feedback-survey-review-item"
                            className="flex items-start justify-between gap-4 py-3"
                          >
                            <div className="flex min-w-0 flex-col gap-1">
                              <dt className="text-sm text-muted-foreground">{question.title}</dt>
                              <dd className={cn('text-sm', answer ? 'font-medium' : 'text-muted-foreground')}>
                                {answer ?? 'Skipped'}
                              </dd>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              aria-label={`Edit answer to question ${index + 1}`}
                              onClick={() => edit(question.name)}
                            >
                              Edit
                            </Button>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                ) : null}

                <div data-slot="feedback-survey-footer" className="border-t border-border px-6 py-4">
                  {reviewing ? (
                    <div className="flex items-center justify-between gap-3">
                      <Button type="button" variant="ghost" onClick={backToQuestions}>
                        <ChevronLeft aria-hidden className="rtl:rotate-180" />
                        Back
                      </Button>
                      <Button type="button" onClick={() => setSubmitted(true)}>
                        Submit
                      </Button>
                    </div>
                  ) : (
                    <QuestionnaireActions>
                      <QuestionnairePrevious />
                      <QuestionnaireSkip />
                      <QuestionnaireNext onClick={saveAndReview}>
                        {returnToReview ? 'Save and review' : 'Next'}
                      </QuestionnaireNext>
                      <QuestionnaireSubmit>{returnToReview ? 'Save and review' : 'Review'}</QuestionnaireSubmit>
                    </QuestionnaireActions>
                  )}
                </div>
              </div>
            </Questionnaire>
          )}
        </div>
      </div>
    </section>
  );
};

export default Survey02;

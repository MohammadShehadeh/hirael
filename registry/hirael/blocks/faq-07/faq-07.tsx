"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/hirael/ui/accordion";

const QUESTIONS = [
  {
    value: "config",
    question: "Do I have to give up my existing configuration?",
    answer:
      "No. The importer reads the workflow files already in your repo and renders them as a graph. Edits flow both ways, and the files stay in git.",
  },
  {
    value: "free",
    question: "What does the free plan actually include?",
    answer:
      "The full editor, two concurrent runs and 500 run minutes a month. It is not a trial; small projects can stay on it forever.",
  },
  {
    value: "runners",
    question: "Where do the runs execute?",
    answer:
      "On managed runners by default. Self-hosted runners are in progress for workloads that need to stay inside your network.",
  },
  {
    value: "secrets",
    question: "How are secrets handled?",
    answer:
      "Secrets are scoped to environments and encrypted at rest. A step only receives the secrets of the environment it deploys to, and values never appear in logs.",
  },
  {
    value: "migrate",
    question: "Can I leave without rewriting anything?",
    answer:
      "Yes. Because the graph is stored as standard workflow files in your repo, turning the editor off leaves you with configuration any runner understands.",
  },
];

const Faq07 = () => {
  return (
    <section
      data-slot="faq"
      className="grid min-h-112 grid-cols-1 border-x border-border bg-background md:min-h-144 md:grid-cols-2"
    >
      <div
        data-slot="faq-intro"
        className="flex flex-col gap-4 px-6 pb-6 pt-12 md:border-e md:border-border"
      >
        <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
          Questions, answered
        </h2>
        <p className="max-w-md text-sm text-muted-foreground md:text-base">
          The short version of what teams ask before moving their pipelines
          over.
        </p>
      </div>
      <div className="place-content-center">
        <Accordion
          type="single"
          collapsible
          className="rounded-none border-y border-border"
        >
          {QUESTIONS.map((q) => (
            <AccordionItem key={q.value} value={q.value} className="px-6">
              <AccordionTrigger className="py-4">{q.question}</AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {q.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq07;

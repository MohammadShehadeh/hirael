"use client";

import * as React from "react";
import { Mail, Phone } from "lucide-react";
import {
  type HTMLMotionProps,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";

const CONTACT = {
  email: "hello@hirael.com",
  phone: "+971 50 000 0000",
};

const HEADLINE = "Tell us what you are building";

const EASE = "easeOut" as const;

/** Digits only, ready for a wa.me link. */
const digits = (phone: string) => phone.replace(/\D/g, "");

/* -------------------------------------------------------------------------- */
/*  Parts                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Rounded panel whose bottom glow grows as the section scrolls through the
 * viewport. Wrap the section content in it.
 */
const ContactPanel = ({
  className,
  style,
  children,
  ...props
}: HTMLMotionProps<"div">) => {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const width = useTransform(scrollYProgress, [0, 1], [100, 160]);
  const height = useTransform(scrollYProgress, [0, 1], [100, 180]);
  const background = useMotionTemplate`radial-gradient(${width}% ${height}% at 50% 0%, transparent 0%, transparent 55%, color-mix(in oklch, var(--primary) 18%, transparent) 82%, color-mix(in oklch, var(--primary) 40%, transparent) 100%)`;

  return (
    <div ref={ref} data-slot="contact-panel-outer">
      <motion.div
        data-slot="contact-panel"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          background: reduce
            ? "radial-gradient(130% 140% at 50% 0%, transparent 0%, transparent 55%, color-mix(in oklch, var(--primary) 18%, transparent) 82%, color-mix(in oklch, var(--primary) 40%, transparent) 100%)"
            : background,
          ...style,
        }}
        className={cn(
          "relative overflow-hidden rounded-3xl border border-border bg-card pt-16 pb-24 md:pt-20 md:pb-32",
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
};

const ContactBadge = ({
  className,
  ...props
}: React.ComponentProps<typeof Badge>) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
    >
      <Badge
        data-slot="contact-badge"
        variant="outline"
        className={cn(
          "rounded-full bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm",
          className,
        )}
        {...props}
      />
    </motion.div>
  );
};

interface ContactTitleProps extends Omit<
  React.ComponentProps<"h2">,
  "children"
> {
  children: string;
}

const ContactTitle = ({ children, className, ...props }: ContactTitleProps) => {
  const reduce = useReducedMotion();
  const words = children.split(" ");
  const half = Math.floor(words.length / 2);

  return (
    <h2
      data-slot="contact-title"
      className={cn(
        "mx-auto max-w-3xl text-balance font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl",
        className,
      )}
      {...props}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={cn(
            "inline-block",
            i < half ? "text-muted-foreground" : "text-foreground",
          )}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.08 }}
        >
          {word}
          {i < words.length - 1 ? " " : null}
        </motion.span>
      ))}
    </h2>
  );
};

const ContactDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => {
  return (
    <p
      data-slot="contact-description"
      className={cn(
        "mx-auto max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg",
        className,
      )}
      {...props}
    />
  );
};

interface ContactActionProps extends React.ComponentProps<"div"> {
  /** Text shown under the button, e.g. the address or number it opens. */
  detail: string;
}

const ContactAction = ({
  detail,
  className,
  children,
  ...props
}: ContactActionProps) => {
  return (
    <div
      data-slot="contact-action"
      className={cn("flex flex-col items-center gap-2", className)}
      {...props}
    >
      {children}
      <p className="font-mono text-xs text-muted-foreground">{detail}</p>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Preview                                                                    */
/* -------------------------------------------------------------------------- */

const Contact03 = () => {
  const reduce = useReducedMotion();

  return (
    <section data-slot="contact" className="bg-background py-16 md:py-24">
      <div className="container">
        <ContactPanel>
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
            <ContactBadge>Contact</ContactBadge>

            <ContactTitle>{HEADLINE}</ContactTitle>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
              className="flex flex-col gap-3"
            >
              <ContactDescription>
                Send a short note about the product and where you are stuck. We
                read every message and reply within a working day.
              </ContactDescription>
              <ContactDescription className="text-sm sm:text-base">
                Prefer to talk? The number below opens a chat, no call needed.
              </ContactDescription>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.6 }}
              className="mt-4 grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <ContactAction detail={CONTACT.email}>
                <Button asChild size="lg" className="w-full rounded-full">
                  <a href={`mailto:${CONTACT.email}`}>
                    <Mail />
                    Send an email
                  </a>
                </Button>
              </ContactAction>
              <ContactAction detail={CONTACT.phone}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full"
                >
                  <a
                    href={`https://wa.me/${digits(CONTACT.phone)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Phone />
                    Call or chat
                  </a>
                </Button>
              </ContactAction>
            </motion.div>
          </div>
        </ContactPanel>
      </div>
    </section>
  );
};

export {
  ContactPanel,
  ContactBadge,
  ContactTitle,
  ContactDescription,
  ContactAction,
};

export default Contact03;

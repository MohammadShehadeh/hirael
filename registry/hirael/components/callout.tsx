import * as React from "react";
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  CheckCircle2,
  Info,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const calloutVariants = cva(
  "my-4 flex flex-col gap-2 overflow-hidden rounded-md border-s-4 p-4 text-sm",
  {
    // Status colors come from the --info / --success / --warning theme
    // tokens (shipped with this component's cssVars) so callouts follow
    // the consumer's theme in both modes — no hard-coded palette.
    variants: {
      variant: {
        info: "border-info bg-info/10 text-info",
        success: "border-success bg-success/10 text-success",
        warning: "border-warning bg-warning/10 text-warning",
        error: "border-destructive bg-destructive/10 text-destructive",
        neutral: "border-muted-foreground/50 bg-muted/50 text-foreground",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

type CalloutVariant = NonNullable<
  VariantProps<typeof calloutVariants>["variant"]
>;

const variantIcons: Record<CalloutVariant, React.ElementType> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: Ban,
  neutral: AlertCircle,
};

export interface CalloutProps extends Omit<React.ComponentProps<"div">, "title">, VariantProps<typeof calloutVariants> {
    title?: React.ReactNode;
    icon?: React.ElementType | React.ReactElement | false;}

const Callout = ({
  title,
  icon,
  className,
  variant = "info",
  children,
  ...props
}: CalloutProps) => {
  const variantKey = (variant ?? "info") as CalloutVariant;

  const renderIcon = () => {
    if (icon === false) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComponent =
      (icon as React.ElementType | undefined) ?? variantIcons[variantKey];
    return <IconComponent className="size-5 shrink-0" aria-hidden />;
  };

  return (
    <div
      data-slot="callout"
      data-variant={variantKey}
      className={cn(calloutVariants({ variant }), className)}
      {...props}
    >
      {(title || icon !== false) && (
        <div className="flex items-start gap-2">
          {renderIcon()}
          {title && <span className="font-semibold leading-5">{title}</span>}
        </div>
      )}
      {children && (
        <div className="text-sm leading-relaxed [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      )}
    </div>
  );
};

export { Callout, calloutVariants };

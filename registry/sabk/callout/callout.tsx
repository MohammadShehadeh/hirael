import * as React from "react"
import { AlertCircle, AlertTriangle, Ban, CheckCircle2, Info } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* ============================================================================
 * Variants
 * ========================================================================== */

const calloutVariants = cva(
  "my-4 flex flex-col gap-2 overflow-hidden rounded-md border-l-4 p-4 text-sm",
  {
    variants: {
      variant: {
        info: "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950/70 dark:text-blue-400",
        success:
          "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-400",
        warning:
          "border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-950/70 dark:text-yellow-400",
        error: "border-red-500 bg-red-50 text-red-900 dark:bg-red-950/70 dark:text-red-400",
        neutral:
          "border-gray-500 bg-gray-100 text-gray-900 dark:bg-gray-800/70 dark:text-gray-400",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

type CalloutVariant = NonNullable<VariantProps<typeof calloutVariants>["variant"]>

const variantIcons: Record<CalloutVariant, React.ElementType> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: Ban,
  neutral: AlertCircle,
}

/* ============================================================================
 * Root · single-prop API
 * ========================================================================== */

export type CalloutProps = Omit<React.ComponentProps<"div">, "title"> &
  VariantProps<typeof calloutVariants> & {
    title?: React.ReactNode
    icon?: React.ElementType | React.ReactElement | false
  }

function Callout({
  title,
  icon,
  className,
  variant = "info",
  children,
  ...props
}: CalloutProps) {
  const variantKey = (variant ?? "info") as CalloutVariant

  const renderIcon = () => {
    if (icon === false) return null
    if (React.isValidElement(icon)) return icon
    const IconComponent = (icon as React.ElementType | undefined) ?? variantIcons[variantKey]
    return <IconComponent className="size-5 shrink-0" aria-hidden />
  }

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
  )
}

export { Callout, calloutVariants }

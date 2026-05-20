import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm border-2 px-1.5 py-0 text-[10px] font-mono uppercase tracking-[0.06em] leading-5 transition-colors [&_svg]:size-3 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-secondary text-secondary-foreground",
        forge:
          "border-transparent bg-forge/15 text-forge",
        outline:
          "border-border text-foreground bg-transparent",
        destructive:
          "border-transparent bg-destructive text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

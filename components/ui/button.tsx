import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Pill controls, after solana.com. The primary pill is solid white (ink in
// light mode); a trailing arrow or chevron becomes a small inverted dot
// inside it (.btn-dot in globals.css). Secondary actions are outlined pills
// that brighten on hover.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent text-[15px] font-medium cursor-pointer shrink-0 outline-none transition-[background-color,border-color,color,opacity] duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        brand: "btn-dot bg-foreground text-background hover:bg-foreground/90",
        default: "btn-dot bg-foreground text-background hover:bg-foreground/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border-stroke bg-transparent text-foreground hover:border-foreground/30 hover:bg-foreground/5",
        secondary:
          "border-stroke bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08]",
        ghost:
          "hover:bg-foreground/5 hover:text-foreground",
        link: "rounded-none text-foreground underline decoration-brand/60 underline-offset-4 hover:decoration-brand",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 gap-1.5 px-3.5 text-sm",
        lg: "h-11 px-6",
        xl: "h-12 px-7",
        '2xl': "h-14 px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

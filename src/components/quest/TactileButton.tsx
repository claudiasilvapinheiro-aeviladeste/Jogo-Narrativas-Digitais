import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const tactileVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl font-display font-semibold transition-[transform,background-color,box-shadow] duration-[180ms] ease-[var(--ease-bounce)] hover:-translate-y-0.5 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_3px_0_0_var(--primary-edge)] hover:shadow-[0_5px_0_0_var(--primary-edge)] active:shadow-[0_1px_0_0_var(--primary-edge)]",
        accent:
          "bg-accent text-accent-foreground shadow-[0_3px_0_0_var(--accent-edge)] hover:shadow-[0_5px_0_0_var(--accent-edge)] active:shadow-[0_1px_0_0_var(--accent-edge)]",
        parchment:
          "bg-background text-foreground border-2 border-amber hover:bg-card-border shadow-[0_3px_0_0_var(--amber)]",
        cauldron:
          "relative overflow-hidden text-primary-foreground [background-image:var(--gradient-cauldron)] shadow-[0_3px_0_0_var(--primary-edge)]",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-5 text-[15px]",
        lg: "h-14 px-7 text-lg",
        xl: "h-16 px-8 text-xl",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface TactileButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tactileVariants> {}

export const TactileButton = forwardRef<HTMLButtonElement, TactileButtonProps>(
  ({ className, variant, size, children, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(tactileVariants({ variant, size }), className)}
      {...props}
    >
      {variant === "cauldron" && <span aria-hidden className="shimmer absolute inset-0" />}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  ),
);
TactileButton.displayName = "TactileButton";

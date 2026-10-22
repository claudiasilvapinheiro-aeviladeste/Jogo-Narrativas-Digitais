import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function WonderCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border-2 border-card-border bg-card text-card-foreground shadow-warm",
        className,
      )}
      {...props}
    />
  );
}

type BadgeTone = "locked" | "active" | "completed" | "gold";

const toneClass: Record<BadgeTone, string> = {
  locked: "bg-muted text-muted-foreground border-node-locked",
  active: "bg-accent text-accent-foreground border-accent-edge",
  completed: "bg-highlight text-highlight-foreground border-highlight-strong",
  gold: "bg-secondary text-secondary-foreground border-secondary-edge",
};

export function BadgeTag({
  tone,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border-2 px-3 py-0.5 text-[13px] font-semibold leading-snug",
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}

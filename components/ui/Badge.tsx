import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "cyan" | "amber" | "orange" | "red" | "emerald" | "blue";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-white/6 text-(--color-text-secondary) border-(--color-panel-border-strong)",
  cyan: "bg-(--color-accent-cyan)/12 text-(--color-accent-cyan) border-(--color-accent-cyan)/30",
  amber: "bg-(--color-accent-amber)/12 text-(--color-accent-amber) border-(--color-accent-amber)/30",
  orange: "bg-(--color-accent-orange)/12 text-(--color-accent-orange) border-(--color-accent-orange)/30",
  red: "bg-(--color-accent-red)/14 text-(--color-accent-red) border-(--color-accent-red)/35",
  emerald: "bg-(--color-accent-emerald)/12 text-(--color-accent-emerald) border-(--color-accent-emerald)/30",
  blue: "bg-(--color-accent-blue)/12 text-(--color-accent-blue) border-(--color-accent-blue)/30",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide whitespace-nowrap",
        TONE_CLASSES[tone],
        className,
      )}
      {...props}
    />
  );
}

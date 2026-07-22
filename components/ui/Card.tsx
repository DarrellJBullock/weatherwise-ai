import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
  interactive?: boolean;
}

export function Card({ strong, interactive, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]",
        strong ? "glass-panel-strong" : "glass-panel",
        interactive &&
          "transition-colors duration-150 hover:border-(--color-panel-border-strong) focus-within:border-(--color-accent-cyan)",
        className,
      )}
      {...props}
    />
  );
}

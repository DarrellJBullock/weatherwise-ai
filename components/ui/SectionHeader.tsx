import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function SectionHeader({ title, description, action, className, as = "h2" }: SectionHeaderProps) {
  const Heading = as;
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-3", className)}>
      <div>
        <Heading className="text-sm font-semibold tracking-wide text-(--color-text-primary) uppercase">
          {title}
        </Heading>
        {description && <p className="mt-0.5 text-xs text-(--color-text-secondary)">{description}</p>}
      </div>
      {action}
    </div>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-(--color-panel-border-strong) px-6 py-10 text-center",
        className,
      )}
    >
      {icon && <div className="text-(--color-text-muted)">{icon}</div>}
      <p className="text-sm font-medium text-(--color-text-primary)">{title}</p>
      {description && <p className="max-w-xs text-xs text-(--color-text-secondary)">{description}</p>}
      {action}
    </div>
  );
}

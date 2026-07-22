import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-(--color-accent-cyan) text-(--color-console-bg) hover:bg-(--color-accent-cyan-dim) hover:text-white",
  secondary:
    "glass-panel text-(--color-text-primary) hover:border-(--color-accent-cyan)/50",
  ghost: "text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-white/5",
  danger: "bg-(--color-accent-red)/15 text-(--color-accent-red) hover:bg-(--color-accent-red)/25",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    />
  );
}

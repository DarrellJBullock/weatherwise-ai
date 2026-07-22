import Link from "next/link";
import { Radar } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="py-16">
      <EmptyState
        icon={<Radar className="size-8" aria-hidden="true" />}
        title="Page not found"
        description="This screen isn't part of the Storm Operations Console. Head back to the dashboard."
        action={
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-full bg-(--color-accent-cyan) px-4 text-sm font-medium text-(--color-console-bg) hover:bg-(--color-accent-cyan-dim) hover:text-white"
          >
            Back to Dashboard
          </Link>
        }
      />
    </div>
  );
}

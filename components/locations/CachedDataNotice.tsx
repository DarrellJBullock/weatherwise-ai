"use client";

import { CloudOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function CachedDataNotice() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="flex items-center gap-2 rounded-xl border border-(--color-accent-amber)/30 bg-(--color-accent-amber)/10 px-3 py-2 text-xs text-(--color-accent-amber)">
      <CloudOff className="size-3.5 shrink-0" aria-hidden="true" />
      You&apos;re offline. This page may be showing the last cached forecast rather than live data.
    </div>
  );
}

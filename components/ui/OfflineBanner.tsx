"use client";

import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 border-b border-(--color-accent-amber)/30 bg-(--color-accent-amber)/12 px-4 py-2 text-xs font-medium text-(--color-accent-amber)"
    >
      <WifiOff className="size-3.5" aria-hidden="true" />
      <span>You&apos;re offline — showing the last cached forecast.</span>
    </div>
  );
}

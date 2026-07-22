import Link from "next/link";
import { MapPinOff } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function LocationNotFound() {
  return (
    <div className="py-10">
      <EmptyState
        icon={<MapPinOff className="size-8" aria-hidden="true" />}
        title="Location not tracked"
        description="This city isn't in the WeatherWise AI mock provider yet. Try one of the seven tracked locations."
        action={
          <Link
            href="/locations"
            className="inline-flex h-10 items-center justify-center rounded-full bg-(--color-accent-cyan) px-4 text-sm font-medium text-(--color-console-bg) hover:bg-(--color-accent-cyan-dim) hover:text-white"
          >
            Browse Locations
          </Link>
        }
      />
    </div>
  );
}

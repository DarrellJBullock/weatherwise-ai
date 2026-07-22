"use client";

import { Star } from "lucide-react";
import { useSavedLocations } from "@/hooks/useSavedLocations";
import { Button } from "@/components/ui/Button";

export function SaveToggleButton({ slug }: { slug: string }) {
  const { isSaved, addLocation, removeLocation, isHydrated } = useSavedLocations();
  const saved = isHydrated && isSaved(slug);

  return (
    <Button
      type="button"
      variant={saved ? "secondary" : "primary"}
      size="sm"
      onClick={() => (saved ? removeLocation(slug) : addLocation(slug))}
      aria-pressed={saved}
    >
      <Star className={saved ? "size-3.5 fill-current" : "size-3.5"} aria-hidden="true" />
      {saved ? "Saved" : "Save Location"}
    </Button>
  );
}

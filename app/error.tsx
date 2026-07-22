"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-16">
      <EmptyState
        icon={<TriangleAlert className="size-8 text-(--color-accent-red)" aria-hidden="true" />}
        title="Something went wrong"
        description="The console hit an unexpected error rendering this screen. Try again, or head back to the dashboard."
        action={
          <Button type="button" onClick={reset}>
            Try again
          </Button>
        }
      />
    </div>
  );
}

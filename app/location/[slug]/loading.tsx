import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8 py-2" aria-busy="true" aria-label="Loading location">
      <Skeleton className="h-4 w-20" />
      <Card strong className="h-56">
        <Skeleton className="h-full w-full" />
      </Card>
      <Card className="h-28">
        <Skeleton className="h-full w-full" />
      </Card>
      <Card className="h-64">
        <Skeleton className="h-full w-full" />
      </Card>
    </div>
  );
}

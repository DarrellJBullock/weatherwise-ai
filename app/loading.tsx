import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8 py-2" aria-busy="true" aria-label="Loading dashboard">
      <div className="flex gap-2">
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <Card strong className="h-56">
        <Skeleton className="h-full w-full" />
      </Card>
      <div className="flex gap-2">
        <Skeleton className="h-16 w-32 rounded-xl" />
        <Skeleton className="h-16 w-32 rounded-xl" />
      </div>
      <Card className="h-28">
        <Skeleton className="h-full w-full" />
      </Card>
      <Card className="h-72">
        <Skeleton className="h-full w-full" />
      </Card>
    </div>
  );
}

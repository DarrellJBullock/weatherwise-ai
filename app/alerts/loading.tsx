import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-3 py-2" aria-busy="true" aria-label="Loading alerts">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-8 w-full rounded-full" />
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
  );
}

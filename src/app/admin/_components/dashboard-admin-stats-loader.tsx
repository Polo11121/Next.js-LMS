import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardAdminStatsLoader = () => (
  <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <Card
        key={i}
        className="@container/card p-4 flex flex-col justify-between h-full"
      >
        <div className="flex items-center justify-between space-y-0 pb-2">
          <div>
            <Skeleton className="h-[20px] w-24 mb-2" />
            <Skeleton className="h-7 w-16" />
          </div>
          <Skeleton className="size-6 rounded-full" />
        </div>
        <div className="flex-col items-start gap-1.5 text-sm mt-4">
          <Skeleton className="h-[20px] w-32" />
        </div>
      </Card>
    ))}
  </div>
);

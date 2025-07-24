import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PublicCoursesListLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="group relative py-0 gap-0">
        <Skeleton className="absolute top-2 right-2 z-10 h-6 w-16 rounded-full" />
        <Skeleton className="w-full rounded-t-lg aspect-video object-cover" />
        <CardContent className="p-4">
          <Skeleton className="h-[28px] w-3/4 rounded mb-2" />
          <Skeleton className="h-[17.5px] w-full rounded mb-4" />
          <div className="mt-4 flex items-center gap-x-2">
            <div className="flex items-center gap-x-2">
              <Skeleton className="size-6 p-1 rounded-md bg-primary/10" />
              <Skeleton className="h-4 w-10 rounded" />
            </div>
            <div className="flex items-center gap-x-2">
              <Skeleton className="size-6 p-1 rounded-md bg-primary/10" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
          <Skeleton className="w-full h-[36px] rounded mt-4" />
        </CardContent>
      </Card>
    ))}
  </div>
);

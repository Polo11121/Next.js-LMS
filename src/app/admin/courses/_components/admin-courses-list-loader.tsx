import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const AdminCoursesListLoader = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
    {Array.from({ length: 4 }).map((_, index) => (
      <Card className="group relative py-0 gap-0" key={index}>
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
          <Skeleton className="size-[36px] rounded-md" />
        </div>
        <Skeleton className="w-full rounded-t-lg aspect-video h-max object-cover" />
        <div className="p-4">
          <Skeleton className="h-[28px] w-3/4 mb-2 rounded" />
          <Skeleton className="h-[17.5px] w-full mb-4 rounded" />
          <div className="mt-4 flex items-center gap-x-5">
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-6 w-6 rounded-md" />
              <Skeleton className="h-4 w-10 rounded" />
            </div>
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-6 w-6 rounded-md" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
          </div>
          <Skeleton className="h-[36px] w-full mt-4 rounded" />
        </div>
      </Card>
    ))}
  </div>
);

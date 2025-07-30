import { Suspense } from "react";
import { getAdminRecentCourses } from "@/data/admin/get-admin-recent-courses";
import { buttonVariants } from "@/components/ui/button";
import { AdminCoursesList } from "@/app/admin/courses/_components/admin-courses-list";
import { AdminCoursesListLoader } from "@/app/admin/courses/_components/admin-courses-list-loader";
import Link from "next/link";

export const DashboardRecentCourses = () => {
  const coursesPromise = getAdminRecentCourses();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recent Courses</h2>
        <Link
          className={buttonVariants({
            variant: "outline",
          })}
          href="/admin/courses"
        >
          View All Courses
        </Link>
      </div>
      <Suspense fallback={<AdminCoursesListLoader />}>
        <AdminCoursesList coursesPromise={coursesPromise} />
      </Suspense>
    </div>
  );
};

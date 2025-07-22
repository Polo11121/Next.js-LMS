import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { getAdminCourses } from "@/data/admin/get-admin-courses";
import { AdminCoursesList } from "@/app/admin/courses/_components/admin-courses-list";
import { AdminCoursesListLoader } from "@/app/admin/courses/_components/admin-courses-list-loader";
import Link from "next/link";

const AdminCoursesPage = () => {
  const coursesPromise = getAdminCourses();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          Create Course
        </Link>
      </div>
      <Suspense fallback={<AdminCoursesListLoader />}>
        <AdminCoursesList coursesPromise={coursesPromise} />
      </Suspense>
    </>
  );
};

export default AdminCoursesPage;

import { Suspense } from "react";
import { PublicCoursesList } from "@/app/(public)/courses/_components/public-courses-list";
import { getPublicCourses } from "@/data/public/get-public-courses";
import { PublicCoursesListLoader } from "@/app/(public)/courses/_components/public-courses-list-loader";

const PublicCoursesPage = async () => {
  const coursesPromise = getPublicCourses();

  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover our wide range of courses designed to help you learn new
          skills and advance your career.
        </p>
      </div>

      <Suspense fallback={<PublicCoursesListLoader />}>
        <PublicCoursesList coursesPromise={coursesPromise} />
      </Suspense>
    </div>
  );
};

export default PublicCoursesPage;

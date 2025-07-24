import { PublicCoursesListItem } from "@/data/public/get-public-courses";
import { PublicCourseCard } from "@/app/(public)/courses/_components/public-course-card";

type PublicCoursesListProps = {
  coursesPromise: Promise<PublicCoursesListItem[]>;
};

export const PublicCoursesList = async ({
  coursesPromise,
}: PublicCoursesListProps) => {
  const courses = await coursesPromise;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

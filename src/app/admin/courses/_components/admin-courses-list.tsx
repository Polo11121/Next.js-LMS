import { EmptyStateWrapper } from "@/components/empty-state-wrapper";
import { AdminCoursesListItem } from "@/data/admin/get-admin-courses";
import { AdminCourseCard } from "./admin-course-card";

type AdminCoursesListProps = {
  coursesPromise: Promise<AdminCoursesListItem[]>;
};

export const AdminCoursesList = async ({
  coursesPromise,
}: AdminCoursesListProps) => {
  const courses = await coursesPromise;

  return (
    <EmptyStateWrapper
      data={courses}
      title="No courses found"
      description="Create a new course to get started"
      buttonText="Create Course"
      buttonHref="/admin/courses/create"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
        {courses.map((course) => (
          <AdminCourseCard key={course.id} course={course} />
        ))}
      </div>
    </EmptyStateWrapper>
  );
};

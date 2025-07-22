import { DeleteCourseCard } from "@/app/admin/courses/[courseId]/delete/_components/delete-course-card";

type AdminDeleteCoursePageProps = {
  params: Promise<{ courseId: string }>;
};

const AdminDeleteCoursePage = async ({
  params,
}: AdminDeleteCoursePageProps) => {
  const { courseId } = await params;

  return (
    <div className="max-w-xl mx-auto w-full">
      <DeleteCourseCard courseId={courseId} />
    </div>
  );
};

export default AdminDeleteCoursePage;

import { getAdminLesson } from "@/data/admin/get-admin-lesson";
import { EditLessonForm } from "@/app/admin/courses/[courseId]/[chapterId]/[lessonId]/_components/edit-lesson-form";
import { Heading } from "@/components/heading";

type AdminLessonPageProps = {
  params: Promise<{ courseId: string; chapterId: string; lessonId: string }>;
};

const AdminLessonPage = async ({ params }: AdminLessonPageProps) => {
  const { lessonId, courseId, chapterId } = await params;
  const lesson = await getAdminLesson(lessonId);

  return (
    <div>
      <Heading
        text="Edit Lesson"
        href={`/admin/courses/${courseId}/edit`}
        underlineText={lesson.title}
      />
      <EditLessonForm
        lesson={lesson}
        chapterId={chapterId}
        courseId={courseId}
      />
    </div>
  );
};

export default AdminLessonPage;

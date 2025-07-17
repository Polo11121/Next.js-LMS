import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminCourse } from "@/data/admin/get-admin-course";
import { EditCourseForm } from "@/app/admin/courses/[courseId]/edit/_components/edit-course-form";

type AdminEditCoursePageProps = {
  params: Promise<{ courseId: string }>;
};

const AdminEditCoursePage = async ({ params }: AdminEditCoursePageProps) => {
  const { courseId } = await params;
  const course = await getAdminCourse(courseId);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Edit Course{" "}
        <span className="text-primary underline">{course.title}</span>
      </h1>
      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>
                Provide basic information about the course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm courseId={courseId} course={course} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEditCoursePage;

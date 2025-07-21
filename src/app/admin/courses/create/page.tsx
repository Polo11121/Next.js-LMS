import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateCourseForm } from "@/app/admin/courses/create/_components/create-course-form";
import { BackButton } from "@/components/back-button";

const AdminCreateCoursePage = () => (
  <>
    <div className="flex items-center gap-4">
      <BackButton href="/admin/courses" />
      <h1 className="text-2xl font-bold">Create Course</h1>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Provide basic information about the course
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateCourseForm />
      </CardContent>
    </Card>
  </>
);

export default AdminCreateCoursePage;

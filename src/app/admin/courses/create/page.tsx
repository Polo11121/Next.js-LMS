import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateCourseForm } from "@/app/admin/courses/create/_components/create-course-form";
import { Heading } from "@/components/heading";

const AdminCreateCoursePage = () => (
  <>
    <Heading
      text="Create"
      href="/admin/courses"
      underlineText="Course"
      noMargin
    />
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Provide basic information about the course.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateCourseForm />
      </CardContent>
    </Card>
  </>
);

export default AdminCreateCoursePage;

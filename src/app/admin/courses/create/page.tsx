import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";
import { CreateCourseForm } from "@/app/admin/courses/create/_components/create-course-form";
import Link from "next/link";

const AdminCreateCoursePage = () => (
  <>
    <div className="flex items-center gap-4">
      <Link
        href="/admin/courses"
        className={buttonVariants({ variant: "outline", size: "icon" })}
      >
        <ArrowLeftIcon className="size-4" />
      </Link>
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

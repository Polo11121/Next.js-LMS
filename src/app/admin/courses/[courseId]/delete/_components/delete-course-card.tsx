"use client";

import { useTransition } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrashIcon } from "lucide-react";
import { tryCatch } from "@/functions/try-catch";
import { apiResponseHandler } from "@/lib/api-response-handler";
import { useRouter } from "next/navigation";
import { deleteCourse } from "@/app/admin/courses/[courseId]/delete/actions";
import Link from "next/link";

type DeleteCourseCardProps = {
  courseId: string;
};

export const DeleteCourseCard = ({ courseId }: DeleteCourseCardProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteCourse = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(deleteCourse(courseId));

      apiResponseHandler({
        error,
        data,
        successMessage: "Course deleted successfully",
        errorMessage: "Failed to delete course",
        onSuccess: () => {
          router.push("/admin/courses");
        },
      });
    });
  };

  return (
    <Card className="mt-32">
      <CardHeader>
        <CardTitle>Delete Course</CardTitle>
        <CardDescription>
          Are you sure you want to delete this course? This action cannot be
          undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col-reverse md:flex-row gap-2 md:justify-end">
        <Link
          className={buttonVariants({
            variant: "outline",
          })}
          href="/admin/courses"
        >
          Cancel
        </Link>
        <Button
          variant="destructive"
          disabled={isPending}
          isLoading={isPending}
          onClick={handleDeleteCourse}
        >
          Delete Course <TrashIcon className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

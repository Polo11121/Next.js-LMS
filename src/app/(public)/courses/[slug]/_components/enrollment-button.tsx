"use client";

import { useTransition } from "react";
import { apiResponseHandler } from "@/lib/api-response-handler";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/functions/try-catch";
import { enrollCourse } from "@/app/(public)/courses/[slug]/actions";

type EnrollmentButtonProps = {
  courseId: string;
};

export const EnrollmentButton = ({ courseId }: EnrollmentButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleEnroll = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(enrollCourse(courseId));

      apiResponseHandler({
        error,
        data,
        successMessage: "Lesson updated successfully",
        errorMessage: "Failed to update lesson",
        onSuccess: () => {},
      });
    });
  };

  return (
    <Button className="w-full" onClick={handleEnroll} disabled={isPending}>
      Enroll Now!
    </Button>
  );
};

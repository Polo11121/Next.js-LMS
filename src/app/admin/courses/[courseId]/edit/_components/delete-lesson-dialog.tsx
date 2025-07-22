import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { tryCatch } from "@/functions/try-catch";
import { apiResponseHandler } from "@/lib/api-response-handler";
import { deleteLesson } from "@/app/admin/courses/[courseId]/edit/actions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteLessonDialogProps = {
  courseId: string;
  chapterId: string;
  lessonId: string;
};

export const DeleteLessonDialog = ({
  courseId,
  chapterId,
  lessonId,
}: DeleteLessonDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleDialog = () => {
    setIsOpen((prev) => !prev);
  };

  const handleDeleteLesson = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        deleteLesson(lessonId, chapterId, courseId)
      );

      apiResponseHandler({
        error,
        data,
        successMessage: "Lesson deleted successfully",
        errorMessage: "Failed to delete lesson",
        onSuccess: () => {
          toggleDialog();
        },
      });
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={toggleDialog}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <TrashIcon className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this lesson? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col-reverse md:flex-row justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={toggleDialog}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={isPending}
            isLoading={isPending}
            onClick={handleDeleteLesson}
          >
            Delete Lesson <TrashIcon className="size-4" />
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { tryCatch } from "@/functions/try-catch";
import { apiResponseHandler } from "@/lib/api-response-handler";
import { deleteChapter } from "@/app/admin/courses/[courseId]/edit/actions";
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
};

export const DeleteChapterDialog = ({
  courseId,
  chapterId,
}: DeleteLessonDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleDialog = () => {
    setIsOpen((prev) => !prev);
  };

  const handleDeleteChapter = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        deleteChapter(chapterId, courseId)
      );

      apiResponseHandler({
        error,
        data,
        successMessage: "Chapter deleted successfully",
        errorMessage: "Failed to delete chapter",
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
          <AlertDialogTitle>Delete Chapter</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this chapter? This action cannot be
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
            variant="destructive"
            type="submit"
            disabled={isPending}
            isLoading={isPending}
            onClick={handleDeleteChapter}
          >
            Delete Chapter <TrashIcon className="size-4" />
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

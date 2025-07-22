import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LessonSchema, lessonSchema } from "@/lib/zod-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/functions/try-catch";
import { apiResponseHandler } from "@/lib/api-response-handler";
import { createLesson } from "@/app/admin/courses/[courseId]/edit/actions";

type CreateLessonDialogProps = {
  courseId: string;
  chapterId: string;
};

export const CreateLessonDialog = ({
  courseId,
  chapterId,
}: CreateLessonDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: "",
      courseId,
      chapterId,
    },
  });

  const toggleDialog = () => {
    form.reset();
    setIsOpen((prev) => !prev);
  };

  const onSubmit = (values: LessonSchema) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(createLesson(values));

      apiResponseHandler({
        error,
        data,
        successMessage: "Lesson created successfully",
        errorMessage: "Failed to create lesson",
        onSuccess: () => {
          toggleDialog();
        },
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Create new lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Lesson</DialogTitle>
          <DialogDescription>
            Create a new lesson for your course.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col-reverse md:flex-row justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={toggleDialog}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} isLoading={isPending}>
                Create Lesson <PlusIcon className="size-4" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

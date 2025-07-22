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
import { ChapterSchema, chapterSchema } from "@/lib/zod-schemas";
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
import { createChapter } from "@/app/admin/courses/[courseId]/edit/actions";
import { apiResponseHandler } from "@/lib/api-response-handler";

type CreateChapterDialogProps = {
  courseId: string;
};

export const CreateChapterDialog = ({ courseId }: CreateChapterDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<ChapterSchema>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: "",
      courseId,
    },
  });

  const toggleDialog = () => {
    form.reset();
    setIsOpen((prev) => !prev);
  };

  const onSubmit = (values: ChapterSchema) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(createChapter(values));

      apiResponseHandler({
        error,
        data,
        successMessage: "Chapter created successfully",
        errorMessage: "Failed to create chapter",
        onSuccess: () => {
          toggleDialog();
        },
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="size-4" />
          Create Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Chapter</DialogTitle>
          <DialogDescription>
            Create a new chapter for your course.
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
                Create Chapter <PlusIcon className="size-4" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

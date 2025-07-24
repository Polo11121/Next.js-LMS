"use client";

import { AdminLessonsListItem } from "@/data/admin/get-admin-lesson";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { lessonSchema, LessonSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { EditIcon } from "lucide-react";
import { TextEditor } from "@/components/text-editor/text-editor";
import { FileUploader } from "@/components/file-uploader/file-uploader";
import { editLesson } from "@/app/admin/courses/[courseId]/[chapterId]/[lessonId]/actions";
import { tryCatch } from "@/functions/try-catch";
import { apiResponseHandler } from "@/lib/api-response-handler";
import { useRouter } from "next/navigation";

type EditLessonFormProps = {
  lesson: AdminLessonsListItem;
  chapterId: string;
  courseId: string;
};

export const EditLessonForm = ({
  lesson,
  chapterId,
  courseId,
}: EditLessonFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: lesson.title,
      description: lesson.description || "",
      videoKey: lesson.videoKey || "",
      thumbnailKey: lesson.thumbnailKey || "",
      chapterId,
      courseId,
    },
  });

  const onSubmit = (values: LessonSchema) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(editLesson(values, lesson.id));

      apiResponseHandler({
        error,
        data,
        successMessage: "Lesson updated successfully",
        errorMessage: "Failed to update lesson",
        onSuccess: () => {
          form.reset();
          router.push(`/admin/courses/${courseId}/edit`);
        },
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lesson Configuration</CardTitle>
        <CardDescription>
          Configure the video and other settings.
        </CardDescription>
      </CardHeader>

      <CardContent>
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <TextEditor
                      isDisabled={isPending}
                      value={field.value}
                      onChange={field.onChange}
                      isError={!!form.formState.errors.description}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnailKey"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Thumbnail Image</FormLabel>
                  <FormControl>
                    <FileUploader
                      fileType="image"
                      isDisabled={isPending}
                      value={field.value}
                      onChange={field.onChange}
                      isError={!!form.formState.errors.thumbnailKey}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoKey"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Video</FormLabel>
                  <FormControl>
                    <FileUploader
                      fileType="video"
                      isDisabled={isPending}
                      value={field.value}
                      onChange={field.onChange}
                      isError={!!form.formState.errors.videoKey}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              isLoading={isPending}
              className="w-full md:w-auto md:ml-auto flex justify-center"
            >
              Update Lesson <EditIcon className="size-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

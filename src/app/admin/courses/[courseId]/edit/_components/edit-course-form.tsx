"use client";

import { useTransition } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TextEditor } from "@/components/text-editor/text-editor";
import { FileUploader } from "@/components/file-uploader/file-uploader";
import { editCourse } from "@/app/admin/courses/[courseId]/edit/actions";
import { Button } from "@/components/ui/button";
import { PencilIcon, SparkleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, CourseSchema } from "@/lib/zod-schemas";
import { useRouter } from "next/navigation";
import { tryCatch } from "@/functions/try-catch";
import {
  CourseCategory,
  CourseLevel,
  CourseStatus,
} from "@/lib/generated/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminCourse } from "@/data/admin/get-admin-course";
import { apiResponseHandler } from "@/lib/api-response-handler";
import slugify from "slugify";

type EditCourseFormProps = {
  course: AdminCourse;
};

export const EditCourseForm = ({ course }: EditCourseFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      ...course,
    },
  });

  const handleGenerateSlug = () => {
    const titleValue = form.getValues("title");
    const slug = slugify(titleValue);
    form.setValue("slug", slug, { shouldValidate: true });
  };

  const onSubmit = (values: CourseSchema) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(editCourse(values, course.id));

      apiResponseHandler({
        error,
        data,
        successMessage: "Course edited successfully",
        onSuccess: () => {
          form.reset();
          router.push("/admin/courses");
        },
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-start flex-col md:flex-row">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="flex-1 w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Slug" disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:gap-2 md:items-center">
            <div className="md:h-[14px]" />
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateSlug}
              disabled={isPending}
            >
              Generate Slug <SparkleIcon className="size-4" />
            </Button>
            <div className="md:h-[20px]" />
          </div>
        </div>
        <FormField
          control={form.control}
          name="smallDescription"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Small Description</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[120px]"
                  placeholder="Small Description"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
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
          name="fileKey"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Thumbnail Image</FormLabel>
              <FormControl>
                <FileUploader
                  isDisabled={isPending}
                  value={field.value}
                  onChange={field.onChange}
                  isError={!!form.formState.errors.fileKey}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger
                      disabled={isPending}
                      className="w-full"
                      aria-invalid={!!form.formState.errors.category}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CourseCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger
                      disabled={isPending}
                      className="w-full"
                      aria-invalid={!!form.formState.errors.category}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CourseLevel).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="flex-1 w-full">
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Duration (minutes)"
                    type="number"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1 w-full">
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Price ($)"
                    type="number"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex-1 w-full">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger
                    disabled={isPending}
                    className="w-full"
                    aria-invalid={!!form.formState.errors.category}
                  >
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CourseStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          Edit Course <PencilIcon className="size-4" />
        </Button>
      </form>
    </Form>
  );
};

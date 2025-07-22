"use server";

import { requireAdmin } from "@/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { lessonSchema, LessonSchema } from "@/lib/zod-schemas";
import { ActionResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const editLesson = async (
  formData: LessonSchema,
  lessonId: string
): Promise<ActionResponse> => {
  await requireAdmin();

  try {
    const validatedData = lessonSchema.safeParse(formData);

    if (!validatedData.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title: validatedData.data.name,
        description: validatedData.data.description,
        thumbnailKey: validatedData.data.thumbnailKey,
        videoKey: validatedData.data.videoKey,
      },
    });

    revalidatePath(`/admin/courses/${validatedData.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update lesson",
    };
  }
};

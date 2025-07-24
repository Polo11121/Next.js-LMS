"use server";

import { requireAdmin } from "@/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { lessonSchema, LessonSchema } from "@/lib/zod-schemas";
import { ActionResponse } from "@/lib/types";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 10,
  })
);

export const editLesson = async (
  formData: LessonSchema,
  lessonId: string
): Promise<ActionResponse> => {
  const session = await requireAdmin();

  try {
    const req = await request();
    const result = await aj.protect(req, {
      fingerprint: session.user.id as string,
    });

    if (result.isDenied()) {
      if (result.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You have been blocked due to rate limit",
        };
      } else {
        return {
          status: "error",
          message: "Looks like you are a bot",
        };
      }
    }

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

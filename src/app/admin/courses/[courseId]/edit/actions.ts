"use server";

import { requireAdmin } from "@/data/admin/require-admin";
import { Course } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { ActionResponse, ActionResponseWithData } from "@/lib/types";
import { courseSchema, CourseSchema } from "@/lib/zod-schemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export const editCourse = async (
  formData: CourseSchema,
  courseId: string
): Promise<ActionResponseWithData<Course>> => {
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

    const validatedData = courseSchema.safeParse(formData);

    if (!validatedData.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    const editedCourse = await prisma.course.update({
      data: {
        ...validatedData.data,
      },
      where: {
        id: courseId,
        userId: session.user.id,
      },
    });

    return {
      status: "success",
      message: "Course edited successfully",
      data: editedCourse,
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
};

export const reorderLessons = async (
  courseId: string,
  chapterId: string,
  lessons: { id: string; position: number }[]
): Promise<ActionResponse> => {
  await requireAdmin();

  try {
    if (!lessons || !lessons.length) {
      return {
        status: "error",
        message: "No lessons to reorder",
      };
    }

    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          chapterId,
          id: lesson.id,
        },
        data: {
          position: lesson.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder lessons",
    };
  }
};

export const reorderChapters = async (
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ActionResponse> => {
  await requireAdmin();

  try {
    if (!chapters || !chapters.length) {
      return {
        status: "error",
        message: "No chapters to reorder",
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          courseId,
          id: chapter.id,
        },
        data: {
          position: chapter.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder chapters",
    };
  }
};

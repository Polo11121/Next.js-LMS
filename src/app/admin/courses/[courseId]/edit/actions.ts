"use server";

import { requireAdmin } from "@/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/lib/types";
import {
  chapterSchema,
  ChapterSchema,
  courseSchema,
  CourseSchema,
  lessonSchema,
  LessonSchema,
} from "@/lib/zod-schemas";
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

    const validatedData = courseSchema.safeParse(formData);

    if (!validatedData.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    await prisma.course.update({
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
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
};

export const reorderLessons = async (
  lessons: { id: string; position: number }[],
  chapterId: string,
  courseId: string
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
  chapters: { id: string; position: number }[],
  courseId: string
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

export const createChapter = async (
  formData: ChapterSchema
): Promise<ActionResponse> => {
  await requireAdmin();

  try {
    const validatedData = chapterSchema.safeParse(formData);

    if (!validatedData.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    await prisma.$transaction(async (tx) => {
      const highestPosition = await tx.chapter.findFirst({
        where: {
          courseId: validatedData.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      return await tx.chapter.create({
        data: {
          title: validatedData.data.name,
          courseId: validatedData.data.courseId,
          position: (highestPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${validatedData.data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create chapter",
    };
  }
};

export const createLesson = async (
  formData: LessonSchema
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

    await prisma.$transaction(async (tx) => {
      const highestPosition = await tx.lesson.findFirst({
        where: {
          chapterId: validatedData.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      return await tx.lesson.create({
        data: {
          title: validatedData.data.name,
          description: validatedData.data.description,
          thumbnailKey: validatedData.data.thumbnailKey,
          videoKey: validatedData.data.videoKey,
          chapterId: validatedData.data.chapterId,
          position: (highestPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${validatedData.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create lesson",
    };
  }
};

export const deleteLesson = async (
  lessonId: string,
  chapterId: string,
  courseId: string
): Promise<ActionResponse> => {
  await requireAdmin();

  try {
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
      select: {
        id: true,
        lessons: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!chapter) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    const lesson = chapter.lessons.find((lesson) => lesson.id === lessonId);

    if (!lesson) {
      return {
        status: "error",
        message: "Lesson not found in this chapter",
      };
    }

    const remainingLessons = chapter.lessons.filter(
      (lesson) => lesson.id !== lessonId
    );

    const updates = remainingLessons.map((lesson, index) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
        },
        data: {
          position: index + 1,
        },
      })
    );

    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where: {
          id: lessonId,
          chapterId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete lesson",
    };
  }
};

export const deleteChapter = async (
  chapterId: string,
  courseId: string
): Promise<ActionResponse> => {
  await requireAdmin();

  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        chapters: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    const chapter = course.chapters.find((chapter) => chapter.id === chapterId);

    if (!chapter) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    const remainingChapters = course.chapters.filter(
      (chapter) => chapter.id !== chapterId
    );

    const updates = remainingChapters.map((chapter, index) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
        },
        data: {
          position: index + 1,
        },
      })
    );

    await prisma.$transaction([
      ...updates,
      prisma.chapter.delete({
        where: {
          id: chapterId,
          courseId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete chapter",
    };
  }
};

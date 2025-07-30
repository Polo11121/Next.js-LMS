import "server-only";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/data/admin/require-admin";
import { notFound } from "next/navigation";

export const getAdminLesson = async (lessonId: string) => {
  await requireAdmin();

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      title: true,
      videoKey: true,
      thumbnailKey: true,
      description: true,
      position: true,
      id: true,
    },
  });

  if (!lesson) {
    throw notFound();
  }

  return lesson;
};

export type AdminLessonsListItem = Awaited<ReturnType<typeof getAdminLesson>>;

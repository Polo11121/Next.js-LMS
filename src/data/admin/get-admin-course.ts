import "server-only";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/data/admin/require-admin";
import { notFound } from "next/navigation";

export const getAdminCourse = async (courseId: string) => {
  await requireAdmin();

  const course = await prisma.course.findUnique({
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      status: true,
      slug: true,
      smallDescription: true,
      category: true,
      chapters: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailKey: true,
              videoKey: true,
              position: true,
            },
          },
        },
      },
    },

    where: {
      id: courseId,
    },
  });

  if (!course) {
    return notFound();
  }

  return course;
};

export type AdminCourse = Awaited<ReturnType<typeof getAdminCourse>>;

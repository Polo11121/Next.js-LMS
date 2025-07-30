import "server-only";

import { requireAdmin } from "@/data/admin/require-admin";
import { prisma } from "@/lib/prisma";

export const getAdminRecentCourses = async () => {
  await requireAdmin();

  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      price: true,
      fileKey: true,
      slug: true,
    },
    take: 3,
  });

  return courses;
};

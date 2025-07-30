import "server-only";

import { requireAdmin } from "@/data/admin/require-admin";
import { prisma } from "@/lib/prisma";

export const getAdminDashboardStats = async () => {
  await requireAdmin();

  const [totalUsers, totalCourses, totalLessons, totalCustomers] =
    await Promise.all([
      prisma.user.count({
        where: {
          role: "USER",
        },
      }),
      prisma.course.count(),
      prisma.lesson.count(),
      prisma.user.count({
        where: {
          enrollments: {
            some: {},
          },
        },
      }),
    ]);

  return { totalUsers, totalCourses, totalLessons, totalCustomers };
};

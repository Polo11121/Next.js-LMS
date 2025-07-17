import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/data/admin/require-admin";

export const getAdminCourses = async () => {
  const session = await requireAdmin();

  const courses = await prisma.course.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
    where: {
      userId: session.user.id,
    },
  });

  return courses;
};

export type AdminCoursesListItem = Awaited<
  ReturnType<typeof getAdminCourses>
>[number];

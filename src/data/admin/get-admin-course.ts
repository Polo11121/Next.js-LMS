import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/data/admin/require-admin";
import { notFound } from "next/navigation";

export const getAdminCourse = async (courseId: string) => {
  const session = await requireAdmin();

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
    },

    where: {
      id: courseId,
      userId: session.user.id,
    },
  });

  if (!course) {
    return notFound();
  }

  return course;
};

export type AdminCourse = Awaited<ReturnType<typeof getAdminCourse>>;

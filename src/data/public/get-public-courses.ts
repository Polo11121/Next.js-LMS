import { CourseStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

export const getPublicCourses = async () => {
  const courses = await prisma.course.findMany({
    where: {
      status: CourseStatus.Published,
    },
    select: {
      title: true,
      price: true,
      smallDescription: true,
      slug: true,
      fileKey: true,
      id: true,
      level: true,
      duration: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return courses;
};

export type PublicCoursesListItem = Awaited<
  ReturnType<typeof getPublicCourses>
>[number];

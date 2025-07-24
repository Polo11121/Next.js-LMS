import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const getPublicCourse = async (slug: string) => {
  const course = await prisma.course.findUnique({
    where: {
      slug,
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
      description: true,
      chapters: {
        select: {
          id: true,
          title: true,
          lessons: {
            select: {
              id: true,
              title: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  return course;
};

export type PublicCourse = Awaited<ReturnType<typeof getPublicCourse>>;

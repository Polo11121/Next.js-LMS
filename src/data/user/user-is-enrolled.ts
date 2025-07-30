import "server-only";

import { EnrollmentStatus } from "@/lib/generated/prisma";
import { requireUser } from "@/data/user/require-user";
import { prisma } from "@/lib/prisma";

export const userIsEnrolled = async (courseId: string) => {
  const session = await requireUser();
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId: session.user.id, courseId },
    },
    select: {
      status: true,
    },
  });

  return enrollment?.status === EnrollmentStatus.Active;
};

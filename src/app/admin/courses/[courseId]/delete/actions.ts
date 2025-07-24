"use server";

import { requireAdmin } from "@/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/lib/types";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 10,
  })
);

export const deleteCourse = async (
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

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/admin/courses/");

    return {
      status: "success",
      message: "Course deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete course",
    };
  }
};

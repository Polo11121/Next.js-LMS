"use server";

import { requireAdmin } from "@/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/lib/types";
import { courseSchema, CourseSchema } from "@/lib/zod-schemas";
import { request } from "@arcjet/next";
import arcjet, { fixedWindow } from "@/lib/arcjet";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 10,
  })
);

export const createCourse = async (
  formData: CourseSchema
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

    const validatedData = courseSchema.safeParse(formData);

    if (!validatedData.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    await prisma.course.create({
      data: {
        ...validatedData.data,
        userId: session.user.id,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
};

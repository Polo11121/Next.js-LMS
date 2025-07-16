"use server";

import { requireAdmin } from "@/data/admin/require-admin";
import { Course } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/lib/types";
import { courseSchema, CourseSchema } from "@/lib/zod-schemas";
import { request } from "@arcjet/next";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export const createCourse = async (
  formData: CourseSchema
): Promise<ActionResponse<Course>> => {
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

    const createdCourse = await prisma.course.create({
      data: {
        ...validatedData.data,
        userId: session.user.id,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
      data: createdCourse,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
};

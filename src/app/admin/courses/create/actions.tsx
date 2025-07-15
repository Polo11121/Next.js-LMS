"use server";

import { auth } from "@/lib/auth";
import { Course } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/lib/types";
import { courseSchema, CourseSchema } from "@/lib/zod-schemas";
import { headers } from "next/headers";

export const createCourse = async (
  formData: CourseSchema
): Promise<ActionResponse<Course>> => {
  try {
    const user = await auth.api.getSession({
      headers: await headers(),
    });

    if (!user) {
      return {
        status: "error",
        message: "Unauthorized",
      };
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
        userId: user.user.id,
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

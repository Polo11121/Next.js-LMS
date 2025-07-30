"use server";

import { requireAdmin } from "@/data/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/lib/types";
import { courseSchema, CourseSchema } from "@/lib/zod-schemas";
import { request } from "@arcjet/next";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { stripe } from "@/lib/stripe";

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

    const stripePrice = await stripe.products.create({
      name: validatedData.data.title,
      description: validatedData.data.smallDescription,
      default_price_data: {
        currency: "usd",
        unit_amount: validatedData.data.price * 100,
      },
    });

    await prisma.course.create({
      data: {
        ...validatedData.data,
        userId: session.user.id,
        stripePriceId: stripePrice.id,
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

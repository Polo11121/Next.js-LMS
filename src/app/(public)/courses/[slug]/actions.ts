"use server";

import { requireUser } from "@/data/user/require-user";
import { env } from "@/env";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { EnrollmentStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { ActionResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export const enrollCourse = async (
  courseId: string
): Promise<ActionResponse> => {
  const session = await requireUser();
  let checkoutUrl = null;

  try {
    const req = await request();
    const ajResult = await aj.protect(req, {
      fingerprint: session.user.id as string,
    });

    if (ajResult.isDenied()) {
      if (ajResult.reason.isRateLimit()) {
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
      where: { id: courseId },
      select: {
        price: true,
        id: true,
        title: true,
        slug: true,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    let stripeCustomerId = null;

    const userWithStripeCustomerId = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!userWithStripeCustomerId) {
      return {
        status: "error",
        message: "User not found",
      };
    }

    if (userWithStripeCustomerId.stripeCustomerId) {
      stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
    } else {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: {
          userId: session.user.id,
        },
      });
      stripeCustomerId = stripeCustomer.id;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
        select: {
          status: true,
          id: true,
        },
      });

      if (existingEnrollment?.status === EnrollmentStatus.Active) {
        return {
          status: "error",
          message: "You are already enrolled in this course",
        };
      }

      let enrollment = null;

      if (existingEnrollment) {
        enrollment = await tx.enrollment.update({
          where: {
            id: existingEnrollment.id,
          },
          data: {
            status: EnrollmentStatus.Pending,
            amount: course.price,
          },
        });
      } else {
        enrollment = await tx.enrollment.create({
          data: {
            userId: session.user.id,
            courseId,
            amount: course.price,
          },
        });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [{ price: course.price, quantity: 1 }],
        mode: "payment",
        success_url: `${env.BETTER_AUTH_URL}/profile/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/profile/cancel`,
        metadata: {
          userId: session.user.id,
          courseId,
          enrollmentId: enrollment.id,
        },
      });

      return {
        checkoutUrl: checkoutSession.url,
        enrollment,
      };
    });

    checkoutUrl = result.checkoutUrl;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: "Payment system error. Please try again later.",
      };
    }
    return {
      status: "error",
      message: "Failed to enroll in course",
    };
  }

  if (checkoutUrl) {
    redirect(checkoutUrl);
  }

  return {
    status: "success",
    message: "Course enrolled successfully",
  };
};

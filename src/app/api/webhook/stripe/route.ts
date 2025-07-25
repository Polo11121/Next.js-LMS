import { env } from "@/env";
import { EnrollmentStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export const POST = async (req: Request) => {
  const body = await req.text();

  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return new Response("Webhook failed", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const { customerId, courseId, enrollmentId } = session.metadata as {
      customerId: string;
      courseId: string;
      enrollmentId: string;
    };

    if (!customerId || !courseId || !enrollmentId) {
      return new Response("Invalid metadata", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    await prisma.enrollment.update({
      where: {
        id: enrollmentId,
      },
      data: {
        courseId,
        userId: user.id,
        amount: session.amount_total as number,
        status: EnrollmentStatus.Active,
      },
    });

    return new Response("Enrollment updated", { status: 200 });
  }
};

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { env } from "@/env";
import { emailOTP } from "better-auth/plugins";
import { resend } from "@/lib/resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "MichaelLMS <onboarding@resend.dev>",
          to: [email],
          subject: "MichaelLMS - Verify your email",
          html: `
            <p>Your OTP is <strong>${otp}</strong></p>
          `,
        });
      },
    }),
  ],
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
});

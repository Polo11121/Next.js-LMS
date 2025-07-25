import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BETTER_AUTH_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    DATABASE_URL: z.string().url(),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    ARCJET_API_KEY: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_ENDPOINT_URL_S3: z.string().url(),
    AWS_ENDPOINT_URL_IAM: z.string().url(),
    AWS_REGION: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_PUBLIC_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_S3_BUCKET_NAMES_IMAGES: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_S3_BUCKET_NAMES_IMAGES:
      process.env.NEXT_PUBLIC_S3_BUCKET_NAMES_IMAGES,
  },
});

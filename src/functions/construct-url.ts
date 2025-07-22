import { env } from "@/env";

export const constructUrl = (fileKey: string) =>
  fileKey
    ? `https://${env.NEXT_PUBLIC_S3_BUCKET_NAMES_IMAGES}.t3.storage.dev/${fileKey}`
    : "";

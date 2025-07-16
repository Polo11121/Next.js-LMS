import { env } from "@/env";
import { s3 } from "@/lib/s3-client";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { requireAdmin } from "@/data/admin/require-admin";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  contentType: z.string().min(1, "Content type is required"),
  size: z.number().min(1, "File size is required"),
  isImage: z.boolean(),
});

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
      max: 2,
    })
  );

export const POST = async (request: Request) => {
  const sesssion = await requireAdmin();

  try {
    const result = await aj.protect(request, {
      fingerprint: sesssion?.user.id as string,
    });

    if (result.isDenied()) {
      return NextResponse.json("Blocked", { status: 403 });
    }

    const body = await request.json();
    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json("Invalid request body", { status: 429 });
    }

    const { fileName, contentType, size, isImage } = validation.data;

    const uniqueKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAMES_IMAGES,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: size,
    });

    const presignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 360,
    });

    const response = {
      presignedUrl,
      uniqueKey,
    };

    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json("Internal server error", { status: 500 });
  }
};

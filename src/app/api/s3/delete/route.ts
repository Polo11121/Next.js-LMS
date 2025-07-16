import { env } from "@/env";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { requireAdmin } from "@/data/admin/require-admin";
import { s3 } from "@/lib/s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import * as z from "zod";

const deleteSchema = z.object({
  key: z.string().min(1, "Key is required"),
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
      max: 5,
    })
  );

export async function DELETE(request: Request) {
  const session = await requireAdmin();

  try {
    const result = await aj.protect(request, {
      fingerprint: session?.user.id as string,
    });

    if (result.isDenied()) {
      return NextResponse.json("Blocked", { status: 403 });
    }

    const body = await request.json();

    const validation = deleteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json("Invalid request body", { status: 400 });
    }

    const { key } = validation.data;

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAMES_IMAGES,
      Key: key,
    });

    await s3.send(command);

    return NextResponse.json("File deleted successfully", { status: 200 });
  } catch {
    return NextResponse.json("Internal server error", { status: 500 });
  }
}

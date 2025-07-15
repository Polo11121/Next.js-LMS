import { env } from "@/env";
import { s3 } from "@/lib/s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import * as z from "zod";

const deleteSchema = z.object({
  key: z.string().min(1, "Key is required"),
});

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const validation = deleteSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Invalid request body", { status: 400 });
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

import { S3 } from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const uploadSchema = z.object({
    fileName: z.string(),
    contentType: z.string(),
    size: z.number(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const validated = uploadSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({error: "Invalid request data"}, { status: 400 });
        }

        const { fileName, contentType, size } = validated.data;

        const uniquekey = `${uuidv4() }-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: uniquekey,
            ContentType: contentType,
            ContentLength: size,
        });

        const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
        const response = { presignedUrl, key: uniquekey };

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        return NextResponse.json({error: error instanceof Error ? error.message : "Upload failed"}, { status: 500 });
    }
}
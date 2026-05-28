import { S3 } from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getUserFromToken } from "@/lib/auth";
import { eventLog } from "@/lib/logs/logEvent";

const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const allowedExts = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];

const uploadSchema = z.object({
    fileName: z.string(),
    contentType: z.string(),
    size: z.number().positive().max(1024 * 1024 * 5 + 28),
});

export async function POST(req: Request) {
    try {
        const user = await getUserFromToken();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized. Please sign in to upload files." }, { status: 401 });
        }

        const body = await req.json();

        const validated = uploadSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({error: "Invalid request data"}, { status: 400 });
        }

        const { fileName, contentType, size } = validated.data;
        const lowerName = fileName.toLowerCase();
        const isAllowed = allowedTypes.has(contentType) && allowedExts.some(ext => lowerName.endsWith(ext));

        if (!isAllowed || lowerName.endsWith(".zip")) {
            await eventLog(Number(user.id), "Suspicious Upload Attempt");
            return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
        }

        const uniquekey = `${uuidv4() }-${fileName}.enc`;

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: uniquekey,
            ContentType: "application/octet-stream",
            ContentLength: size,
        });

        const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
        const response = { presignedUrl, key: uniquekey };

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        return NextResponse.json({error: error instanceof Error ? error.message : "Upload failed"}, { status: 500 });
    }
}
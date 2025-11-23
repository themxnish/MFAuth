import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eventLog } from "@/lib/logs/logEvent";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
    const body = await req.json();
    const { incidentType, location, datetime, description, evidenceUrls, comments } = body;
    try {
        const data = await getUserFromToken();
        if (!data) {
            return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
        }
    
        const user = await db.user.findUnique({ 
            where: { username: data.username }
        });
    
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if( !incidentType || !location || !datetime || !description) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const isoDatetime = new Date(datetime).toISOString();

        const existingSubmission = await db.evidence.findFirst({
            where: {
                location,
                datetime: isoDatetime,
            },
        });

        if (existingSubmission) {
            return NextResponse.json({ message: "Submission already exists at this location and time" }, { status: 400 });
        }

        const newSubmission = await db.evidence.create({
            data: {
                incidentType,
                location,
                datetime: isoDatetime,
                description,
                evidenceUrls: [...evidenceUrls],
                comments,
                userId: user.id,
            },
        });

        await eventLog(user.id, "Evidence Submitted");
        return NextResponse.json({ message: "Submission created successfully", submission: newSubmission }, { status: 201 });
    } catch (error) {
        console.error("Error signing in user:", error);
        return NextResponse.json({ message: "Failed to process request" }, { status: 500 });
    }
}
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ip = searchParams.get("ip")?.trim();

    if (!ip) {
        return NextResponse.json({ message: "IP address is required to check it's reputation" }, { status: 400 });
    }

    const apiKey = process.env.ABUSEIPDB_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ message: "IP reputation service is not configured" }, { status: 500 });
    }
    
    try {
        const response = await fetch(
            `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90`,
            {
                headers: {
                    Key: apiKey,
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            return NextResponse.json({ message: "Failed to check IP reputation" }, { status: 500 });
        }

        const data = await response.json();
        return NextResponse.json({ data }, { status: 200 });
    } 
    catch (error) {
        console.error("Error checking IP reputation:", error);
        return NextResponse.json({ message: "Failed to check IP reputation" }, { status: 500 });
    }
}
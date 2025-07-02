import { NextResponse } from "next/server";
import { emailExporter } from "@/lib/mail/otp";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
    const body = await req.json();
    const { email } = body;

    const user = await getUserFromToken();
    if (!user) {
        return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
    }

    const plainOtp = Math.floor(1000 + Math.random() * 9000).toString(); 
    const expiry = new Date(Date.now() + 3 * 60 * 1000);

    const salt = await bcrypt.genSalt(5);
    const hashedOtp = await bcrypt.hash(plainOtp, salt);

    if (!email) {
        return NextResponse.json({ message: "Email address is required" }, { status: 400 });
    } else if (email !== user.email) {
        return NextResponse.json({ message: "Invalid email address, try again" }, { status: 400 });
    }

    try {
        await db.user.update({
            where: { email },
            data: {
                otp: hashedOtp,
                otpExpiry: expiry,
                isVerified: false,
            },
        })
        await emailExporter(email, plainOtp);

        return NextResponse.json({ message: "Verification mail sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error sending verification email:", error);
        return NextResponse.json({ message: "Failed to process request" }, { status: 500 });
    }
}
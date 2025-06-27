import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        const user = await db.user.findUnique({
            where: { email },
        });
        if (!user) {
            return NextResponse.json({ user: null, message: "user with this email does not exist" }, { status: 404 });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            return NextResponse.json({ user: null, message: "incorrect password, please try again" }, { status: 401 });
        }

        const tokenData = {
            id: user.id,
            email: user.email,
            username: user.username,
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET as string, { expiresIn: "1d" });

        const response = NextResponse.json({
            message: "user signed in successfully",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
        })

        return response;
    } catch (error) {
        console.error("Error signing in user:", error);
        return NextResponse.json({ message: "Failed to process request" }, { status: 500 });
    }
}
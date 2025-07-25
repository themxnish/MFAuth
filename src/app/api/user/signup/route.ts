import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { NextResponse } from "next/server";
import { authLog } from "@/lib/logs/logUserAuth";

const inputSchema = z.object({ 
    username: z.string().min(3, "username is too short").max(100),
    email: z.string().min(3, "email is too short").email("invalid email format"),
    password: z.string().min(1, "password is required").min(8, "password must have 8 characters"),
})

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, email, password } = inputSchema.parse(body);

        const existingEmailUser = await db.user.findUnique({
            where: { email: email }
        });
        if (existingEmailUser) {
            return NextResponse.json({user: null, message: "user with this email already exists"}, { status: 409 });
        }

        const existingUserName = await db.user.findUnique({
            where: { username: username }
        });
        if (existingUserName) {
            return NextResponse.json({user: null, message: "user with this username already exists"}, { status: 409 });
        }

        const validPassword = (password: string) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+{};:,<.>]).{8,}$/;
            // ensures password is complex
            return passwordRegex.test(password);
            };
            if (!validPassword(password)) {return NextResponse.json({user: null, message: "password must be at least 8 characters long, contain uppercase, lowercase, number, and special character.",}, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword
            }
        })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: newUserPassword, ...rest } = newUser;

        await authLog(newUser.id, "User Created");

        return NextResponse.json({ user: rest, message: "user created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Failed to process request -" + error }, { status: 500 });  
    }
}
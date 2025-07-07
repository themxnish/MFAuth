import { NextResponse } from "next/server";
import { resetExporter } from "@/lib/mail/reset";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(rawToken, 10);
  const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

  if(!email) {
    return NextResponse.json({ message: "Email address is required" }, { status: 400 });
  } else if (email !== user.email) {
    return NextResponse.json({ message: "Invalid email address, try again" }, { status: 400 });
  }

  try {
    await db.user.update({
      where: { email },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: tokenExpiry,
      },
    });

    await resetExporter(email, rawToken);
    return NextResponse.json({ message: "Password reset email sent" }, { status: 200 });
  } catch (error) {
    console.error("Error sending reset email:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

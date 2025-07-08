import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { newPassword, token } = body;

    const usersWithResetTokens = await db.user.findMany({
      where: { resetToken: { not: null } }
    });

    let user = null;
    for (const data of usersWithResetTokens) {
      const isValidToken = await bcrypt.compare(token, data.resetToken || '');
      if (isValidToken) {
        user = data;
        break;
      } 
    } 
    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
    } 

    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
      return NextResponse.json({ message: "New password cannot be same as old password" }, { status: 400 });
    }
    const validPassword = (password: string) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+{};:,<.>]).{8,}$/;
      return passwordRegex.test(password);
      };
      if (!validPassword(newPassword)) {return NextResponse.json({message: "password must be at least 8 characters long, contain uppercase, lowercase, number, and special character.",}, { status: 400 });
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const validExpiry = user.resetTokenExpiry > new Date();
    if (!validExpiry) {
      return NextResponse.json({ message: "Token has expired" }, { status: 400 });
    }

    await db.user.update({
      where: { email: user.email },
      data: {
        password: newHashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    const response = NextResponse.json({ message: "Password reset successful, login again" }, { status: 200 });
    response.cookies.set('token', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      expires: new Date(0)
    });

    return response;

  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
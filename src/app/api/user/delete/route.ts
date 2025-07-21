import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";

export async function DELETE(req: Request) {
    const body = await req.json();
    const { username } = body;
    
    const sessionUser = await getUserFromToken();
    if (!sessionUser) {
        return NextResponse.json({ message: "Unauthorized session" }, { status: 401 });
    }

    if (sessionUser.username !== username) {
        return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { username } });
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await db.account.deleteMany({ where: { userId: user.id } });
    await db.user.delete({ where: { username } });

    const response = NextResponse.json({ message: "User deleted successfully:(" }, { status: 200 });
    response.cookies.set('token', '', { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 0, expires: new Date(0) });

    return response;
}   
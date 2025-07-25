import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function GET() {
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  } else if (!user.id) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const logs = await db.log.findMany(
    {
        where: { userId: Number(user.id) },
        orderBy: { loggedAt: "desc" },
        take: 12
    }); 
  return NextResponse.json({ logs });
}
  
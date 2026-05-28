import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function GET() {
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json({ message: "You must be logged in to view your activity" }, { status: 401 });
  } else if (!user.id) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const logs = await db.log.findMany(
    {
        where: { userId: Number(user.id) },        orderBy: { loggedAt: "desc" }
    }); 
  return NextResponse.json({ logs });
}

export async function DELETE(req: Request) {
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json({ message: "You must be logged in to delete your activity" }, { status: 401 });
  } else if (!user.id) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const logId = body?.logId ? Number(body.logId) : null;

  if (logId && Number.isNaN(logId)) {
    return NextResponse.json({ message: "Invalid activity log" }, { status: 400 });
  }

  const result = await db.log.deleteMany({
    where: logId
      ? { id: logId, userId: Number(user.id) }
      : { userId: Number(user.id) },
  });

  if (logId && result.count === 0) {
    return NextResponse.json({ message: "Activity log not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: logId ? "Activity log deleted" : "Activity logs deleted",
    deletedCount: result.count,
  });
}
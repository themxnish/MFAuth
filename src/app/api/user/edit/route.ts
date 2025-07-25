import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import { eventLog } from "@/lib/logs/logEvent";

export async function PATCH(req: Request) {
    const body = await req.json();

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

    if(body.name === user.name && body.bio === user.bio) {
        return NextResponse.json({ message: "Nothing to update" }, { status: 400 });
    }

    if(body.bio.length >= 100) {
        return NextResponse.json({ message: "Bio must be less than 100 characters" }, { status: 400 });
    } else if(!body.name || !body.bio) {
        return NextResponse.json({ message: "Name and bio are empty" }, { status: 400 });
    }
    
    const updatedUser = await db.user.update({
      where: { username: user.username },
      data: {
        name: body.name,
        bio: body.bio
       },
    });

    await eventLog(user.id, "Profile Updated");

    return NextResponse.json({ message: "User updated successfully", user: updatedUser }, { status: 200 });
}
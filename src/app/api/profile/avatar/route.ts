import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { avatarPresets } from '@/lib/avatarPresets';

export async function PATCH(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
    }

    const body = await req.json();
    const { avatar } = body;

    const isValidPreset = avatarPresets.some(
      (preset) => JSON.stringify(preset) === JSON.stringify(avatar)
    );

    if (!avatar || !isValidPreset) {
      return NextResponse.json({ message: 'Invalid avatar' }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { username: user.username },
      data: { avatar },
    });

    return NextResponse.json({ message: 'Avatar updated successfully', user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error adding avatar:', error);
    return NextResponse.json({ message: 'Failed to add avatar' }, { status: 500 });
  }
}

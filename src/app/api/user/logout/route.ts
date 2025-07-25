import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { eventLog } from '@/lib/logs/logEvent';

export async function POST() {
    try {
        const user = await getUserFromToken();
        if(user){
            await eventLog(Number(user.id), 'Logged Out');
        } else if(!user) {
            return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
        }

        const response = NextResponse.json({ message: "Logout successful" });
        response.cookies.set('token', '', {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 0,
            expires: new Date(0)
        });
        return response;
    } catch (error) {
        console.error('Error logging out:', error);
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}
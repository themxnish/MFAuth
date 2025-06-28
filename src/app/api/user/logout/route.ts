import { NextResponse } from 'next/server';

export async function POST() {
    try {
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
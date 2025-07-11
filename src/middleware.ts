import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/register' || path === '/login';
    const isEmailPath = path === '/verify-email';
    const isResetPath = path === '/reset-password';

    const token = request.cookies.get('token')?.value || '';

    if(isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    } else if (!isPublicPath && !token && !isResetPath) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    if (path.startsWith('/profile/')) {
        const username = path.split('/')[2]; 
        try {
            const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!);
            const { payload } = await jwtVerify(token, secret);
            if (payload.username !== username) {
                return NextResponse.redirect(new URL('/unauthorized', request.nextUrl));
            }
        } catch (error) {
            console.error('Error processing profile request:', error);
            return NextResponse.redirect(new URL('/login', request.nextUrl));
        }
    }

    if (isEmailPath && token) {
        try{
            const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!);
            const { payload } = await jwtVerify(token, secret);
            const verified = true;
            
            if (payload.isVerified === verified) {
                return NextResponse.redirect(new URL('/', request.nextUrl));
            }
        } catch (error) {
            console.error('Error processing email verification request:', error);
            return NextResponse.redirect(new URL('/login', request.nextUrl));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/register',
        '/login',
        '/profile/:path*',
        '/unauthorized',
        '/verify-email',
        '/reset-password',
    ],
};
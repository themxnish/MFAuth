import { NextResponse } from 'next/server';

export async function GET() {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const REDIRECT_URI = encodeURIComponent(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/google/callback`
  );

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid email profile`;

  return NextResponse.redirect(googleAuthUrl);
}

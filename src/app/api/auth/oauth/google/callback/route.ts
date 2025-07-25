import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { authLog } from '@/lib/logs/logUserAuth';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'No code was provided' }, { status: 400 });

  const accessToken = await getAccessToken(code);
  if (!accessToken) return NextResponse.json({ error: 'Token exchange failed' }, { status: 401 });

  const profile = await getProfile(accessToken);

  const user = await findOrCreateUser(profile, accessToken);

  const token = jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    isVerified: user.isVerified,
  }, process.env.TOKEN_SECRET as string, { expiresIn: '1d' });

  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/profile/${user.username}`);
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  await authLog(user.id, 'Google OAuth Login');

  return response;
}

// Exchange the code for an access token
async function getAccessToken(code: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/google/callback`,
      grant_type: 'authorization_code',
    }),
  });

  const data = await response.json();
  console.log('Google token response:', data.access_token);
  
  return data.access_token;
}

async function getProfile(token: string) {
  const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await profileResponse.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function findOrCreateUser(profile: any, accessToken: string) {
  const existingAccount = await db.account.findFirst({
    where: {
      provider: 'google',
      providerAccountId: profile.id.toString(),
    },
    include: { user: true },
  });

  if (existingAccount) return existingAccount.user;

  const email = profile.email ?? `${profile.id}@google.local`;
  let user = await db.user.findUnique({ where: { email } });

  if (!user) {
    user = await db.user.create({
      data: {
        email,
        username: profile.email?.split('@')[0] || `google-user${profile.id}`,
        password: '',
        isVerified: true,
      },
    });
  }

  await db.account.create({
    data: {
      provider: 'google',
      providerAccountId: profile.id.toString(),
      accessToken,
      userId: user.id,
      tokenType: 'Bearer',
      scope: '',
    },
  });

  return user;
}

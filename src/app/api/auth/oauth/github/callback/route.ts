import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ message: 'No code was provided' }, { status: 400 });
  }

  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

  // Exchange the code for an access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();
  console.log('GitHub token response:', tokenData);

  const accessToken = tokenData.access_token;
  if (!accessToken) {
    return NextResponse.json({ message: 'Token exchange failed' }, { status: 401 });
  }

  // Fetch the user's GitHub profile
  const profileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const profile = await profileResponse.json();

  const existingAccount = await db.account.findFirst({
    where: {
      provider: 'github',
      providerAccountId: profile.id.toString(),
    },
    include: { user: true },
  });

  let user;

  if (existingAccount) {
    user = existingAccount.user;
  } else {
    const email = profile.email ?? `${profile.id}@github.local`;
    user = await db.user.findUnique({ where: { email } });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          username: profile.login,
          password: '',
          isVerified: true,
        },
      });
    }

    await db.account.create({
      data: {
        provider: 'github',
        providerAccountId: profile.id.toString(),
        accessToken,
        userId: user.id,
        tokenType: 'Bearer',
        scope: 'read:user user:email',
      },
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      bio: user.bio,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      isVerified: user.isVerified,
    },
    process.env.TOKEN_SECRET as string,
    { expiresIn: '1d' }
  );

  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/profile/${user.username}`);
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, 
  });

  return response;
}

import { NextResponse } from 'next/server';

export async function GET() {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
  const REDIRECT_URI = encodeURIComponent(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/github/callback`
  );

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=read:user user:email`;

  return NextResponse.redirect(githubAuthUrl);
}

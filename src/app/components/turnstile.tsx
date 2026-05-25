'use client';

import { Turnstile } from "react-turnstile";

interface Props {
  onVerify: (token: string) => void;
}

export default function TurnstileWidget({ onVerify }: Props) {
  return (
    <Turnstile
      sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onVerify={(token) => {
        onVerify(token);
      }}
    />
  );
}
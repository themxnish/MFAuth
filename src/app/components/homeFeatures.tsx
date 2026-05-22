'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, CheckCircle2, FileUp, ShieldCheck } from "lucide-react";

export default function HomeFeatures() {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      const response = await fetch('/api/user/session');
      const data = await response.json();
      setVerified(Boolean(data?.user?.isVerified));
    };
    checkVerification();
  }, []);

  const features = [
    { href: '/verify-email', icon: verified ? CheckCircle2 : ShieldCheck, title: 'Verify Identity', text: verified ? 'Your email is verified and identity is secured.' : 'Secure your account with email verification.', active: verified },
    { href: '/submit', icon: FileUp, title: 'Submit Evidence', text: 'Upload incident details and files safely.' },
    { href: '/activity', icon: Activity, title: 'Activity Logs', text: 'Review sign-ins and account activity.' },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
      {features.map(({ href, icon: Icon, title, text, active }) => (
        <Link key={href} href={href} className={`group flex flex-col items-center rounded-2xl border p-5 text-center shadow-2xl shadow-black/20 hover:-translate-y-1 ${active ? 'border-emerald-300/40 bg-emerald-300/10' : 'border-white/10 bg-white/[0.06] hover:border-emerald-300/40 hover:bg-white/[0.09]'}`}>
          <div className='mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-300/20'>
            <Icon className='h-5 w-5' />
          </div>
          <h2 className='text-lg font-semibold text-white'>{title}</h2>
          <p className='mt-1 text-sm leading-6 text-gray-400'>{text}</p>
        </Link>
      ))}
    </div>
  );
}

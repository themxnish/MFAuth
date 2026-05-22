'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Verify() {
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const response = await fetch('/api/user/session');
        const data = await response.json();
        const verifedUser = data?.user?.isVerified;

        setVerified(verifedUser);
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    checkVerification();
  }, []);
  
  if (verified === null) return null;
  if (verified === true) return (
    <div className='w-full px-4 py-3 flex items-center justify-between rounded-2xl border border-emerald-300/30 bg-emerald-300/10 shadow-xl shadow-black/20 text-emerald-50'>
      <div className='flex items-center gap-2'>
        <CheckCircle2 className='w-5 h-5 text-emerald-300' />
        <p className='text-sm font-medium'>Email verified and identity secured</p>
      </div>
    </div>
  );

  return (
    <Link href='/verify-email' className='w-full px-4 py-3 flex items-center justify-between rounded-2xl border border-amber-300/30 bg-amber-300/10 shadow-xl shadow-black/20 text-amber-50 hover:bg-amber-300/15'>
      <div className='flex items-center gap-2'>
        <AlertCircle className='w-5 h-5 text-amber-300' />
        <p className='text-sm font-medium'>Please verify your email</p>
      </div>
      <ArrowRight className='w-5 h-5 text-amber-100' />
    </Link>
  );
}

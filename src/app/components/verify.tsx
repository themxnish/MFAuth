'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
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
  if (verified === true) return null;

  return (
    <Link href='/verify-email' className='w-full px-4 py-3 mt-8 flex items-center justify-between bg-gray-300 rounded-lg shadow-md text-black'>
      <div className='flex items-center gap-2'>
        <AlertCircle className='w-5 h-5 text-red-500' />
        <p className='text-sm font-medium'>Please verify your email</p>
      </div>
      <ArrowRight className='w-5 h-5 text-dark' />
    </Link>
  );
}

'use client';

import { useState } from 'react';
import { MailOpen, KeySquare, MoveRight, CheckCircle, CheckCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
  const [ email, setEmail ] = useState('');
  const [ page, setPage ] = useState<'email' | 'otp' | 'verified'>('email');
  
  const [ otpInput, setOtpInput ] = useState(['', '', '', '']);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;// allow only numbers

    const newOtpInput = [...otpInput];
    newOtpInput[index] = value;
    setOtpInput(newOtpInput);
  }

  const verified = async () => {
    redirect('/');
  }

  const sendOTP = async () => {
    const response = await fetch('/api/user/verification/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if(response.ok){
      setPage('otp');
      toast.success('OTP has been sent successfully, check your inbox');
    } else {
      const { message } = await response.json();
      toast.error(message);
    }
  }

   const verifyOTP = async () => {
    const response = await fetch('/api/user/verification/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp: otpInput.join('') }),
    });

    if(response.ok){
      setPage('verified');
      toast.success('Email verified successfully');
    } else {
      const { message } = await response.json();
      toast.error(message);
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 py-10'>
      <div className='max-w-md w-full px-6 py-10 rounded-3xl border border-white/10 bg-zinc-950/70 text-white shadow-2xl shadow-black/30 backdrop-blur'>
        <h1 className='text-3xl font-black text-center'>Email Verification</h1>
        <p className='text-sm text-gray-400 mb-4 text-center'>Confirm your identity for <strong>secured access</strong>.</p>
        
        {page === 'email' &&
          <div className='flex flex-col items-center justify-center gap-4'>
            <MailOpen className='w-16 h-16 text-emerald-300 mt-6' />
            <p className='text-md text-center text-gray-300'>Please enter your email address to receive a 4-digit code</p>
            <input className='text-white text-md w-full px-4 py-3 border border-white/10 bg-white/[0.07] shadow-xl rounded-xl focus:ring-2 focus:ring-emerald-300/50' type='email' name='email' placeholder='abc@gmail.com' value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className='bg-emerald-400 text-zinc-950 w-1/2 py-3 px-4 rounded-full shadow-xl mt-4 hover:bg-emerald-300 cursor-pointer' onClick={sendOTP}>
              <MoveRight className='w-6 h-6 inline-block' />
            </button>
          </div>
        }

        {page === 'otp' &&
          <div className='flex flex-col items-center justify-center gap-4'>
            <KeySquare className='w-16 h-16 text-emerald-300 mt-6'/>
            <div className='text-center'>
              <p className='text-md text-gray-300'>Code has been sent to:</p>
              <strong className='text-md text-white'>{email}</strong>
            </div>
            <div className='flex gap-4'>
              {otpInput.map((value, index) => (
                <input key={index} className='text-center font-bold text-white text-xl w-12 px-4 py-3 border border-white/10 bg-white/[0.07] shadow-xl rounded-xl focus:ring-2 focus:ring-emerald-300/50' type='text' inputMode='numeric' maxLength={1} value={value} onChange={(e) => handleOtpChange(index, e.target.value)} />
              ))}
            </div>
            <p className='text-sm text-gray-400'>The OTP expires in next 3 minutes</p>
            <button className='bg-emerald-400 text-zinc-950 font-bold w-1/2 py-3 px-4 rounded-full shadow-xl mt-6 hover:bg-emerald-300 cursor-pointer' onClick={verifyOTP}>Verify</button>
            <p className='text-sm text-gray-400'>Did not receive the code? <span className='text-emerald-300 cursor-pointer' onClick={() => { setPage('email'); setOtpInput(['', '', '', ''])}}>Resend</span></p>
          </div>
        }

        {page === 'verified' && 
          <div className='flex flex-col items-center justify-center gap-4'>
            <CheckCircle className='w-16 h-16 text-green-400 mt-6' />
            <p className='text-md text-center text-gray-300'>Your email has been verified successfully</p>
            <button className='bg-emerald-400 text-zinc-950 w-1/2 py-3 px-4 rounded-full shadow-xl mt-6 hover:bg-emerald-300 cursor-pointer' onClick={verified}>
              <CheckCheck className='w-6 h-6 inline-block' />
            </button>
          </div>
        }
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from "react";
import { MoveRight, RotateCcwKey, Key, CheckCircle, CheckCheck, Eye, EyeOff } from 'lucide-react';
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
    const [ page, setPage ] = useState<'forgot' | 'reset' | 'done'>('forgot');
    const [ sending, setSending ] = useState(false);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ showPassword, setShowPassword ] = useState(false);
    const [ token, setToken ] = useState('');
    const router = useRouter();

    useEffect(() => {
        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');
        if (token) {
            setToken(token);
            setPage('reset');
        } else {
            setPage('forgot');
        }
    }, []);

    const forgot = async () => {
        setSending(true);
        const response = await fetch('/api/user/password/forgot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        setSending(false);
        
        if(response.ok) {
            toast.success('Password reset link has been sent to your email');
        } else {
            const { message } = await response.json();
            toast.error(message);
        }
    }

    const reset = async () => {
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        
        const response = await fetch('/api/user/password/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newPassword: password, token }),
        });

        if(response.ok) {
            toast.success('Password reset successfully');
            setPage('done');
        } else {
            const { message } = await response.json();
            toast.error(message);
        }
    }

    const complete = async () => {
        const response = await fetch('/api/user/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        toast.success('User logged out, login with your new password');
        router.push('/login');
      } else {
        toast.error('Logout failed');
      }
    }
    return (
        <div className='min-h-screen flex flex-col items-center justify-center px-4'>
            <div className='max-w-md w-full px-6 py-10 bg-[#3B3B3C] text-white shadow-xl rounded-xl'>
                <h1 className='text-2xl font-bold text-center'>Reset Password</h1>
                <p className='text-sm text-gray-400 mb-4 text-center'>Forgot your password? No problem.</p>

                {page === 'forgot' && (
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <RotateCcwKey className='w-18 h-18 text-gray-300 mt-6' />
                        <p className='text-md text-gray-300'>Enter your email address below to receive a link to reset your password.</p>
                        <input className='text-white text-md w-full px-4 py-3 bg-[#4B4B4B] shadow-xl rounded-lg' type='email' name='email' placeholder='abc@gmail.com' value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <button className='bg-[#4B4B4B] text-white w-1/2 py-3 px-4 rounded-full shadow-xl mt-4 hover:scale-105 cursor-pointer' onClick={forgot} disabled={sending}>
                            {sending ? (
                                <span className='text-sm font-bold'>Sending...</span>
                            ) : (
                                <>
                                <MoveRight className='w-6 h-6 inline-block' />
                                </>
                            )}
                        </button>
                    </div>
                )}

                {page === 'reset' && token && (
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <Key className='w-18 h-18 text-yellow-300 mt-6' />
                        <p className='text-md text-gray-300'>Enter your new password below:</p>
                        <div className='relative w-full'>
                            <input className='text-white text-md w-full px-4 py-3 bg-[#4B4B4B] shadow-xl rounded-lg' type={showPassword ? 'text' : 'password'} name='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <button type='button' onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none'>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className='relative w-full'>
                            <input className='text-white text-md w-full px-4 py-3 bg-[#4B4B4B] shadow-xl rounded-lg'  type={showPassword ? 'text' : 'password'} name='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                            <button type='button' onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none'>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button className='bg-[#4B4B4B] text-white w-1/2 py-3 px-4 rounded-full shadow-xl mt-4 hover:scale-105 cursor-pointer' onClick={reset}>Reset Password</button>
                        <p className='text-sm text-gray-400'>This link is only valid 15 minutes...</p>
                    </div>
                )}

                {page === 'done' && (
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <CheckCircle className='w-16 h-16 text-green-400 mt-6' />
                        <p className='text-md text-gray-300'>Your password has been changed successfully</p>
                        <button className='bg-[#4B4B4B] text-sky-400 w-1/2 py-3 px-4 rounded-full shadow-xl mt-6 hover:scale-105 cursor-pointer' onClick={complete}>
                            <CheckCheck className='w-6 h-6 inline-block' />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck, UserPlus } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import toast from 'react-hot-toast';
import TurnstileWidget from '../components/turnstile';

export default function Register() {
    const [user, setUser] = React.useState({
        username: '',
        email: '',
        password: '',
    });
    const [ showPassword, setShowPassword ] = React.useState(false);
    const [ captchaToken, setCaptchaToken ] = React.useState('');
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!captchaToken) {
            toast.error('Please complete the captcha');
            return;
        }
        try {
            const response = await fetch('/api/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    captchaToken,
                }),
            })

            if(response.ok) {
                toast.success('User registered successfully');
                router.push('/login');
            } else {
                const { message } = await response.json();
                if ( message === 'user with this email already exists' || message === 'user with this username already exists' ) {
                    toast.error(message);
                } else if (message === 'password must be at least 8 characters long, contain uppercase, lowercase, number, and special character.') {
                    toast.error('Your password is not strong enough')
                }
                 else {
                    toast.error('Failed to register user');
                }
            }
        } catch (error) {
            toast.error('An error occurred while registering user');
            console.error('Error during registration:', error);   
        }
    }

    return (
        <div className='flex items-center justify-center px-4 py-5'>
            <div className='w-full max-w-xl rounded-3xl border border-white/10 bg-zinc-950/70 p-6 text-white shadow-2xl shadow-black/30 backdrop-blur sm:p-8'>
                <div className='mb-3 flex flex-col items-center text-center'>
                    <div className='mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-300/20'>
                        <ShieldCheck className='h-5 w-5' />
                    </div>
                    <p className='text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300'>Secure signup</p>
                    <h1 className='mt-2 text-3xl font-black tracking-tight text-white'>Signup to MFauth</h1>
                    <p className='mt-1 text-sm leading-6 text-gray-400'>Create your protected workspace account.</p>
                </div>

                <form onSubmit={onSubmit} className='space-y-4'>
                    <label className='block'>
                        <span className='text-sm font-medium text-gray-300'>Username</span>
                        <input className='mt-1 w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-300/50' type='text' name='username' placeholder='Username' value={user.username} onChange={e => setUser({ ...user, username: e.target.value })} />
                    </label>

                    <label className='block'>
                        <span className='text-sm font-medium text-gray-300'>Email</span>
                        <input className='mt-1 w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-300/50' type='email' name='email' placeholder='abc@gmail.com' value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />
                    </label>

                    <label className='block'>
                        <span className='text-sm font-medium text-gray-300'>Password</span>
                        <div className='relative mt-1'>
                            <input className='w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 pr-11 text-sm text-white placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-300/50' type={showPassword ? 'text' : 'password'} name='password' placeholder='Password' value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} />
                            <button type='button' onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none'>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </label>
                    
                    <div className='mt-3 flex items-center justify-center'>
                        <TurnstileWidget onVerify={(token: string) => setCaptchaToken(token)} />
                    </div>

                    <button className='flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 font-bold text-zinc-950 hover:bg-emerald-300' type="submit">
                        <UserPlus className='h-4 w-4' />
                        Signup
                    </button>
                </form>

                <div className='my-6 flex items-center'>
                    <hr className='flex-grow border-white/10' />
                    <span className='px-4 text-sm text-gray-500 whitespace-nowrap'>
                        Or register with
                    </span>
                    <hr className='flex-grow border-white/10' />
                </div>

                <div className='grid gap-2 sm:grid-cols-2'>
                    <a href="/api/auth/oauth/github/login" className='flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 font-semibold text-white shadow-xl hover:bg-white/[0.1]'>
                        <FaGithub size={22} />
                        <span>GitHub</span>
                    </a>

                    <a href="/api/auth/oauth/google/login" className='flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 font-semibold text-white shadow-xl hover:bg-white/[0.1]'>
                        <FcGoogle size={22} />
                        <span>Google</span>
                    </a>
                </div>

                <p className='mt-5 text-center text-sm text-gray-400'>
                    Already have an account?{' '}
                    <Link className='font-semibold text-emerald-300 hover:text-emerald-200' href="/login">Login</Link>
                </p>

                <p className='mt-4 text-center text-xs leading-5 text-gray-500'>
                    By signing up, you agree to our{' '}
                    <Link className='text-gray-300 hover:text-white' href="/terms">Terms of Service</Link> 
                    {' '}and{' '} 
                    <Link className='text-gray-300 hover:text-white' href="/privacy">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    )
}


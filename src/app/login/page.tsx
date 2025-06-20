'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Login() {
    const [user, setUser] = React.useState({
        email: '',
        password: '',
    });
    const [ showPassword, setShowPassword ] = React.useState(false);
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Login successful');
                router.push('/');
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            toast.error('An error occurred while logging in');
            console.error('Error during login:', error);
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center px-4'>
            <div className='text-white w-full max-w-md p-8'>
                <h1 className='text-3xl font-bold mt-2 mb-10 text-center'>Login to MFauth</h1>
                <form onSubmit={onSubmit} className='space-y-4'>
                    <input className='w-full px-4 py-3 bg-[#2a2a2a] rounded-md focus:outline-auto focus:ring-2 focus:ring-white' type='email' name='email' placeholder='Email' value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />

                    <div className='relative'>
                        <input className='w-full px-4 py-3 bg-[#2a2a2a] rounded-md focus:outline-auto focus:ring-2 focus:ring-white' type={showPassword ? 'text' : 'password'} name='password' placeholder='Password' value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} />
                        <button type='button' onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none'>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <p className='text-sm text-right text-gray-500 hover:text-white mt-1'>
                        <Link href="/reset">Forgot your password?</Link>
                    </p>
                    
                    <button className='w-full px-4 py-3 bg-gray-200 text-black font-medium rounded-md hover:bg-white mt-8' type="submit">Login</button>
                </form>

                <p className='text-sm text-center text-gray-500 mt-4 mb-3'>
                    Don&apos;t have an account?{' '}
                    <Link className='text-white underline' href="/register">Signup  </Link>
                </p>

                <p className='text-xs text-center text-gray-500 mt-4'>
                    By signing up, you agree to our {' '}
                    <Link className='text-white underline' href="/terms"> Terms of Service</Link> 
                    {' '} and {' '} 
                    <Link className='text-white underline' href="/privacy"> Privacy Policy</Link>.
                </p>
            </div>
        </div>
    )
}


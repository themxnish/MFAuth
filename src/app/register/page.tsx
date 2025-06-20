'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Register() {
    const [user, setUser] = React.useState({
        username: '',
        email: '',
        password: '',
    });
    const [ showPassword, setShowPassword ] = React.useState(false);
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
        <div className='min-h-screen flex items-center justify-center px-4'>
            <div className='text-white w-full max-w-md p-8'>
                <h1 className='text-3xl font-bold mt-2 mb-10 text-center'>Signup to MFauth</h1>
                <form onSubmit={onSubmit} className='space-y-4'>
                    <input className='w-full px-4 py-3 bg-[#2a2a2a] rounded-md focus:outline-auto focus:ring-2 focus:ring-white' type='text' name='username' placeholder='Username' value={user.username} onChange={e => setUser({ ...user, username: e.target.value })} />
                    <input className='w-full px-4 py-3 bg-[#2a2a2a] rounded-md focus:outline-auto focus:ring-2 focus:ring-white' type='email' name='email' placeholder='Email' value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />

                    <div className='relative'>
                        <input className='w-full px-4 py-3 bg-[#2a2a2a] rounded-md focus:outline-auto focus:ring-2 focus:ring-white' type={showPassword ? 'text' : 'password'} name='password' placeholder='Password' value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} />
                        <button type='button' onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none'>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    
                    <button className='w-full px-4 py-3 bg-gray-200 text-black font-medium rounded-md hover:bg-white mt-8' type="submit">Signup</button>
                </form>

                <p className='text-sm text-center text-gray-500 mt-4 mb-3'>
                    Already have an account?{' '}
                    <Link className='text-white underline' href="/login">Login</Link>
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


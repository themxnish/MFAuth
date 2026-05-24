'use client'
import React, { useState, useEffect } from "react";
export default function WelcomeText() {
    const [ username, setUsername ] = useState('');

    useEffect(() => {
        const getUsername = async() => {
            const response = await fetch('/api/user/session', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setUsername('');
            if (response.ok) {
                const data = await response.json();
                if (data.user && data.user.username) {
                    setUsername(data.user.username);
                }
            }
            return null;
        }
        getUsername();
    }, [])
    return (
        <div className='py-10 flex flex-col items-center text-center'>
            <div className='w-full max-w-3xl'>
                <p className='text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300'>Secure workspace</p>
                <h1 className='mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl'>Welcome, {username || 'there'}!</h1>
                <p className='mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-400'>Protect messages, submit evidence, verify your account, and review activity from one focused dashboard.</p>
            </div>
        </div>
    );
}
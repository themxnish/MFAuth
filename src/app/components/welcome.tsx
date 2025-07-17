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
            
            if (response.ok) {
                const data = await response.json();
                setUsername(data.user.username);
            }
            return null;
        }
        getUsername();
    })
    return (
        <div className='p-4 flex flex-col items-center'>
            <div className='w-full sm:w-1/2'>
                <h1 className='text-2xl font-bold text-white text-center'>Welcome, {username}!</h1>
            </div>
        </div>
    );
}
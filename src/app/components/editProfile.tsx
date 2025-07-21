'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import AvatarSelector from './avatar/avatar';

export default function EditProfile() {
    const [ name, setName ] = useState('');
    const [ bio, setBio ] = useState('');


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/user/session', {
                    method: 'GET',
                    credentials: 'include'
                })

                const data = await response.json()
                setName(data.user.name)
                setBio(data.user.bio)
            } catch (error) {
                console.log(error)
                toast.error('Failed to load profile. Please log in.')
            }
        }
        fetchUser()
    }, [])

    const handleEdit = async () => {
        const response = await fetch('/api/user/edit', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, bio }),
        })
        const data = await response.json();

        if(response.ok) {
            toast.success('Profile updated successfully');
            window.location.reload();
        } else {
            toast.error(data.message);
        }
    }
    

    return (
        <div className='w-full max-w-lg space-y-6 px-4 py-8 flex flex-col items-center justify-center'>
            <div className='flex flex-row justify-between w-full text-sm'>
                <label className='text-gray-300'>Full Name:</label>
                <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} className='bg-[#4B4B4B] text-white px-4 py-2 ml-auto w-2/3 rounded-lg shadow-xl' />
            </div>
            <div className='flex flex-row justify-between w-full text-sm'>
                <label className='text-gray-300'>Bio:</label>
                <textarea id="bio" placeholder="Describe yourself" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className='bg-[#4B4B4B] text-white px-4 py-2 ml-auto w-2/3 rounded-lg shadow-xl resize-none' />
            </div>
            <div className='flex flex-col justify-between w-full text-sm'>
                <label className='text-gray-300 mb-2'>Avatar:</label>
                <AvatarSelector />
            </div>
            <div className='flex flex-row justify-between text-sm w-full'>
                <label className='text-gray-300'>Reset Password:</label>
                <button className='bg-[#4B4B4B] px-4 py-2 ml-auto w-1/3 rounded-lg shadow-xl text-sm font-medium text-white'><a href='/reset-password'>Change?</a></button>    
            </div>

            <button onClick={handleEdit} className='bg-[#4B4B4B] w-full text-white font-semibold px-4 py-2 rounded-lg shadow-xl cursor-pointer'>Save</button>
        </div>
    )
}
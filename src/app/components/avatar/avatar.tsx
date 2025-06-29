'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import NiceAvatar, { AvatarFullConfig } from 'react-nice-avatar';
import { avatarPresets } from '@/lib/avatarPresets';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function AvatarSelector() {
  const [ open, setOpen ] = useState(false);

  const handleBlock = () => {
    setOpen((prev) => !prev);
  };

  const onClick = async (e: React.MouseEvent, avatar: AvatarFullConfig) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar }),
      });
      if (response.ok){
        window.location.reload();
      } else toast.error('Failed to add avatar');
    } catch (error) {
      toast.error('Error adding avatar');
      console.error('Error adding avatar:', error);
    }
  };

  return (
    <div className='p-4 rounded-lg shadow-xl bg-[#4B4B4B]'>
      <div className='flex justify-between items-center mb-2'>
        <h2 className='text-md font-semibold text-white'>Choose your Avatar</h2>
        <button onClick={handleBlock} className='text-white flex gap-2 items-center'>
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {open && (
        <div className='flex gap-4 flex-wrap justify-center mt-4'>
          {avatarPresets.map((config, idx) => (
            <div key={idx} onClick={(e) => onClick(e, config)} className='p-2 rounded-full hover:scale-108 cursor-pointer transition'>
              <NiceAvatar style={{ width: '80px', height: '80px' }} {...config} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

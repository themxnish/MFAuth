'use client';
import NiceAvatar, { AvatarFullConfig } from 'react-nice-avatar';

export default function ProfileAvatar({ avatar }: { avatar: AvatarFullConfig | null }) {
  if (!avatar) return <div className='grid h-full w-full place-items-center text-center'><p className='text-xs font-semibold text-white'>No avatar</p></div>;

  return <NiceAvatar className='rounded-full' style={{ width: '100%', height: '100%' }} {...avatar} />;
}

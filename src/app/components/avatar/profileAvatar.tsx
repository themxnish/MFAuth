'use client';
import NiceAvatar, { AvatarFullConfig } from 'react-nice-avatar';

export default function ProfileAvatar({ avatar }: { avatar: AvatarFullConfig | null }) {
  if (!avatar) return <div className='p-4 text-center'><p className='text-sm font-semibold text-white mb-2'>No avatar</p></div>;

  return <NiceAvatar className='rounded-full' style={{ width: 90, height:  90 }} {...avatar} />;
}

'use client';
import { useRouter } from 'next/navigation';

export default function EditProfileButton({ username }: { username: string }) {
  const router = useRouter();

  const edit = () => {
    router.push(`/profile/${username}/edit`);
  };

  return (
    <button onClick={edit} className='bg-white/[0.08] hover:bg-white/[0.12] py-3 px-2 rounded-2xl border border-white/10 shadow-xl flex-1 cursor-pointer'>
      <p className='text-md font-bold text-white'>Edit Profile</p>
    </button>
  );
}
export { EditProfileButton };
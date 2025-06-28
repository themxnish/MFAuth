'use client';
import { useRouter } from 'next/navigation';

export default function EditProfileButton({ username }: { username: string }) {
  const router = useRouter();

  const edit = () => {
    router.push(`/profile/${username}/edit`);
  };

  return (
    <button onClick={edit} className='bg-[#4B4B4B] py-3 px-2 rounded-lg shadow-xl flex-1 cursor-pointer'>
      <p className='text-md font-bold text-white mb-2'>Edit Profile</p>
    </button>
  );
}
export { EditProfileButton };
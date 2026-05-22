'use client';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;

    try {
      const response = await fetch('/api/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('User logged out');
        router.push('/login');
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <button onClick={logout} className='bg-white/[0.08] hover:bg-white/[0.12] py-3 px-2 rounded-2xl border border-white/10 shadow-xl flex-1 cursor-pointer transition-colors duration-200'>
      <p className='text-md font-bold text-white'>Logout</p>
    </button>
  );
}

export default LogoutButton;
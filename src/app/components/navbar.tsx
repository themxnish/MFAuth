'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { useRouter }  from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const hiddenPaths = ['/login', '/register'];
  const [ menuOpen, setMenuOpen ] = useState(false);
  const router = useRouter();
  const [ authenticated, setAuthenticated ] = useState<boolean | null>(null);
  const [ user, setUser ] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/user/session');
      const data = await response.json();
      setAuthenticated(data.authenticated);
    }
    checkAuth();
  });

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch('/api/user/session');
      const data = await response.json();
      if(data?.user?.username){
        setUser(data.user.username);
      }
    }
    getUser();
  }, []);
  
  const redirectToProfile = () => {
    if (user) {
      router.push(`/profile/${user}`);
    }
  };

  if (hiddenPaths.includes(pathname)) return null;

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} className={`text-lg ${pathname === href ? 'text-gray-400 font-semibold hover:scale-95' : 'text-white hover:scale-105'}`}>
      {label}
    </Link>
  );

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
    }
  };
  
  return (
    <div className='text-white px-6 py-4 flex items-center justify-between relative z-50'>  
      <h1 className='text-3xl font-extrabold flex items-center gap-1 tracking-tight'>
        <span className='text-white'>MF</span>
        <span className='relative inline-block'>
          <span className='absolute inset-0 bg-gray-400 blur-sm opacity-70 rounded-md'></span>
          <span className='relative bg-gray-500 text-white px-2 py-0.5 rounded-md shadow-md'>auth</span>
        </span>
      </h1>

      <div className='hidden md:flex items-center gap-6'>
        <NavLink href='/' label='Home' />
        <NavLink href='/settings' label='Settings' />
        <button onClick={redirectToProfile} className='text-lg cursor-pointer'><User className={`w-6 h-6 ${pathname === `/profile/${user}` ? 'text-gray-400 hover:scale-95' : 'text-white hover:scale-105'}`}/></button>
        { authenticated ?(
          <button onClick={logout} className='bg-gray-500 px-3 py-1 rounded-md text-white text-lg font-semibold hover:ring-2 hover:ring-gray-300 transition-all duration-200'>Logout</button>
        ):(
          <button className='bg-gray-500 px-3 py-1 rounded-md hover:ring-2 hover:ring-gray-300 transition-all duration-200'>
            <Link href='/login' className='text-white text-lg font-semibold' >Login</Link>
          </button>
        )}
      </div>

      <div className='md:hidden flex items-center '>
        <button onClick={() => setMenuOpen(true)}>
          <Menu className='w-6 h-6 text-gray-300' />
        </button>
      </div>

      { menuOpen && (
        <div onClick={() => setMenuOpen(false)} className='absolute gap-2 bg-[#1B1B1B] top-16 left-0 w-full p-4 flex flex-col items-center md:hidden'>
          <NavLink href='/' label='Home' />
          <NavLink href={`/profile/${user}`} label='Profile' />
          <NavLink href='/settings' label='Settings' />
          { authenticated ? (
            <button onClick={logout} className='text-lg'>Logout</button>
          ):(
            <NavLink href='/login' label='Login' />
          )}
          <X onClick={() => setMenuOpen(false)} className='mt-4 text-white' size={24} />
        </div>
      ) }
    </div>
  );    
}
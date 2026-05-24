'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { useRouter }  from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const [ menuOpen, setMenuOpen ] = useState(false);
  const router = useRouter();
  const [ authenticated, setAuthenticated ] = useState<boolean | null>(null);
  const [ user, setUser ] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const response = await fetch('/api/user/session', { cache: 'no-store' });
      const data = await response.json();
      setAuthenticated(Boolean(data.authenticated));
      setUser(data?.user?.username ?? null);
    }
    getSession();
  }, [pathname]);
  
  const redirectToProfile = () => {
    if (user) {
      router.push(`/profile/${user}`);
    } else {
      toast.error('Login to view your profile');
    }
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} className={`text-sm font-semibold ${pathname === href ? 'text-emerald-300' : 'text-gray-200 hover:text-white'}`}>
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
        setAuthenticated(false);
        setUser(null);
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
    <div className='sticky top-0 z-50 mx-auto mt-3 flex w-[calc(100%-1rem)] max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/85 px-3 py-3 text-white shadow-2xl shadow-black/25 backdrop-blur sm:w-[calc(100%-1.5rem)] sm:px-4'>  
      <Link href='/' className='text-2xl font-extrabold flex items-center gap-1 tracking-tight sm:text-2xl'>
        <span className='text-white'>MF</span>
        <span className='relative inline-block'>
          <span className='absolute inset-0 bg-emerald-400 blur-sm opacity-50 rounded-md'></span>
          <span className='relative bg-emerald-400 text-zinc-950 px-2 py-0.5 rounded-md shadow-md'>auth</span>
        </span>
      </Link>

      <div className='hidden md:flex items-center gap-6'>
        <NavLink href='/' label='Home' />
        <NavLink href='/activity' label='User Activity' />
        <NavLink href='/submit' label='Submit Evidence' />
        <button onClick={redirectToProfile} className='cursor-pointer rounded-full bg-white/10 p-2 hover:bg-white/15'><User className={`w-5 h-5 ${pathname === `/profile/${user}` ? 'text-emerald-300' : 'text-white'}`}/></button>
        { authenticated ?(
          <button onClick={logout} className='rounded-xl bg-white px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-emerald-200'>Logout</button>
        ):(
          <button className='rounded-xl bg-white px-4 py-2 hover:bg-emerald-200'>
            <Link href='/login' className='text-sm font-bold text-zinc-950' >Login</Link>
          </button>
        )}
      </div>

      <div className='md:hidden flex items-center'>
        <button onClick={() => setMenuOpen(true)} className='p-2'>
          <Menu className='w-6 h-6 text-gray-300' />
        </button>
      </div>

      { menuOpen && (
        <div onClick={() => setMenuOpen(false)} className='absolute left-0 top-[4.35rem] grid w-full gap-2 rounded-2xl border border-white/10 bg-black p-3 shadow-2xl shadow-black/60 md:hidden'>
          <Link href='/' className={`rounded-xl px-4 py-3 text-center text-sm font-semibold ${pathname === '/' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/[0.06] text-gray-200'}`}>Home</Link>
          <Link onClick={redirectToProfile} href={`/profile/${user}`} className={`rounded-xl px-4 py-3 text-center text-sm font-semibold ${pathname === `/profile/${user}` ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/[0.06] text-gray-200'}`}>Profile</Link>
          <Link href='/activity' className={`rounded-xl px-4 py-3 text-center text-sm font-semibold ${pathname === '/activity' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/[0.06] text-gray-200'}`}>User Activity</Link>
          <Link href='/submit' className={`rounded-xl px-4 py-3 text-center text-sm font-semibold ${pathname === '/submit' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/[0.06] text-gray-200'}`}>Submit Evidence</Link>
          { authenticated ? (
            <button onClick={logout} className='rounded-xl bg-white px-4 py-3 text-sm font-bold text-zinc-950'>Logout</button>
          ):(
            <Link href='/login' className='rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-zinc-950'>Login</Link>
          )}
          <X onClick={() => setMenuOpen(false)} className='mx-auto mt-2 text-white' size={24} />
        </div>
      ) }
    </div>
  );    
}
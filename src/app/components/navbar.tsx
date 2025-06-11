'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const hiddenPaths = ['/login', '/register'];
  const [ menuOpen, setMenuOpen ] = useState(false);

  if (hiddenPaths.includes(pathname)) return null;

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} className={`text-lg ${pathname === href ? 'text-orange-400 font-semibold' : 'text-white'}`}>
      {label}
    </Link>
  );
  
  return (
    <div className='text-white px-6 py-4 flex items-center justify-between relative z-50'>  
      <h1 className='text-3xl font-extrabold flex items-center gap-1 tracking-tight'>
        <span className='text-white'>MF</span>
        <span className='relative inline-block'>
          <span className='absolute inset-0 bg-orange-500 blur-sm opacity-70 rounded-md'></span>
          <span className='relative bg-orange-500 text-white px-2 py-0.5 rounded-md shadow-md'>auth</span>
        </span>
      </h1>


      <div className='hidden md:flex items-center gap-6'>
        <NavLink href='/' label='Home' />
        <NavLink href='/profile' label='Profile' />
        <button className='bg-orange-500 px-3 py-1 rounded-md hover:ring-2 hover:ring-red-300 transition-all duration-200'>
          <Link href='/login' className='text-white text-lg font-semibold' >Login</Link>
        </button>
        
      </div>

      <div className='md:hidden flex items-center '>
        <button onClick={() => setMenuOpen(prev => !prev)}>
          <Menu className='w-6 h-6 text-white' />
        </button>
      </div>

      { menuOpen && (
        <div className='absolute gap-2 bg-[#1B1B1B] top-16 left-0 w-full p-4 flex flex-col items-center md:hidden'>
          <NavLink href='/' label='Home' />
          <NavLink href='/profile' label='Profile' />
          <NavLink href='/login' label='Login' />
          <X onClick={() => setMenuOpen(false)} className='mt-4 text-white' size={24} />
        </div>
      ) }
    </div>
  );    
}
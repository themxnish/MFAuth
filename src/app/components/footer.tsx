'use client';

import { usePathname } from 'next/navigation';
export default function Footer() {
    const pathname = usePathname();
    const hiddenPaths = ['/login', '/register'];
    if (hiddenPaths.includes(pathname)) return null;
    
    return (
       <footer className='py-2'>
            <div className='flex flex-col items-center justify-center text-center text-gray-400'>
                <p className='text-xs'>MFauth &copy; 2025. All rights secured.</p>  
            </div>
       </footer>
    );
}
export const metadata = {
  title: 'MFauth',
  description: '',
};

import Navbar from './components/navbar';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className='h-screen'>
          <Navbar />
          <Toaster position="top-right" />
          {children}
        </main>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'MFauth',
  description: '',
};

import Navbar from './components/navbar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className='h-screen'>
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}

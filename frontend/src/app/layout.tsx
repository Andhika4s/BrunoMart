'use client';

import { Toaster } from 'react-hot-toast';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Navbar from '@/components/common/navbar';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Menyembunyikan navbar jika berada di route yang berawalan /auth (seperti /auth, /auth/login, /auth/register)
  const showNavbar = !pathname?.startsWith('/auth');

  return (
    <html lang="id" className={cn('font-sans', inter.variable)}>
      <body className="antialiased">
        <ReactQueryProvider>
          {showNavbar && <Navbar />}
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
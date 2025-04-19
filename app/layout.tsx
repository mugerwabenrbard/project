'use client';

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

 const metadata: Metadata = {
  title: 'Bixter - Student Management System',
  description: 'Manage your student applications efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '300', // font-light
              color: 'white', // gray-800
            },
            classNames: {
              toast: 'shadow-corporate',
              success: 'sonner-toast-success',
              error: 'sonner-toast-error',
            },
          }}
        />
        </SessionProvider>
      </body>
    </html>
  );
}
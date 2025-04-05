import React from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />
      <main className="pl-64 pt-16">
        {children}
      </main>
    </div>
  );
}
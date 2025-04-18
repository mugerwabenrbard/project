'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    console.log('[AuthenticatedLayout] Session status:', status, 'Session:', session);
  }, [status, session]);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    console.log('[AuthenticatedLayout] Redirecting to /');
    router.push('/');
    return null;
  }

  return <>{children}</>;
}
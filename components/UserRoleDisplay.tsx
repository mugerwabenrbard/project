'use client';

import { useSession } from 'next-auth/react';

export default function UserRoleDisplay() {
  const { data: session, status } = useSession();

  console.log('[UserRoleDisplay] Session status:', status, 'Session:', session);

  if (status === 'loading') {
    return <span className="font-light">Loading...</span>;
  }

  if (status === 'unauthenticated' || !session) {
    return <span className="font-light">Guest User</span>;
  }

  const role = session.user.role || 'client';
  const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

  return <span className="font-light">{capitalizedRole} User</span>;
}
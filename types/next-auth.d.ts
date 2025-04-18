import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email: string;
      role: 'staff' | 'client' | 'admin';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: number;
    role: 'staff' | 'client' | 'admin';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    role: 'staff' | 'client' | 'admin';
  }
}
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname;
      console.log('[Middleware] Path:', path, 'Token:', token);

      if (path.startsWith('/api/auth') || path.startsWith('/api/users/add')) {
        console.log('[Middleware] Allowing API route:', path);
        return true;
      }

      if (path.startsWith('/staff/users/adduser')) {
        return token?.role === 'admin';
      }
      if (path.startsWith('/staff/dashboard')) {
        return !!token;
      }
      return true;
    },
  },
  pages: {
    signIn: '/',
  },
});

export const config = {
  matcher: [
    '/staff/dashboard/:path*',
    '/staff/users/adduser/:path*',
    '/((?!api/auth|_next/static|_next/image|favicon.ico|api/users/add).*)',
  ],
};
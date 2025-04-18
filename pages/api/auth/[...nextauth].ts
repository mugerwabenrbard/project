import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('[Auth] Missing credentials');
            throw new Error('Email and password are required');
          }

          const user = await prisma.users.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.error('[Auth] No user found:', credentials.email);
            throw new Error('No user found');
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            console.error('[Auth] Invalid password:', credentials.email);
            throw new Error('Invalid password');
          }

          console.log('[Auth] Login success:', credentials.email);
          return {
            id: user.id.toString(),
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('[Auth] Authorize error:', error);
          throw error;
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        console.log('[Auth] JWT set:', token);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = parseInt(token.id);
        session.user.email = token.email;
        session.user.role = token.role;
        console.log('[Auth] Session set:', session.user);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const cleanBaseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      console.log('[Auth] Redirect:', { url, baseUrl: cleanBaseUrl });
      if (url.startsWith('/')) {
        return `${cleanBaseUrl}${url}`;
      }
      if (url.includes('callbackUrl') || url === cleanBaseUrl) {
        return `${cleanBaseUrl}/staff/dashboard`;
      }
      return url;
    },
  },
  pages: {
    signIn: '/',
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // Non-secure for localhost
        path: '/',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

export default NextAuth(authOptions);
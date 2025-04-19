import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[AddUserAPI] Request received:', req.method, req.url, 'Cookies:', req.headers.cookie);

  if (req.method !== 'POST') {
    console.log('[AddUserAPI] Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  console.log('[AddUserAPI] Session:', session);

  if (!session || session.user.role !== 'admin') {
    console.log('[AddUserAPI] Unauthorized access:', session?.user);
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { email, password, role } = req.body;

  if (!email || !password || !['staff', 'client', 'admin'].includes(role)) {
    console.log('[AddUserAPI] Invalid input:', { email, role });
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      console.log('[AddUserAPI] User already exists:', email);
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        role,
        createdAt: new Date(),
      },
    });

    console.log('[AddUserAPI] User created:', email);
    return res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error('[AddUserAPI] Server error:', error);
    return res.status(500).json({ error: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
}
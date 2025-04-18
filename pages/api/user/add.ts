import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { email, password, role } = req.body;

  if (!email || !password || !['staff', 'client', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
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
    console.error('[AddUserAPI] Error:', error);
    return res.status(500).json({ error: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
}
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[UsersAPI] Request received:', req.method, req.url, 'Cookies:', req.headers.cookie);

  const session = await getServerSession(req, res, authOptions);
  console.log('[UsersAPI] Session:', session);

  if (!session || session.user.role !== 'admin') {
    console.log('[UsersAPI] Unauthorized access:', session?.user);
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const users = await prisma.users.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
      console.log('[UsersAPI] Users fetched:', users.length);
      return res.status(200).json(users);
    } catch (error) {
      console.error('[UsersAPI] GET error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  } else if (req.method === 'PUT') {
    const { id, email, role, password } = req.body;

    if (!id || !email || !['staff', 'client', 'admin'].includes(role)) {
      console.log('[UsersAPI] Invalid input:', { id, email, role });
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      const existingUser = await prisma.users.findFirst({
        where: { email, id: { not: id } },
      });
      if (existingUser) {
        console.log('[UsersAPI] Email already in use:', email);
        return res.status(409).json({ error: 'Email already in use' });
      }

      const updateData: { email: string; role: string; password?: string } = { email, role };
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await prisma.users.update({
        where: { id },
        data: updateData,
        select: { id: true, email: true, role: true },
      });
      console.log('[UsersAPI] User updated:', updatedUser);
      return res.status(200).json({ message: 'User updated', user: updatedUser });
    } catch (error) {
      console.error('[UsersAPI] PUT error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;

    if (!id) {
      console.log('[UsersAPI] Invalid input: Missing id');
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      const user = await prisma.users.findUnique({ where: { id } });
      if (!user) {
        console.log('[UsersAPI] User not found:', id);
        return res.status(404).json({ error: 'User not found' });
      }

      // Prevent deleting the current admin
      if (user.email === session.user.email) {
        console.log('[UsersAPI] Cannot delete self:', user.email);
        return res.status(403).json({ error: 'Cannot delete current user' });
      }

      await prisma.users.delete({ where: { id } });
      console.log('[UsersAPI] User deleted:', id);
      return res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      console.error('[UsersAPI] DELETE error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    console.log('[UsersAPI] Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
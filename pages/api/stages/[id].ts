import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const sessionUserId = typeof session.user.id === 'string'
    ? parseInt(session.user.id, 10)
    : session.user.id;

  const { id } = req.query;

  if (req.method === 'PATCH') {
    const userId = sessionUserId;

    try {
      const stageId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id as string, 10);
      if (isNaN(stageId)) {
        return res.status(400).json({ message: 'Invalid stage ID' });
      }
      const data = { ...req.body };
      delete data.userId;
      // Transform potential date fields to ISO-8601 format
      ['passportIssueDate', 'passportExpiryDate', 'dob'].forEach((field) => {
        if (data[field]) {
          data[field] = new Date(data[field]).toISOString();
        }
      });
      const updatedStage = await prisma.stages.update({
        where: { id: stageId },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });

      await prisma.logs.create({
        data: {
          action: `Updated Stage ${updatedStage.stageName}`,
          endpoint: `/api/stages/${stageId}`,
          method: 'PATCH',
          status: 200,
          userId,
          details: JSON.stringify({ stageId, data }),
        },
      });

      return res.status(200).json(updatedStage);
    } catch (error) {
      await prisma.logs.create({
        data: {
          action: 'Failed to Update Stage',
          endpoint: `/api/stages/${id}`,
          method: 'PATCH',
          status: 500,
          userId,
          details: JSON.stringify({ error: String(error), stageId: id, data: req.body }),
        },
      });
      return res.status(500).json({ message: 'Failed to update stage', error: String(error) });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
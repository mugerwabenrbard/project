import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // id from query is string | string[], ensure it's a single string and parse to int
      const leadId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id as string, 10);
      if (isNaN(leadId)) {
        return res.status(400).json({ message: 'Invalid lead ID' });
      }

      const lead = await prisma.leads.findUnique({
        where: { id: leadId },
        include: {
          stages: true,
        },
      });

      if (lead) {
        res.status(200).json(lead);
      } else {
        res.status(404).json({ message: 'Lead not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching lead', error: String(error) });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
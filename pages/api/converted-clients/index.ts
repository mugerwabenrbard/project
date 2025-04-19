import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Find all converted leads
    const leads = await prisma.leads.findMany({
      where: { status: 'converted' },
      include: {
        payments: {
          where: {
            type: 'Registration',
            status: 'paid',
          },
          select: {
            completedAt: true,
          },
          orderBy: { completedAt: 'desc' }, // If there are multiple, get the latest
          take: 1,
        },
      },
    });

    // Map to include registrationPaidAt
    const convertedClients = leads
      .filter(lead => lead.payments.length > 0)
      .map(lead => ({
        ...lead,
        registrationPaidAt: lead.payments[0].completedAt,
      }));

    res.status(200).json(convertedClients);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
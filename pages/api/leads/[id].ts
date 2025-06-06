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

  if (req.method === 'PUT') {
    const userId = sessionUserId;

    try {
      const leadId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id as string, 10);
      if (isNaN(leadId)) {
        return res.status(400).json({ message: 'Invalid lead ID' });
      }
      const data = { ...req.body };
      // Remove userId from data to prevent invalid field error
      delete data.userId;
      // Transform date fields to ISO-8601 format
      ['passportIssueDate', 'passportExpiryDate', 'dob'].forEach((field) => {
        if (data[field]) {
          data[field] = new Date(data[field]).toISOString();
        }
      });
      const updatedLead = await prisma.leads.update({
        where: { id: leadId },
        data,
        // Optionally set registeredById if the user should be associated with the lead
        // data: {
        //   ...data,
        //   registeredById: parseInt(userId),
        // },
      });

      await prisma.logs.create({
        data: {
          action: 'Updated Lead',
          endpoint: `/api/leads/${leadId}`,
          method: 'PUT',
          status: 200,
          userId,
          details: JSON.stringify({ leadId, data }),
        },
      });

      return res.status(200).json(updatedLead);
    } catch (error) {
      await prisma.logs.create({
        data: {
          action: 'Failed to Update Lead',
          endpoint: `/api/leads/${id}`,
          method: 'PUT',
          status: 500,
          userId,
          details: JSON.stringify({ error: String(error), leadId: id, data: req.body }),
        },
      });
      return res.status(500).json({ message: 'Error updating lead', error: String(error) });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
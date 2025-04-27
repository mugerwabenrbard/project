import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Fetch a single lead by id with related stages and documents
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Lead id is required' });
    }
    try {
      const lead = await prisma.leads.findUnique({
        where: { id: Number(id) },
        include: {
          stages: true,
          documents: true,
        },
      }); // No logging for GET
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      res.status(200).json(lead);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching lead with related data', error: String(error) });
    }
  } else if (req.method === 'POST') {
    // Leave blank for now
    res.status(200).json({ message: 'POST not implemented yet' });
  } else if (req.method === 'PUT') {
    // Leave blank for now
    res.status(200).json({ message: 'PUT not implemented yet' });
  } else if (req.method === 'DELETE') {
    // Authenticate using next-auth session
    const { getServerSession } = require('next-auth/next');
    const { authOptions } = require('../auth/[...nextauth]');
    (async () => {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Document id is required' });
      }
      try {
        const doc = await prisma.document.findUnique({ where: { id: Number(id) } });
        if (!doc) {
          return res.status(404).json({ error: 'Document not found' });
        }
        // Remove file from disk
        const filePath = doc.fileUrl.startsWith('/documents/') ?
          require('path').join(process.cwd(), 'public', doc.fileUrl) : null;
        if (filePath && require('fs').existsSync(filePath)) {
          require('fs').unlinkSync(filePath);
        }
        // Delete from DB
        await prisma.document.delete({ where: { id: Number(id) } });
        // After document deletion, set related stage to incomplete (completed: false)
        // Find the stage for this lead and document type (assume stageName matches doc.type or is 'Academic Documents')
        // NOTE: Prisma 'mode' argument is not available; 'contains' is case-sensitive.
        // If you want case-insensitive, ensure your data matches or add logic to normalize case.
        const stage = await prisma.stages.findFirst({
          where: {
            leadId: doc.leadId,
            stageName: { contains: 'Academic Documents' },
          },
        });
        if (stage) {
          await prisma.stages.update({
            where: { id: stage.id },
            data: { completed: false, completedAt: null },
          });
        }
        // Log the DELETE operation
        await prisma.logs.create({
          data: {
            action: 'Deleted Document',
            endpoint: '/api/documents/[id]',
            method: 'DELETE',
            status: 200,
            userId: typeof session.user.id === 'string' ? parseInt(session.user.id, 10) : session.user.id,
            details: JSON.stringify({ documentId: doc.id, fileUrl: doc.fileUrl, leadId: doc.leadId, type: doc.type }),
          },
        });
        return res.status(200).json({ message: 'Document deleted and stage set to incomplete' });
      } catch (error) {
        return res.status(500).json({ error: String(error) });
      }
    })();
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Authenticate using next-auth session
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id, 10) : session.user.id;

    const uploadDir = path.join(process.cwd(), 'public', 'documents');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    try {
      const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
        form.parse(req, (err: any, fields: formidable.Fields, files: formidable.Files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      // Extract metadata
      const leadId = Array.isArray(fields.leadId) ? fields.leadId[0] : fields.leadId;
      const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
      // const notes = Array.isArray(fields.notes) ? fields.notes[0] : fields.notes;
      // const paymentId = Array.isArray(fields.paymentId) ? fields.paymentId[0] : fields.paymentId;
      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      if (!file || !leadId || !type) {
        return res.status(400).json({ error: 'Missing required fields or file.' });
      }

      // Check for existing document with same leadId and type
      const existingDoc = await prisma.document.findFirst({
        where: {
          leadId: Number(leadId),
          type: type,
        },
      });
      if (existingDoc) {
        return res.status(409).json({ error: 'This document has already been uploaded for this client.' });
      }

      // Save document record in DB (use correct model and fields)
      const doc = await prisma.document.create({
        data: {
          leadId: Number(leadId),
          type,
          fileUrl: `/documents/${path.basename(file.filepath)}`,
        },
      });

      // Log the CREATE operation to logs table
      await prisma.logs.create({
        data: {
          action: 'Uploaded Document ',
          endpoint: '/api/documents/upload',
          method: 'POST',
          status: 201,
          userId,
          details: JSON.stringify({ documentId: doc.id, leadId, type, fileUrl: doc.fileUrl }),
        },
      });

      return res.status(201).json({ message: 'Document uploaded', document: doc });
    } catch (error) {
      return res.status(500).json({ error: String(error) });
    }
  } else if (req.method === 'PUT') {
    if (!(await checkAuth(req, res))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Implement update as needed
    logOperation('UPDATE', { user: req.headers['x-user'] || req.headers.authorization || 'unknown', body: req.body });
    return res.status(200).json({ message: 'PUT not implemented yet' });
  } else if (req.method === 'DELETE') {
    if (!(await checkAuth(req, res))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Implement delete as needed
    logOperation('DELETE', { user: req.headers['x-user'] || req.headers.authorization || 'unknown', body: req.body });
    return res.status(200).json({ message: 'DELETE not implemented yet' });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

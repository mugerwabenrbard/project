import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prismaClient = new PrismaClient();
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !['admin', 'staff'].includes(session.user?.role)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const {
    query: { id },
    method,
  } = req;

  if (!id) {
    return res.status(400).json({ error: 'Missing client id' });
  }



  if (method === 'POST') {
    // Upload Video CV file and save in documents table
    const formidable = require('formidable');
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(process.cwd(), 'public', 'videocv');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Parse the form wrapped in a Promise
    const form = new formidable.IncomingForm({ uploadDir, keepExtensions: true });
    await new Promise<void>((resolve) => {
      form.parse(req, async (err: any, fields: any, files: any) => {
        if (err) {
          res.status(400).json({ error: 'Error parsing form data' });
          return resolve();
        }

        const file = files.file || files.proof; // Accept either field name
        if (!file) {
          res.status(400).json({ error: 'Video file is required' });
          return resolve();
        }

        const filePath = Array.isArray(file) ? file[0].filepath : file.filepath;
        const fileName = path.basename(filePath);
        const fileUrl = `/videocv/${fileName}`;
        try {
          // Debug: Log the data being sent to Prisma
          console.log('Creating document with:', {
            leadId: Number(id),
            fileUrl: fileUrl,
            type: 'Video CV',
          });
          let doc;
          try {
            doc = await prismaClient.document.create({
              data: {
                leadId: Number(id),
                fileUrl: fileUrl,
                type: 'Video CV',
              },
            });
            console.log('Document created:', doc);
          } catch (err) {
            console.error('Prisma document.create error:', err);
            res.status(500).json({ error: 'Database error', details: String(err) });
            return resolve();
          }
          // Find the Video CV stage for this lead
          const videoCVStage = await prismaClient.stages.findFirst({
            where: {
              leadId: Number(id),
              stageName: 'Video CV',
            },
          });

          // Mark the stage as complete if stage exists
          if (videoCVStage) {
            await prismaClient.stages.update({
              where: { id: videoCVStage.id },
              data: {
                completed: true,
                completedAt: new Date(),
              },
            });
          }

          // Log the upload action
          const log = await prismaClient.logs.create({
            data: {
              action: 'Uploaded Video CV',
              endpoint: '/api/videocv/[id]',
              method: 'POST',
              status: 201,
              userId: typeof session.user?.id === 'string' ? parseInt(session.user.id, 10) : session.user?.id,
              details: JSON.stringify({
                leadId: Number(id),
                documentId: doc.id,
                fileUrl,
                stageCompleted: !!videoCVStage,
              }),
            },
          });
          console.log('Log created:', log);
          res.status(201).json({ document: doc, log, stageCompleted: !!videoCVStage });
        } catch (e) {
          console.error('Error creating log:', e);
          res.status(500).json({ error: 'Database error ', details: e });
        }
        resolve();
      });
    });
    return;
  }


  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

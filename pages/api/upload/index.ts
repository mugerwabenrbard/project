import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // Needed for formidable
  },
};

const prisma = new PrismaClient();

import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token || !['admin', 'staff'].includes(token.role as string)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public/uploads/payments');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    multiples: true,
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
  });

  let file; // Declare file variable for cleanup in catch block

  try {
    const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
      (resolve, reject) => {
        form.parse(req, (err: any, fields: any, files: any) => {
          if (err) {
            reject(err);
          }
          resolve({ fields, files });
        });
      }
    );

    // Extract single values from arrays
    const leadId = Array.isArray(fields.leadId) ? fields.leadId[0] : fields.leadId;
    const amount = Array.isArray(fields.amount) ? fields.amount[0] : fields.amount;
    const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
    const method = Array.isArray(fields.method) ? fields.method[0] : fields.method;

    // Handle files.proof as an array
    file = Array.isArray(files.proof) ? files.proof[0] : files.proof;

    if (!file) {
      return res.status(400).json({ error: 'Proof of payment file is required' });
    }

    if (!leadId || !amount || !type || !method) {
      try {
        fs.unlinkSync(file.filepath);
      } catch (cleanupError) {
      }
      return res.status(400).json({ error: 'Missing required fields: leadId, amount, type, method' });
    }

    // Validate leadId exists in Leads
    const leadExists = await prisma.leads.findUnique({
      where: { id: parseInt(leadId) },
    });
    if (!leadExists) {
      return res.status(400).json({ error: `Invalid leadId: ${leadId} does not exist` });
    }

    const fileName = path.basename(file.filepath);
    const fileUrl = `/uploads/payments/${fileName}`;

    // const payment = await prisma.payments.create({
    //   data: {
    //     leadId: parseInt(leadId),
    //     amount: parseFloat(amount),
    //     type,
    //     method,
    //     fileUrl,
    //   },
    // });

    return res.status(200).json({ url: fileUrl });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
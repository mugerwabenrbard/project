import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token || !['admin', 'staff'].includes(token.role as string)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = parseInt(token.sub as string);

  try {
    if (req.method === 'GET' && req.query.id) {
        const transactionId = req.query.id as string;
        if (!/^\d{14}$/.test(transactionId)) {
          return res.status(400).json({ error: 'Transaction ID must be a 14-digit number' });
        }
        const existing = await prisma.payments.findFirst({ where: { transactionId } });
        if (existing) {
          return res.status(409).json({ error: 'Transaction ID already exists' });
        }
        await prisma.logs.create({
          data: {
            action: 'Checked Transaction ID',
            endpoint: '/api/payments/check-transaction-id',
            method: 'GET',
            status: 200,
            userId,
            details: JSON.stringify({ transactionId }),
          },
        });
        return res.status(200).json({ message: 'Transaction ID is unique' });
      }

    if (req.method === 'POST') {
      const { leadId, transactionId, fileUrl, method } = req.body;

      if (!leadId || !transactionId || !fileUrl || !method) {
        return res.status(400).json({ error: 'Lead ID, transaction ID, proof of payment, and payment method are required' });
      }

      if (!/^\d{14}$/.test(transactionId)) {
        return res.status(400).json({ error: 'Transaction ID must be a 14-digit number' });
      }

      // Validate transaction ID uniqueness
      const existing = await prisma.payments.findFirst({ where: { transactionId } });
      if (existing) {
        return res.status(409).json({ error: 'Transaction ID already exists' });
      }

      // Validate lead existence
      const lead = await prisma.leads.findUnique({ where: { id: parseInt(leadId) } });
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }

      // Fetch service prices
      const registrationPrice = await prisma.servicepx.findUnique({
        where: { name: 'Registration' },
      });
      const medicalPrice = await prisma.servicepx.findUnique({
        where: { name: 'Medical Check' },
      });

      if (!registrationPrice || !medicalPrice) {
        return res.status(400).json({ error: 'Service prices not found' });
      }

      const totalAmount = registrationPrice.price + medicalPrice.price;

      // Define the stage names to be created for each lead
      const stageNames = [
        "Registration",
        "Academic Documents",
        "Medical Check",
        "Video CV",
        "IELTS Test",
        "Partner Submission",
        "Contract Processing",
        "Visa Processing",
        "Work Permit Processing",
        "Air Ticket",
        "Train Ticket",
        "Airport Transfer"
      ];

      // Create two payments and all stages in a single transaction
      const paymentsAndStages = await prisma.$transaction([
        prisma.payments.create({
          data: {
            leadId: parseInt(leadId),
            type: 'Registration',
            amount: registrationPrice.price,
            paidAmount: registrationPrice.price,
            status: 'paid',
            method,
            transactionId,
            fileUrl,
            completedAt: new Date(),
          },
        }),
        prisma.payments.create({
          data: {
            leadId: parseInt(leadId),
            type: 'Medical Check',
            amount: medicalPrice.price,
            paidAmount: medicalPrice.price,
            status: 'paid',
            method: 'mobile_money',
            transactionId,
            fileUrl,
            completedAt: new Date(),
          },
        }),
        ...stageNames.map(stageName =>
          prisma.stages.create({
            data: {
              leadId: parseInt(leadId),
              stageName,
              completed: false,
            }
          })
        )
      ]);

      // Update lead status
      await prisma.leads.update({
        where: { id: parseInt(leadId) },
        data: { status: 'converted' },
      });

      // Log payments and status update
      await prisma.$transaction([
        prisma.logs.create({
          data: {
            action: 'Created Payments',
            endpoint: '/api/payments',
            method: 'POST',
            status: 201,
            userId,
            details: JSON.stringify({
              leadId,
              paymentIds: paymentsAndStages.slice(0, 2).map((p) => p.id),
              types: ['Registration', 'Medical Check'],
              totalAmount,
              transactionId,
            }),
          },
        })
      ]);

      return res.status(201).json({ message: 'Payments processed successfully', payments: paymentsAndStages.slice(0, 2) });
    }

    if (req.method !== 'GET') {
      const userId = req.body?.userId || null;
      await prisma.logs.create({
        data: {
          action: `Attempted ${req.method} on /api/payments`,
          endpoint: '/api/payments',
          method: req.method,
          status: 405,
          userId,
          details: JSON.stringify({ message: 'Method not allowed' }),
        },
      });
      return res.status(405).json({ error: 'Method not allowed' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[PaymentsAPI] Error:', error);
    await prisma.logs.create({
      data: {
        action: 'Error in Payments API',
        endpoint: req.query.id ? '/api/payments/check-transaction-id' : '/api/payments',
        method: req.method || 'UNKNOWN',
        status: 500,
        userId,
        details: JSON.stringify({ error: error.message }),
      },
    });
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
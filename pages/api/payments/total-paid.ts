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

  if (req.method === 'GET') {
    const { leadId, type } = req.query;
    if (!leadId || !type) {
      return res.status(400).json({ error: 'Missing leadId or type' });
    }
    // Sum all paidAmount for this client and service type
    const payments = await prisma.payments.aggregate({
      _sum: { paidAmount: true },
      where: {
        leadId: Number(leadId),
        type: String(type),
      },
    });
    const totalPaid = payments._sum.paidAmount || 0;
    return res.status(200).json({ totalPaid });
  }

  if (req.method === 'POST') {
    const { leadId, amount, type, method, transactionId, fileUrl, status, paidAmount } = req.body;
    if (!leadId || !amount || !type || !method || !transactionId || !paidAmount) {
      return res.status(400).json({ error: 'leadId, amount, type, method, and transactionId are required' });
    }
    if (!/^(cash|mobile_money|visa)$/i.test(method)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }
    if (!/^\d{14}$/.test(transactionId)) {
      return res.status(400).json({ error: 'Transaction ID must be a 14-digit number' });
    }
    // Check if transactionId is unique for this type
    const existing = await prisma.payments.findFirst({ where: { transactionId, type } });
    if (existing) {
      return res.status(409).json({ error: 'Transaction ID already exists for this payment type' });
    }
    try {
      const payment = await prisma.payments.create({
        data: {
          leadId: Number(leadId),
          // Fetch the total service price for this type
          // (assume you have a function or table to get this, or pass it from frontend)
          amount: Number(amount), // this should be the total price of the service
          paidAmount: Number(paidAmount), // this is the amount paid in this transaction

          type: String(type),
          method: String(method),
          transactionId: String(transactionId),
          fileUrl: fileUrl || null,
          status: status || 'paid',
          completedAt: new Date(),
        },
      });
      // Log the action
      await prisma.logs.create({
        data: {
          action: 'Created Single Payment',
          endpoint: '/api/payments/total-paid',
          method: 'POST',
          status: 201,
          userId,
          details: JSON.stringify({
            leadId,
            paymentId: payment.id,
            type,
            amount,
            method,
            transactionId,
            paidAmount,
          }),
        },
      });
      return res.status(201).json({ message: 'Payment registered successfully', payment });
    } catch (error) {
      console.error('[TotalPaidAPI] Error:', error);
      await prisma.logs.create({
        data: {
          action: 'Error in TotalPaid API',
          endpoint: '/api/payments/total-paid',
          method: 'POST',
          status: 500,
          userId,
          details: JSON.stringify({ error: error.message }),
        },
      });
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

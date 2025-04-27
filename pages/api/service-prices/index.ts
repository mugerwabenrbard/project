import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {


    // Validate authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    
    if (!token || !['admin', 'staff'].includes(token.role as string)) {

      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = parseInt(token.sub as string);
    if (isNaN(userId)) {
  
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (req.method === 'GET') {

      const services = await prisma.servicepx.findMany();


      return res.status(200).json(services);
    }

    if (req.method === 'PUT') {

      const { services } = req.body;
      if (!Array.isArray(services)) {
        return res.status(400).json({ error: 'Services must be an array' });
      }

      for (const service of services) {
        if (!service.id || !service.name || typeof service.price !== 'number') {
          return res.status(400).json({ error: 'Invalid service data' });
        }

        await prisma.servicepx.update({
          where: { id: service.id },
          data: { name: service.name, price: service.price },
        });
      }

      try {
        await prisma.logs.create({
          data: {
            action: 'Updated Service Prices',
            endpoint: '/api/service-prices',
            method: 'PUT',
            status: 200,
            userId,
            details: JSON.stringify({ services }),
          },
        });
        console.log('[ServicePricesAPI] Log created successfully');
      } catch (logError) {
        console.error('[ServicePricesAPI] Failed to create log:', logError);
        // Continue despite logging error
      }

      return res.status(200).json({ message: 'Service prices updated successfully' });
    }

    console.error('[ServicePricesAPI] Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[ServicePricesAPI] Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    try {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      const userId = token && !isNaN(parseInt(token.sub as string)) ? parseInt(token.sub as string) : 0;
      
      await prisma.logs.create({
        data: {
          action: 'Error in Service Prices API',
          endpoint: '/api/service-prices',
          method: req.method || 'UNKNOWN',
          status: 500,
          userId,
          details: JSON.stringify({
            error: error.message,
            stack: error.stack,
            name: error.name,
          }),
        },
      });
      console.log('[ServicePricesAPI] Error log created');
    } catch (logError) {
      console.error('[ServicePricesAPI] Failed to create error log:', logError);
    }

    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('[ServicePricesAPI] Failed to disconnect from Prisma:', disconnectError);
    }
  }
}
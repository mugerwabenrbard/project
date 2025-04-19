import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('[ServicePricesAPI] Request received:', { method: req.method, url: req.url });

    // Validate authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('[ServicePricesAPI] Token:', token ? { role: token.role, sub: token.sub } : 'No token');
    
    if (!token || !['admin', 'staff'].includes(token.role as string)) {
      console.log('[ServicePricesAPI] Unauthorized: Invalid or missing token');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = parseInt(token.sub as string);
    if (isNaN(userId)) {
      console.error('[ServicePricesAPI] Invalid userId:', token.sub);
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (req.method === 'GET') {
      console.log('[ServicePricesAPI] Fetching service prices...');
      const services = await prisma.servicepx.findMany();
      console.log('[ServicePricesAPI] Services fetched:', services);

      try {
        await prisma.logs.create({
          data: {
            action: 'Fetched Service Prices',
            endpoint: '/api/service-prices',
            method: 'GET',
            status: 200,
            userId,
            details: JSON.stringify({ serviceCount: services.length }),
          },
        });
        console.log('[ServicePricesAPI] Log created successfully');
      } catch (logError) {
        console.error('[ServicePricesAPI] Failed to create log:', logError);
        // Continue despite logging error
      }

      return res.status(200).json(services);
    }

    if (req.method === 'PUT') {
      console.log('[ServicePricesAPI] Updating service prices:', req.body);
      const { services } = req.body;
      if (!Array.isArray(services)) {
        console.error('[ServicePricesAPI] Invalid request body: Services must be an array');
        return res.status(400).json({ error: 'Services must be an array' });
      }

      for (const service of services) {
        if (!service.id || !service.name || typeof service.price !== 'number') {
          console.error('[ServicePricesAPI] Invalid service data:', service);
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
      console.log('[ServicePricesAPI] Prisma disconnected');
    } catch (disconnectError) {
      console.error('[ServicePricesAPI] Prisma disconnect failed:', disconnectError);
    }
  }
}
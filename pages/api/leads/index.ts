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
    if (req.method === 'POST') {
      const {
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        nationality,
        highestEducationLevel,
        programPlacement,
        countryInterest,
        university,
        ieltsCertificate,
        nextOfKin,
        kinAddress,
        nin,
        kinPhoneNumber,
        passportNumber,
        passportIssueDate,
        passportExpiryDate,
        dob,
        address,
        chosenProgram,
      } = req.body;

      const requiredFields = [
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'nationality',
        'highestEducationLevel',
        'programPlacement',
        'countryInterest',
        'university',
      ];
      if (
        requiredFields.some((field) => !req.body[field]) ||
        !Array.isArray(programPlacement) ||
        programPlacement.length === 0 ||
        !Array.isArray(countryInterest) ||
        countryInterest.length === 0 ||
        ieltsCertificate === undefined
      ) {
        return res.status(400).json({ error: 'All required fields must be filled' });
      }

      const existingLead = await prisma.leads.findUnique({ where: { email } });
      if (existingLead) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      const lead = await prisma.leads.create({
        data: {
          firstName,
          middleName: middleName || null,
          lastName,
          email,
          phoneNumber,
          nationality,
          highestEducationLevel,
          programPlacement,
          countryInterest,
          university,
          ieltsCertificate,
          nextOfKin: nextOfKin || null,
          kinAddress: kinAddress || null,
          nin: nin || null,
          kinPhoneNumber: kinPhoneNumber || null,
          passportNumber: passportNumber || null,
          passportIssueDate: passportIssueDate ? new Date(passportIssueDate) : null,
          passportExpiryDate: passportExpiryDate ? new Date(passportExpiryDate) : null,
          dob: dob ? new Date(dob) : null,
          address: address || null,
          chosenProgram: chosenProgram || null,
          registeredById: userId,
          status: 'pending',
        },
      });

      await prisma.logs.create({
        data: {
          action: 'Created New Lead',
          endpoint: '/api/leads',
          method: 'POST',
          status: 201,
          userId,
          details: JSON.stringify({ leadId: lead.id, email }),
        },
      });

      return res.status(201).json(lead);
    }

    if (req.method === 'GET') {
      const leads = await prisma.leads.findMany({
        include: { registeredBy: { select: { email: true } } },
      });
      await prisma.logs.create({
        data: {
          action: 'Fetched Leads',
          endpoint: '/api/leads',
          method: 'GET',
          status: 200,
          userId,
          details: JSON.stringify({ leadCount: leads.length }),
        },
      });
      return res.status(200).json(leads);
    }

    if (req.method === 'PUT') {
      const {
        id,
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,
        nationality,
        highestEducationLevel,
        programPlacement,
        countryInterest,
        university,
        ieltsCertificate,
        nextOfKin,
        kinAddress,
        nin,
        kinPhoneNumber,
        passportNumber,
        passportIssueDate,
        passportExpiryDate,
        dob,
        address,
        chosenProgram,
        status,
      } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Lead ID is required' });
      }

      const existingLead = await prisma.leads.findUnique({ where: { id } });
      if (!existingLead) {
        return res.status(404).json({ error: 'Lead not found' });
      }

      if (email && email !== existingLead.email) {
        const emailExists = await prisma.leads.findUnique({ where: { email } });
        if (emailExists) {
          return res.status(409).json({ error: 'Email already exists' });
        }
      }

      const lead = await prisma.leads.update({
        where: { id },
        data: {
          firstName,
          middleName: middleName || null,
          lastName,
          email,
          phoneNumber,
          nationality,
          highestEducationLevel,
          programPlacement,
          countryInterest,
          university,
          ieltsCertificate,
          nextOfKin: nextOfKin || null,
          kinAddress: kinAddress || null,
          nin: nin || null,
          kinPhoneNumber: kinPhoneNumber || null,
          passportNumber: passportNumber || null,
          passportIssueDate: passportIssueDate ? new Date(passportIssueDate) : null,
          passportExpiryDate: passportExpiryDate ? new Date(passportExpiryDate) : null,
          dob: dob ? new Date(dob) : null,
          address: address || null,
          chosenProgram: chosenProgram || null,
          status,
        },
      });

      await prisma.logs.create({
        data: {
          action: status ? 'Updated Lead Status' : 'Updated Lead Details',
          endpoint: '/api/leads',
          method: 'PUT',
          status: 200,
          userId,
          details: JSON.stringify({ leadId: id, email: lead.email, status }),
        },
      });

      return res.status(200).json(lead);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Lead ID is required' });
      }

      const lead = await prisma.leads.findUnique({ where: { id } });
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }

      await prisma.leads.delete({ where: { id } });

      await prisma.logs.create({
        data: {
          action: 'Deleted Lead',
          endpoint: '/api/leads',
          method: 'DELETE',
          status: 200,
          userId,
          details: JSON.stringify({ leadId: id, email: lead.email }),
        },
      });

      return res.status(200).json({ message: 'Lead deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[LeadsAPI] Error:', error);
    await prisma.logs.create({
      data: {
        action: 'Error in Leads API',
        endpoint: '/api/leads',
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
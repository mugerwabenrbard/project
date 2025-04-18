import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Check if an admin user already exists
    const existingAdmin = await prisma.users.findFirst({
      where: { role: 'admin' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('bernard@12345', 10);

    // Create the initial admin user
    const adminUser = await prisma.users.create({
      data: {
        email: 'bernard@gmail.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
      },
    });

    console.log('Admin user created:', adminUser.email);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
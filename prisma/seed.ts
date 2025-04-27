import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const services = [
    { name: 'IELTS', price: 1400000 },
    { name: 'After Contract (Visa)', price: 4000000 },
    { name: 'Work Permit Processing', price: 7100000 },
    { name: 'Airport Transfer', price: 160000 },
    { name: 'Medical Check', price: 150000 },
    { name: 'Video CV', price: 200000 },
    { name: 'Get Me Academic Docs', price: 1000000 },
    { name: 'Registration', price: 50000 },
  ];

  for (const service of services) {
    await prisma.servicepx.upsert({
      where: { name: service.name },
      update: { price: service.price },
      create: { name: service.name, price: service.price },
    });
  }

  const adminEmail = 'admin@example.com';
  const adminPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.users.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    }
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  const userWithBaby = await prisma.user.create({
    data: {
      email: 'gluron_parent@monoverse.com',
      passwordHash: await bcrypt.hash('password123', 10),
      firstName: 'Bobo',
      lastName: 'Fuggsnucc',
    },
  });

  await prisma.user.create({
    data: {
      email: 'skeptic@monoverse.com',
      passwordHash: await bcrypt.hash('password123', 10),
      firstName: 'Tiggy',
      lastName: 'Skibbles',
    },
  });

  await prisma.baby.create({
    data: {
      firstName: 'Lil',
      lastName: 'Fuggsnucc',
      dateOfBirth: new Date('2023-01-01'),
      gender: 'unknown',
      ownerId: userWithBaby.id,
      caregivers: {
        create: {
          userId: userWithBaby.id,
          relationship: 'PARENT',
        },
      },
      eliminations: {
        create: [
          {
            timestamp: new Date('2024-01-01T08:00:00Z'),
            type: 'wet',
            success: true,
          },
          {
            timestamp: new Date('2024-01-01T12:00:00Z'),
            type: 'dirty',
            success: true,
          },
        ],
      },
      feedings: {
        create: [
          {
            startTime: new Date('2024-01-01T07:00:00Z'),
            type: 'breast',
            side: 'left',
          },
          {
            startTime: new Date('2024-01-01T11:00:00Z'),
            type: 'bottle',
            amount: 120,
          },
        ],
      },
      sleepsleepSessions: {
        create: [
          {
            startTime: new Date('2024-01-01T09:00:00Z'),
            endTime: new Date('2024-01-01T10:30:00Z'),
            type: 'nap',
            quality: 4,
          },
        ],
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

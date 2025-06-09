const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const TEST_IMAGE = "test-image";
const TEST_PREFIX = "tests/";

async function main() {
  // Delete babyPhoto records referencing test images
  await prisma.babyPhoto.deleteMany({
    where: {
      photo: {
        OR: [
          { url: { contains: TEST_IMAGE } },
          { url: { startsWith: TEST_PREFIX } },
        ],
      },
    },
  });

  // Delete photo records
  await prisma.photo.deleteMany({
    where: {
      OR: [
        { url: { contains: TEST_IMAGE } },
        { url: { startsWith: TEST_PREFIX } },
      ],
    },
  });

  // Reset the photo id sequence to max(id) in Photo table
  await prisma.$executeRawUnsafe(
    `SELECT setval('"Photo_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM "Photo"))`
  );
  console.log("Photo ID sequence set to max(id) in Photo table.");

  console.log("Test photo records deleted from DB.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { deleteFromS3 } from '~/.server/s3_auth';
import { join, basename } from 'path';

// Test configuration
const TEST_EMAIL = 'gluron_parent@monoverse.com';
const TEST_PASSWORD = 'password123';
const TEST_IMAGE_PATH = join(process.cwd(), 'e2e/fixtures/test-image.jpg');
const TEST_IMAGE_FILENAME = basename(TEST_IMAGE_PATH);
const TEST_PREFIX = 'tests/';

// Use the Docker database configuration
const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://remix_user:remix_password@localhost:5432/remix_db',
});

// Helper functions
async function getTestUser() {
  const user = await prisma.user.findUnique({
    where: { email: TEST_EMAIL },
    include: {
      ownedBabies: {
        include: {
          photos: {
            include: {
              photo: true,
            },
          },
        },
      },
    },
  });
  
  if (!user || !user.ownedBabies[0]) {
    throw new Error('Test user or baby not found. Please run prisma:seed first.');
  }
  
  return {
    user,
    baby: user.ownedBabies[0],
  };
}

async function cleanupPhotos() {
  const user = await prisma.user.findUnique({
    where: { email: TEST_EMAIL },
    include: {
      ownedBabies: {
        include: {
          photos: {
            include: {
              photo: true,
            },
          },
        },
      },
    },
  });
  
  if (user) {
    for (const baby of user.ownedBabies) {
      for (const babyPhoto of baby.photos) {
        if (babyPhoto.photo.url && (
          babyPhoto.photo.url.includes(TEST_IMAGE_FILENAME) || 
          babyPhoto.photo.url.startsWith(TEST_PREFIX)
        )) {
          await deleteFromS3(babyPhoto.photo.url);
          await prisma.photo.delete({ where: { id: babyPhoto.photo.id } });
        }
      }
      await prisma.babyPhoto.deleteMany({
        where: {
          babyId: baby.id,
          photo: {
            OR: [
              { url: { contains: TEST_IMAGE_FILENAME } },
              { url: { startsWith: TEST_PREFIX } }
            ]
          },
        },
      });
    }
  }
}

test.beforeEach(async () => {
  process.env.NODE_ENV = 'test';
  await cleanupPhotos();
});

test.afterEach(async () => {
  await cleanupPhotos();
  await prisma.$disconnect();
});

test('should upload and display photos on dashboard and modal', async ({ page }) => {
  const { baby } = await getTestUser();
  try {
    // Go to root and login if form is present
    await page.goto('/');
    if (await page.isVisible('input[name="email"]')) {
      await page.fill('input[name="email"]', TEST_EMAIL);
      await page.fill('input[name="password"]', TEST_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=My Babies');
    } else {
      await page.waitForSelector('text=My Babies');
    }

    // Go to Lil Fuggsnucc's dashboard
    await page.click('a[href="/baby/1"]');
    await page.waitForSelector('text=Lil Fuggsnucc');

    // Click the + button in Recent Photos
    // Prefer aria-label if present, else use href
    if (await page.isVisible('a[aria-label="Add photo"]')) {
      await page.click('a[aria-label="Add photo"]');
    } else {
      await page.click('a[href="/baby/1/track/photo"]');
    }

    // Wait for the file input in the modal
    let fileInput = page.locator('input[type="file"]#field\\.photo');
    if (!(await fileInput.isVisible())) {
      fileInput = page.locator('input[type="file"]');
      await fileInput.waitFor({ state: 'attached', timeout: 5000 });
    }
    await fileInput.setInputFiles(TEST_IMAGE_PATH);

    // Click Save
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard and check photo
    await page.waitForSelector('text=Recent Photos');
    const dashboardPhoto = page.locator('img[alt="Featured photo"]').first();
    await dashboardPhoto.waitFor({ state: 'visible', timeout: 15000 });
    await expect(dashboardPhoto).toBeVisible();
    await dashboardPhoto.click();

    // Check modal photo
    const modalImg = page.locator('div[role="dialog"] img, .fixed img, .modal img');
    await modalImg.waitFor({ state: 'visible', timeout: 10000 });
    await expect(modalImg).toBeVisible();
  } finally {
    await cleanupPhotos();
    await prisma.$disconnect();
  }
}); 
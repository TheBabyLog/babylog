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
    await page.goto(`/`);
    if (await page.isVisible('input[name="email"]')) {
      await page.fill('input[name="email"]', TEST_EMAIL);
      await page.fill('input[name="password"]', TEST_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL(/dashboard/);
    } else {
      await page.waitForURL(/dashboard/);
    }

    // Go to photo upload page
    await page.goto(`/baby/${baby.id}/track/photo`);
    const fileInput = page.locator('input[name="photo"]');
    await fileInput.setInputFiles(TEST_IMAGE_PATH);
    // Optionally fill caption
    // await page.fill('input[name="caption"]', 'Test photo');
    await page.click('button[type="submit"]');
    // Wait for redirect to /baby/:id
    let redirected = false;
    try {
      await page.waitForURL(`/baby/${baby.id}`, { timeout: 15000 });
      redirected = true;
    } catch (err) {
      await page.screenshot({ path: 'redirect-fail.png', fullPage: true });
      const html = await page.content();
      console.log('Redirect failed, page HTML:', html);
    }

    // Verify photo is visible in dashboard photo section
    const dashboardPhoto = page.locator('img[alt="Featured photo"]').first();
    try {
      await dashboardPhoto.waitFor({ state: 'visible', timeout: 15000 });
      await expect(dashboardPhoto).toBeVisible();
      await page.waitForFunction(() => {
        const img = document.querySelector('img[alt="Featured photo"]');
        if (!img) return false;
        const image = img as HTMLImageElement;
        return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
      }, null, { timeout: 15000 });
    } catch (err) {
      await page.screenshot({ path: 'dashboard-photo-fail.png', fullPage: true });
      const html = await page.content();
      console.log('Full page HTML:', html);
      throw err;
    }
    const isLoaded = await dashboardPhoto.evaluate((img) => {
      const image = img as HTMLImageElement;
      return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
    });
    expect(isLoaded).toBe(true);
    const src = await dashboardPhoto.getAttribute('src');
    console.log('Dashboard photo src:', src);
    expect(src).toBeTruthy();
    expect(src!).toContain('test-image');
    expect(src!.startsWith('http')).toBe(true);

    // Click image to open modal
    await dashboardPhoto.click();
    // Modal should appear with the image
    const modalImg = page.locator('div[role="dialog"] img, .fixed img, .modal img');
    try {
      await modalImg.waitFor({ state: 'visible', timeout: 10000 });
      await expect(modalImg).toBeVisible();
    } catch (err) {
      await page.screenshot({ path: 'modal-photo-fail.png', fullPage: true });
      const html = await page.content();
      console.log('Modal HTML:', html);
      throw err;
    }
    const modalIsLoaded = await modalImg.evaluate((img) => {
      const image = img as HTMLImageElement;
      return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
    });
    expect(modalIsLoaded).toBe(true);
    const modalSrc = await modalImg.getAttribute('src');
    console.log('Modal photo src:', modalSrc);
    expect(modalSrc).toBeTruthy();
    expect(modalSrc!).toContain('test-image');
    expect(modalSrc!.startsWith('http')).toBe(true);
  } finally {
    await cleanupPhotos();
    await prisma.$disconnect();
  }
}); 
import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
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

test('should upload and display photos on dashboard and modal', async ({ page }) => {
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
  const isDashboardPhotoLoaded = await dashboardPhoto.evaluate((img) => {
    return img instanceof HTMLImageElement && img.naturalWidth > 0 && img.naturalHeight > 0;
  });
  expect(isDashboardPhotoLoaded).toBe(true);
  await dashboardPhoto.click();

  // Check modal photo
  const modalImg = page.locator('div[role="dialog"] img, .fixed img, .modal img');
  await modalImg.waitFor({ state: 'visible', timeout: 10000 });
  await expect(modalImg).toBeVisible();
  const isModalPhotoLoaded = await modalImg.evaluate((img) => {
    return img instanceof HTMLImageElement && img.naturalWidth > 0 && img.naturalHeight > 0;
  });
  expect(isModalPhotoLoaded).toBe(true);
}); 
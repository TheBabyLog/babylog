import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import {getPrismaClient} from '~/db.server';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = getPrismaClient(process.env.DATABASE_URL!);

// Use process.cwd() as a fallback for test asset path
const imagePath = path.resolve(process.cwd(), 'app/tests/assets/test-photo.png');
const imageBuffer = fs.readFileSync(imagePath);

test.afterEach(async () => {
  await prisma.photo.deleteMany({
    where: {
      OR: [
        {caption: 'Test photo caption'},
        {url: {contains:'test-photo'}}  ,
      ]
    }
  });
});

async function login(page: Page) {
  await page.goto('/'); // or your actual login route if different
  await page.getByLabel('Email').fill('gluron_parent@monoverse.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: /login/i }).click();
  // Wait for dashboard or a known post-login element
  await page.waitForURL('/dashboard');
}

test.describe('Photo Upload Flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    // Mock S3 upload response
    await page.route('**/upload', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          filename: 'test-photo.png',
          uploadUrl: 'https://test-bucket.s3.amazonaws.com/test-photo.png'
        })
      });
    });
    // Mock the actual photo URL to return the real test image
    await page.route('**/test-photo.png', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: imageBuffer
      });
    });
  });

  test('should successfully upload a photo and render it correctly', async ({ page }) => {
    await page.goto('/baby/1/track/photo');
    const fileInput = page.locator('input[type="file"][id="field.photo"]');
    await fileInput.setInputFiles({
      name: 'test-photo.png',
      mimeType: 'image/png',
      buffer: imageBuffer
    });
    await page.getByLabel('Caption').fill('Test photo caption');
    await page.getByRole('button', { name: /save/i }).click();
    // Wait for redirect to baby page
    await expect(page).toHaveURL('/baby/1');
    // Use a more specific selector for the photo section
    const photoSection = page.locator('.bg-white.shadow.rounded-lg', { hasText: 'Recent Photos' });
    await expect(photoSection).toBeVisible();
    const photoImage = photoSection.locator('img').first();
    await expect(photoImage).toBeVisible();
    const imageSrc = await photoImage.getAttribute('src');
    expect(imageSrc).toMatch(/test-photo.*\.png/);
    // Ensure the image is not broken
    const isLoaded = await photoImage.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(isLoaded).toBe(true);
    await expect(photoSection.getByText('Test photo caption').first()).toBeVisible();
  });

  test('should show error for invalid file type', async ({ page }) => {
    await page.goto('/baby/1/track/photo');
    const fileInput = page.locator('input[type="file"][id="field.photo"]');
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('invalid file content')
    });
    await page.getByRole('button', { name: /save/i }).click();
    // Verify error message
    await expect(page.getByText('Only image files are allowed')).toBeVisible();
  });

  test('should handle large file size gracefully', async ({ page }) => {
    await page.goto('/baby/1/track/photo');
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB buffer
    const fileInput = page.locator('input[type="file"][id="field.photo"]');
    await fileInput.setInputFiles({
      name: 'large-photo.jpg',
      mimeType: 'image/jpeg',
      buffer: largeBuffer
    });
    await page.getByRole('button', { name: /save/i }).click();
    // Verify error message for large file
    await expect(page.getByText('File size exceeds 5MB limit')).toBeVisible();
  });
}); 